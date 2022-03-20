
import { AnyDocument } from "types/documents";
import { trimFields } from "src/security";
import { Auth } from "controllers/auth";
import { Descriptor } from "./types";

/**
 * Validates that the document matches the dynamic access function provided in a decorator
 * @param descriptor The descriptor of the database access function being processsed
 * @param doc The document to validate access for
 */
export function validateDynamicAccess(descriptor: Descriptor, doc: any) {
  if (!descriptor.dynamicAccess) { return; }
  const error = descriptor.dynamicAccess(doc);
  if (error) { throw error; }
}

/**
 * Validates that the document matches the static access function provided in a decorator
 * @param descriptor The descriptor of the database access function being processsed
 */
export function validateStaticAccess(descriptor: Descriptor) {
  if (!descriptor.staticAccess) { return; }
  // TODO - cache this value
  const error = descriptor.staticAccess();
  if (error) { throw error; }
}

/**
 * Validates the document to ensure that the data being saved matches what is expected
 * @param descriptor The descriptor of the database access function being processsed
 * @param doc The document to validate
 */
export function validateDocument(descriptor: Descriptor, doc: any) {
  // TODO - make this required by default. SERIOUSLY. SECURITY VULN. DO NOT KEEP
  if (!descriptor.validation) {
    console.warn("SET VALIDATION OR MAKE VALIDATION REQUIRED BY DEFAULT");
    return;
  }
  descriptor.validation(doc);
}

/**
 * Checks if the overarching function requires the user to be logged in. Throws an error on failure
 * @param descriptor The descriptor of the database logic function being processsed
 */
export function validateLogin(descriptor: Descriptor): void {
  // Nabs the login requirement. If requireLogin is present, use it, but then default to true
  const isLoginRequired = descriptor.requireLogin !== undefined ?  descriptor.requireLogin : false;
  if (isLoginRequired === false) { return; }
  if (!Auth.isLoggedIn) {
    throw `You must be logged in to access the ${descriptor.collection}`;
  }
}

/**
 * Sets the fields required on creation. Returns the updated document
 * @param doc The document to add the fields to
 */
export function setCreateFields(doc: Partial<AnyDocument>): Partial<AnyDocument> {
  doc.createdAt = new Date();
  doc.createdBy = { ref: Auth.user?.ref || "" };
  doc.ownedBy = { ref: Auth.user?.ref || "" };
  doc = setUpdateFields(doc);
  return doc;
}

/**
 * Sets the fields required on update. Returns the updated document
 * @param doc The document to add the fields to
 */
export function setUpdateFields(doc: Partial<AnyDocument>): Partial<AnyDocument> {
  doc.updatedAt = new Date();
  doc.updatedBy = { ref: Auth.user?.ref || "" };
  return doc;
}


/**
 * Trims out the fields of a given document a user is not allowed to read
 * @param descriptor The descriptor of the database logic function being processsed
 * @param doc The document to trim fields from
 * @returns A single document with some or all of its fields trimmed
 */
export function trimReadFields(descriptor: Descriptor, doc: any): Partial<AnyDocument> {
  if (!descriptor.readFields) { throw `Read fields are required for all document access`; }
  const fields: string[] = Array.isArray(descriptor.readFields) ? descriptor.readFields : descriptor.readFields(doc);
  const newDoc = trimFields(doc, fields);
  return newDoc;
}

/**
 * Trims out the fields of a given document a user is not allowed to set
 * @param descriptor The descriptor of the database logic function being processsed
 * @param doc The document to trim fields from
 * @returns A single document with some or all of its fields trimmed
 */
export function trimSetFields(descriptor: Descriptor, doc: AnyDocument): Partial<AnyDocument> {
  if (!descriptor.setFields) { throw `Set fields are required for all document modification`; }
  const fields: string[] = Array.isArray(descriptor.setFields) ? descriptor.setFields : descriptor.setFields(doc);
  const newDoc = trimFields(doc, fields);
  return newDoc;
}

