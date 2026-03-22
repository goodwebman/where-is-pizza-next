import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import 'dotenv/config'
import { PrismaClient } from '../generated/prisma/client'

const connectionString = process.env.DATABASE_URL!
const adapter = new PrismaBetterSqlite3({ url: connectionString })

export const prisma = new PrismaClient({ adapter })
