import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Ein Client pro Prozess (Next.js Dev-Hot-Reload würde sonst bei jedem Reload
// eine neue Connection aufmachen und alte nie schließen).
declare global {
  var __zntxPgClient: ReturnType<typeof postgres> | undefined;
}

function getClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL ist nicht gesetzt — siehe .env.example");
  }
  if (!global.__zntxPgClient) {
    global.__zntxPgClient = postgres(url, { max: 5 });
  }
  return global.__zntxPgClient;
}

export const db = drizzle(getClient(), { schema });
