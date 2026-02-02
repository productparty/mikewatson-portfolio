import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle, type NeonDatabase } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

let _pool: Pool | null = null;
let _db: NeonDatabase<typeof schema> | null = null;

function getDb(): NeonDatabase<typeof schema> {
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Database features are not available.",
    );
  }

  if (!_db) {
    _pool = new Pool({ connectionString: process.env.DATABASE_URL });
    _db = drizzle({ client: _pool, schema });
  }

  return _db;
}

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL;
}

// Lazy database - create a proxy that only initializes when accessed
const dbProxy = new Proxy({} as NeonDatabase<typeof schema>, {
  get(_target, prop) {
    return getDb()[prop as keyof NeonDatabase<typeof schema>];
  },
  has(_target, prop) {
    return prop in getDb();
  },
  ownKeys(_target) {
    return Object.keys(getDb());
  },
  getOwnPropertyDescriptor(_target, prop) {
    return Object.getOwnPropertyDescriptor(getDb(), prop);
  },
});

export const db = dbProxy;
