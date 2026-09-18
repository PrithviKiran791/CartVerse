import dotenv from 'dotenv';
dotenv.config();

import { runFullReindex } from '../src/indexer/indexerWorker.js';
import { testDbConnection } from '../src/config/db.js';
import { checkTypesenseHealth } from '../src/config/typesenseClient.js';

const main = async () => {
  console.log('==============================================');
  console.log('     CartVerse Search Full Catalog Reindexer  ');
  console.log('==============================================');

  const dbOk = await testDbConnection();
  if (!dbOk) {
    console.error('ERROR: PostgreSQL connection failed.');
    process.exit(1);
  }

  const tsOk = await checkTypesenseHealth();
  if (!tsOk) {
    console.error('ERROR: Typesense is not reachable. Ensure Typesense is running before reindexing.');
    process.exit(1);
  }

  try {
    const res = await runFullReindex();
    console.log('\n Reindex finished successfully!');
    console.log(`Active collection: ${res.newCollectionName}`);
    console.log(`Total documents indexed: ${res.totalIndexed}`);
    process.exit(0);
  } catch (err) {
    console.error('\n Reindex failed:', err);
    process.exit(1);
  }
};

main();
