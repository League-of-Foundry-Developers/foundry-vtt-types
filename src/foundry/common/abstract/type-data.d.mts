import type { Merge, RemoveIndexSignatures } from "../../../types/utils.d.mts";
import type BaseUser from "../documents/user.d.mts";
import type DataModel from "./data.d.mts";
import type Document from "./document.d.mts";
import type { DocumentModificationOptions } from "./document.d.mts";
import type { fields } from "../data/module.mts";

type StaticDataModel = typeof DataModel<DataSchema, Document<DataSchema, any, any>>;

interface _InternalTypeDataModelInterface extends StaticDataModel {
  new <Schema extends DataSchema, Parent extends Document<DataSchema, any, any>, _ComputedInstance extends object>(
    ...args: ConstructorParameters<typeof DataModel>
  ): DataModel<Schema, Parent> & _ComputedInstance;
}

declare const _InternalTypeDataModelConst: _InternalTypeDataModelInterface;

// @ts-expect-error Ignore the error, this is a workaround for a dynamic class.
declare class _InternalTypeDataModel<
  Schema extends DataSchema,
  Parent extends Document<DataSchema, any, any>,
  DerivedData extends Record<string, unknown> = Record<string, never>,
  // This does not work if inlined. It's weird to put it here but it works.
  _ComputedInstance extends object = DerivedData,
> extends _InternalTypeDataModelConst<Schema, Parent, _ComputedInstance> {}

/**
 * A specialized subclass of DataModel, intended to represent a Document's type-specific data.
 * Systems or Modules that provide DataModel implementations for sub-types of Documents (such as Actors or Items)
 * should subclass this class instead of the base DataModel class.
 *
 *
 * @example Registering a custom sub-type for a Module.
 *
 * **module.json**
 * ```json
 * {
 *   "id": "my-module",
 *   "esmodules": ["main.mjs"],
 *   "documentTypes": {
 *     "Actor": {
 *       "sidekick": {},
 *       "villain": {}
 *     },
 *     "JournalEntryPage": {
 *       "dossier": {},
 *       "quest": {
 *         "htmlFields": ["description"]
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * **main.mjs**
 * ```js
 * Hooks.on("init", () => {
 *   Object.assign(CONFIG.Actor.dataModels, {
 *     "my-module.sidekick": SidekickModel,
 *     "my-module.villain": VillainModel
 *   });
 *   Object.assign(CONFIG.JournalEntryPage.dataModels, {
 *     "my-module.dossier": DossierModel,
 *     "my-module.quest": QuestModel
 *   });
 * });
 *
 * class QuestModel extends foundry.abstract.TypeDataModel {
 *   static defineSchema() {
 *     const fields = foundry.data.fields;
 *     return {
 *       description: new fields.HTMLField({required: false, blank: true, initial: ""}),
 *       steps: new fields.ArrayField(new fields.StringField())
 *     };
 *   }
 *
 *   prepareDerivedData() {
 *     this.totalSteps = this.steps.length;
 *   }
 * }
 * ```
 */
export default abstract class TypeDataModel<
  Schema extends DataSchema,
  Parent extends Document<DataSchema, any, any>,
  DerivedData extends Record<string, unknown> = RemoveIndexSignatures<Record<string, never>>,
> extends _InternalTypeDataModel<Schema, Parent, DerivedData> {
  modelProvider: System | Module | null;

  /**
   * A set of localization prefix paths which are used by this data model.
   */
  static LOCALIZATION_PREFIXES: string[];

  /**
   * Prepare data related to this DataModel itself, before any derived data is computed.
   *
   * Called before {@link ClientDocument#prepareBaseData} in {@link ClientDocument#prepareData}.
   * */
  prepareBaseData(this: DataModel<Schema, Parent>): void;

  /**
   * Apply transformations of derivations to the values of the source data object.
   * Compute data fields whose values are not stored to the database.
   *
   * Called before {@link ClientDocument#prepareDerivedData} in {@link ClientDocument#prepareData}.
   */
  prepareDerivedData(this: Merge<DataModel<Schema, Parent>, Partial<DerivedData>>): void;

  /**
   * Convert this Document to some HTML display for embedding purposes.
   * @param config  - Configuration for embedding behavior.
   * @param options - The original enrichment options for cases where the Document embed content
   *                  also contains text that must be enriched.
   */
  toEmbed(
    config: TextEditor.DocumentHTMLEmbedConfig,
    options: TextEditor.EnrichmentOptions,
  ): Promise<HTMLElement | HTMLCollection | null>;

  /* -------------------------------------------- */
  /*  Database Operations                         */
  /* -------------------------------------------- */

  /**
   * Called by {@link ClientDocument#_preCreate}.
   *
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param user    - The User requesting the document creation
   * @returns Return false to exclude this Document from the creation operation
   */
  protected _preCreate(
    data: fields.SchemaField.AssignmentType<Schema>,
    options: DocumentModificationOptions,
    user: BaseUser,
  ): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument#_onCreate}.
   *
   * @param data    - The initial data object provided to the document creation request
   * @param options - Additional options which modify the creation request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onCreate(
    data: fields.SchemaField.AssignmentType<Schema>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Called by {@link ClientDocument#_preUpdate}.
   *
   * @param changes - The candidate changes to the Document
   * @param options - Additional options which modify the update request
   * @param user    - The User requesting the document update
   * @returns A return value of false indicates the update operation should be cancelled.
   */
  protected _preUpdate(
    changes: fields.SchemaField.AssignmentType<Schema>,
    options: DocumentModificationOptions,
    userId: string,
  ): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument#_onUpdate}.
   *
   * @param changed - The differential data that was changed relative to the documents prior values
   * @param options - Additional options which modify the update request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onUpdate(
    changed: fields.SchemaField.AssignmentType<Schema>,
    options: DocumentModificationOptions,
    userId: string,
  ): void;

  /**
   * Called by {@link ClientDocument#_preDelete}.
   *
   * @param options - Additional options which modify the deletion request
   * @param user    - The User requesting the document deletion
   * @returns A return value of false indicates the deletion operation should be cancelled.
   */
  protected _preDelete(options: DocumentModificationOptions, user: BaseUser): Promise<boolean | void>;

  /**
   * Called by {@link ClientDocument#_onDelete}.
   *
   * @param options - Additional options which modify the deletion request
   * @param userId  - The id of the User requesting the document update
   */
  protected _onDelete(options: DocumentModificationOptions, userId: string): void;
}
