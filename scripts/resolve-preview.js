const { execSync } = require('child_process');
try {
  execSync('npx prisma migrate resolve --applied 20250606000000_init --schema=prisma/schema.prisma', { stdio: 'inherit' });
} catch (e) {
  console.error('Prisma resolve failed:', e.message);
  process.exit(1);
}
