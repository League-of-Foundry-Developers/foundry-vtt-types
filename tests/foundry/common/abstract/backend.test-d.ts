// Most `DatabaseBackend` coverage lives in `tests/foundry/client/data/client-backend.test-d.ts`;
// this file covers the abstract operation interfaces themselves.

import { expectTypeOf } from "vitest";

import type { AnyObject, FixedInstanceType, LoggingLevels } from "#utils";

import DatabaseBackend = foundry.abstract.DatabaseBackend;
import Document = foundry.abstract.Document;

declare const getOperation: DatabaseBackend.GetOperation;
declare const createOperation: DatabaseBackend.CreateOperation;
declare const updateOperation: DatabaseBackend.UpdateOperation;
declare const deleteOperation: DatabaseBackend.DeleteOperation;

// `DatabaseBackend##configureOperation` sets `documentName` on every operation before it reaches `_[action]Documents`.
expectTypeOf(getOperation.documentName).toEqualTypeOf<Document.Type>();
expectTypeOf(createOperation.documentName).toEqualTypeOf<Document.Type>();
expectTypeOf(updateOperation.documentName).toEqualTypeOf<Document.Type>();
expectTypeOf(deleteOperation.documentName).toEqualTypeOf<Document.Type>();

expectTypeOf(getOperation.dryRun).toEqualTypeOf<boolean | undefined>();
expectTypeOf(deleteOperation.dryRun).toEqualTypeOf<boolean | undefined>();
expectTypeOf(getOperation.queryOptions).toEqualTypeOf<AnyObject | undefined>();
expectTypeOf(createOperation.controlObject).toEqualTypeOf<boolean | undefined>();

// `documentName` is set from the passed document class in `#configureOperation`, so it cannot be provided by the
// caller-facing `Backend*Operation` types...
declare const backendCreateOperation: Actor.Database.BackendCreateOperation;
declare const backendUpdateOperation: Actor.Database.BackendUpdateOperation;
declare const backendDeleteOperation: Actor.Database.BackendDeleteOperation;
expectTypeOf(backendCreateOperation).not.toHaveProperty("documentName");
expectTypeOf(backendUpdateOperation).not.toHaveProperty("documentName");
expectTypeOf(backendDeleteOperation).not.toHaveProperty("documentName");

// @ts-expect-error `documentName` is not assignable; it isn't a key of `BackendCreateOperation` at all.
backendCreateOperation.documentName = "Actor";

// ...but it's present on the post-`#configureOperation` operation received by `_createDocuments` et al.
declare const stampedCreateOperation: Actor.Database.CreateOperation;
declare const stampedUpdateOperation: Actor.Database.UpdateOperation;
declare const stampedDeleteOperation: Actor.Database.DeleteOperation;
expectTypeOf(stampedCreateOperation).toHaveProperty("documentName");
expectTypeOf(stampedUpdateOperation).toHaveProperty("documentName");
expectTypeOf(stampedDeleteOperation).toHaveProperty("documentName");

declare const logOperationContext: DatabaseBackend.LogOperationContext;
expectTypeOf(logOperationContext.dryRun).toEqualTypeOf<boolean | undefined>();

// `_logError` takes no logging level, and so cannot be part of a dry run either.
declare const logErrorContext: DatabaseBackend.LogErrorContext;
expectTypeOf(logErrorContext).not.toHaveProperty("level");
expectTypeOf(logErrorContext).not.toHaveProperty("dryRun");

declare const user: User.Stored;
declare const documents: foundry.abstract.Document.Any[];

class _TestDatabaseBackend extends DatabaseBackend {
  override getFlagScopes(): string[] {
    return [];
  }

  override getCompendiumScopes(): string[] {
    return [];
  }

  protected override _getDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
  ): Promise<FixedInstanceType<DocClass>[]> {
    void documentClass;
    return Promise.resolve([]);
  }

  protected override _createDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
  ): Promise<FixedInstanceType<DocClass>[]> {
    void documentClass;
    return Promise.resolve([]);
  }

  protected override _updateDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
  ): Promise<FixedInstanceType<DocClass>[]> {
    void documentClass;
    return Promise.resolve([]);
  }

  protected override _deleteDocuments<DocClass extends Document.AnyConstructor>(
    documentClass: DocClass,
  ): Promise<FixedInstanceType<DocClass>[]> {
    void documentClass;
    return Promise.resolve([]);
  }

  protected override _log(level: LoggingLevels, message: string): void {
    void level;
    void message;
  }

  testLogging(): void {
    expectTypeOf(this["_logOperation"]("create", "Actor", documents)).toBeVoid();
    expectTypeOf(this["_logOperation"]("create", "Actor", documents, { dryRun: true, level: "debug" })).toBeVoid();

    // `subject` is a positional parameter ahead of the context, and takes either a Document or a plain description.
    expectTypeOf(this["_logError"](user, "create", documents[0]!)).toBeString();
    expectTypeOf(this["_logError"](user, "create", "a new Actor", { pack: "world.actors" })).toBeString();
  }
}
