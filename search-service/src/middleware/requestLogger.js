export const requestLogger = (req, res, next) => {
  const start = performance.now();

  res.on('finish', () => {
    const duration = Math.round(performance.now() - start);
    const logData = {
      timestamp: new Date().toISOString(),
      method: req.method,
      path: req.originalUrl || req.url,
      statusCode: res.statusCode,
      durationMs: duration,
      ip: req.ip || req.headers['x-forwarded-for'] || '127.0.0.1',
      cache: res.getHeader('X-Cache') || 'NONE',
      engine: res.getHeader('X-Search-Engine') || 'N/A',
      query: req.query.q || undefined,
    };

    console.log(`[SearchService] ${JSON.stringify(logData)}`);
  });

  next();
};
