import 'dotenv/config';

// Unit tests never touch the database, but importing anything under src/server
// pulls in config/env, which validates these at module load.
process.env.DATABASE_URL ??= 'postgresql://unit:unit@localhost:5432/unit';
process.env.JWT_SECRET ??= 'unit-test-secret-'.padEnd(48, 'x');
process.env.SITE_URL ??= 'http://localhost:3000';
