import { typesenseClient, COLLECTION_ALIAS } from '../config/typesenseClient.js';
import { getCollectionSchema, transformProductForIndex } from './schema.js';
import { searchConfig } from '../config/searchConfig.js';
import { sequelize } from '../config/db.js';

/**
 * Performs a zero-downtime full catalog reindex:
 * 1. Generates timestamped collection name: cartverse_products_YYYYMMDD_HHMMSS
 * 2. Fetches all products from PostgreSQL in batches
 * 3. Ingests documents into the new collection
 * 4. Configures hardware synonym dictionaries
 * 5. Atomically points the alias to the new collection
 * 6. Drops the previous collection
 */
export const runFullReindex = async () => {
  const timestamp = new Date().toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
  const newCollectionName = `${COLLECTION_ALIAS}_${timestamp}`;

  console.log(`[Indexer] Starting full reindex into collection: ${newCollectionName}`);

  // 1. Identify previous collection behind the alias
  let oldCollectionName = null;
  try {
    const aliasObj = await typesenseClient.aliases(COLLECTION_ALIAS).retrieve();
    if (aliasObj && aliasObj.collection_name) {
      oldCollectionName = aliasObj.collection_name;
      console.log(`[Indexer] Existing collection for alias is: ${oldCollectionName}`);
    }
  } catch (err) {
    console.log(`[Indexer] No prior alias found for ${COLLECTION_ALIAS}`);
  }

  // 2. Create the new collection schema
  const schema = getCollectionSchema(newCollectionName);
  await typesenseClient.collections().create(schema);
  console.log(`[Indexer] Created new collection ${newCollectionName}`);

  // 3. Batch import products from PostgreSQL
  const batchSize = 250;
  let offset = 0;
  let totalIndexed = 0;

  while (true) {
    const [products] = await sequelize.query(
      `SELECT * FROM "Products" ORDER BY "createdAt" ASC LIMIT ${batchSize} OFFSET ${offset};`
    );

    if (!products || products.length === 0) {
      break;
    }

    const documents = products.map(transformProductForIndex);
    const importResults = await typesenseClient
      .collections(newCollectionName)
      .documents()
      .import(documents, { action: 'upsert' });

    const failed = importResults.filter((res) => !res.success);
    if (failed.length > 0) {
      console.warn(`[Indexer] Warning: ${failed.length} documents failed during batch import.`);
    }

    totalIndexed += documents.length;
    offset += batchSize;
    console.log(`[Indexer] Indexed ${totalIndexed} products...`);
  }

  // 4. Configure synonyms in the new collection
  for (const syn of searchConfig.synonyms) {
    try {
      await typesenseClient
        .collections(newCollectionName)
        .synonyms()
        .upsert(syn.id, {
          synonyms: syn.synonyms,
        });
    } catch (synErr) {
      console.warn(`[Indexer] Could not configure synonym ${syn.id}:`, synErr.message);
    }
  }
  console.log(`[Indexer] Configured ${searchConfig.synonyms.length} synonym rules.`);

  // 5. Atomically update the alias
  await typesenseClient.aliases().upsert(COLLECTION_ALIAS, {
    collection_name: newCollectionName,
  });
  console.log(`[Indexer] Alias ${COLLECTION_ALIAS} atomically updated to ${newCollectionName}`);

  // 6. Drop the previous collection to reclaim resources
  if (oldCollectionName && oldCollectionName !== newCollectionName) {
    try {
      await typesenseClient.collections(oldCollectionName).delete();
      console.log(`[Indexer] Dropped old collection: ${oldCollectionName}`);
    } catch (dropErr) {
      console.warn(`[Indexer] Could not drop old collection ${oldCollectionName}:`, dropErr.message);
    }
  }

  console.log(`[Indexer] Full reindexing complete! Total indexed: ${totalIndexed}`);
  return { newCollectionName, totalIndexed, oldCollectionName };
};

/**
 * Upsert or delete a single product document in Typesense
 */
export const syncSingleProduct = async (productData, eventType = 'updated') => {
  try {
    const id = String(productData.productId || productData.id);
    if (eventType === 'deleted') {
      await typesenseClient.collections(COLLECTION_ALIAS).documents(id).delete();
      console.log(`[Indexer] Deleted document ${id} from search index`);
    } else {
      const doc = transformProductForIndex(productData);
      await typesenseClient.collections(COLLECTION_ALIAS).documents().upsert(doc);
      console.log(`[Indexer] Upserted document ${id} into search index`);
    }
  } catch (err) {
    console.error(`[Indexer] Failed to sync product ${productData.productId}:`, err.message);
    throw err;
  }
};
