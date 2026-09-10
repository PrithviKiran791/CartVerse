// Seed data — plaintext passwords here are hashed automatically by the
// User model's pre-save hook when inserted with User.create() in seeder.js
const users = [
  { name: 'Admin User', email: 'admin@cartverse.in', password: 'AdminPass123', isAdmin: true },
  { name: 'Test User', email: 'test@cartverse.in', password: 'TestPass123', isAdmin: false },
];

export default users; 