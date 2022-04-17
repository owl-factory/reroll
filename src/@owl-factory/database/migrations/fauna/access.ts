import { RawMigration } from "@owl-factory/database/types/migrations/fauna";
import { deepCopy } from "@owl-factory/utilities/objects";
import { defaultDocuments, migrations, versions } from "./data";

/**
 * Fetches the stored version for a collection
 * @param collection The collection to fetch the version for
 * @returns The current version. 0.0.0 if none is present
 */
export function getVersion(collection: string): string {
  return versions[collection] || "0.0.0";
}

/**
 * Fetches the stored default document for a collection
 * @param collection The collection to fetch the default document for
 * @returns The current default document. Returns empty with the default version if none is present
 */
export function getDefaultDocument(collection: string): Record<string, unknown> {
  const doc = defaultDocuments[collection] || { _v: "0.0.0" };
  return deepCopy(doc);
}

/**
 * Fetches the stored migrations for a given collection
 * @param collection The collection to fetch the migrations from
 * @returns A list of all of the migrations for a collection
 */
export function getMigrations(collection: string): RawMigration[] {
  return migrations[collection] || [];
}

/**
 * Sets the version for a collection
 * @param collection The collection to set the version for
 * @param version The new version
 */
export function setVersion(collection: string, version: string) {
  versions[collection] = version;
}

/**
 * Sets the default document for a collection
 * @param collection The collection to set the default document for
 * @param defaultDocument The new default document
 */
export function setDefaultDocument(collection: string, defaultDocument: Record<string, unknown>) {
  defaultDocuments[collection] = defaultDocument;
}

/**
 * Sets the migration for a collection
 * @param collection The collection to set the migration for
 * @param migration The new migration
 */
export function setMigrations(collection: string, migration: RawMigration[]) {
  migrations[collection] = migration;
}
