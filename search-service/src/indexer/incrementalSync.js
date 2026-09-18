import { sequelize } from '../config/db.js';
import { syncSingleProduct } from './indexerWorker.js';
import { checkTypesenseHealth } from '../config/typesenseClient.js';
import { flushCache } from '../config/cache.js';

let isPolling = false;
let pollTimer = null;

export const processPendingOutboxEvents = async () => {
  if (isPolling) return;
  isPolling = true;

  try {
    const isHealthy = await checkTypesenseHealth();
    if (!isHealthy) {
      // Typesense is offline, defer until next interval
      isPolling = false;
      return;
    }

    const [events] = await sequelize.query(`
      SELECT * FROM "Outboxes"
      WHERE "processedAt" IS NULL
      ORDER BY "createdAt" ASC
      LIMIT 50;
    `);

    if (!events || events.length === 0) {
      isPolling = false;
      return;
    }

    let flushed = false;

    for (const event of events) {
      try {
        if (event.aggregateType === 'Product' && event.payload) {
          await syncSingleProduct(event.payload, event.eventType);
          flushed = true;
        }

        await sequelize.query(
          `UPDATE "Outboxes" SET "processedAt" = NOW(), "error" = NULL WHERE "id" = :id;`,
          { replacements: { id: event.id } }
        );
      } catch (err) {
        await sequelize.query(
          `UPDATE "Outboxes" SET "error" = :err WHERE "id" = :id;`,
          { replacements: { id: event.id, err: err.message } }
        );
      }
    }

    if (flushed) {
      await flushCache();
    }
  } catch (err) {
    console.error('[IncrementalSync] Error processing outbox events:', err.message);
  } finally {
    isPolling = false;
  }
};

export const startIncrementalSyncWorker = (intervalMs = 1000) => {
  if (pollTimer) clearInterval(pollTimer);
  console.log(`[IncrementalSync] Started Outbox polling worker every ${intervalMs}ms`);
  pollTimer = setInterval(processPendingOutboxEvents, intervalMs);
};

export const stopIncrementalSyncWorker = () => {
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
    console.log('[IncrementalSync] Stopped Outbox polling worker');
  }
};
