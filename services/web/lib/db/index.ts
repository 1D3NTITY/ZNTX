import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

type Db = ReturnType<typeof drizzle<typeof schema>>;

declare global {
  var __zntxPgClient: ReturnType<typeof postgres> | undefined;
  var __zntxDb: Db | undefined;
}

function createDb(): Db {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL ist nicht gesetzt — siehe .env.example");
  }
  if (!global.__zntxPgClient) {
    global.__zntxPgClient = postgres(url, { max: 5 });
  }
  return drizzle(global.__zntxPgClient, { schema });
}

// Lazy via Proxy: die eigentliche Verbindung wird erst beim ersten echten
// Query-Aufruf aufgebaut, nicht beim Modul-Import. Next.js importiert
// app/api/contact/route.ts während "collect page data" im Build — zu diesem
// Zeitpunkt ist DATABASE_URL (Laufzeit-Env aus dem Container) noch nicht
// gesetzt. Ohne Lazy-Init würde das den Build brechen, obwohl zur Laufzeit
// alles korrekt konfiguriert ist.
export const db: Db = new Proxy({} as Db, {
  get(_target, prop, receiver) {
    if (!global.__zntxDb) {
      global.__zntxDb = createDb();
    }
    return Reflect.get(global.__zntxDb as object, prop, receiver);
  },
});
