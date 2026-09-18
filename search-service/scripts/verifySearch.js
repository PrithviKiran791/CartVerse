async function verify() {
  console.log('--- 1. Testing Search Service Health ---');
  const health = await fetch('http://localhost:5001/healthz').then((r) => r.json());
  console.log('Health:', health);

  console.log('\n--- 2. Testing Autocomplete Suggestions ---');
  const suggest = await fetch('http://localhost:5001/api/v1/search/suggest?q=rtx').then((r) => r.json());
  console.log('Suggest count:', suggest.products?.length, 'First product:', suggest.products?.[0]?.name);

  console.log('\n--- 3. Testing Full Search with Model Number ---');
  const search = await fetch('http://localhost:5001/api/v1/search?q=4070&per_page=3').then((r) => r.json());
  console.log('Hits for 4070:', search.totalHits, 'Degraded:', search.degraded);
  console.log('First hit:', search.hits?.[0]?.document?.name, 'Price:', search.hits?.[0]?.document?.price);

  console.log('\n--- 4. Testing Facets ---');
  const facets = await fetch('http://localhost:5001/api/v1/search/facets').then((r) => r.json());
  console.log('Facet fields:', facets.facets?.map((f) => f.field_name));

  console.log('\n--- 5. Testing Backend Proxy (port 5000) ---');
  const proxy = await fetch('http://localhost:5000/api/v1/search?q=i7&per_page=2').then((r) => r.json());
  console.log('Proxy hits for i7:', proxy.totalHits);

  console.log('\n--- 6. Verifying SearchAnalytics Table in PostgreSQL ---');
  const { sequelize } = await import('../../backend/models/index.js');
  const [analytics] = await sequelize.query('SELECT count(*)::int as count, max(query) as last_query FROM "SearchAnalytics";');
  console.log('SearchAnalytics count:', analytics[0]);
  await sequelize.close();
}

verify().catch(console.error);
