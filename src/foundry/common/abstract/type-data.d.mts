import type { Merge } from "../../../types/utils.d.mts";
import type DataModel from "./data.d.mts";
import type Document from "./document.d.mts";

interface _InternalTypeDataModelInterface extends DataModel<DataSchema, Document<DataSchema, any, any>> {
  new <_ComputedInstance extends object>(...args: ConstructorParameters<typeof DataModel>): _ComputedInstance;
}

declare const _InternalTypeDataModelConst: _InternalTypeDataModelInterface;

// @ts-expect-error Ignore the error, this is a workaround for a dynamic class.
declare class _InternalTypeDataModel<
  Schema extends DataSchema,
  Parent extends Document<DataSchema, any, any>,
  BaseData extends Record<string, unknown> = Record<never, never>,
  DerivedData extends Record<string, unknown> = Record<never, never>,
  // This does not work if inlined. It's weird to put it here but it works.
  _ComputedInstance extends object = Merge<Merge<DataModel<Schema, Parent>, BaseData>, DerivedData>,
> extends _InternalTypeDataModelConst<_ComputedInstance> {}

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
  BaseData extends Record<string, any> = Record<never, never>,
  DerivedData extends Record<string, any> = Record<never, never>,
> extends _InternalTypeDataModel<Schema, Parent, BaseData, DerivedData> {
  modelProvider: System | Module | null;

  /**
   * Prepare data related to this DataModel itself, before any derived data is computed.
   */
  prepareBaseData(this: Merge<DataModel<Schema, Parent>, Partial<DerivedData>>): void;

  /* -------------------------------------------- */

  /**
   * Apply transformations of derivations to the values of the source data object.
   * Compute data fields whose values are not stored to the database.
   */
  prepareDerivedData(this: Merge<Merge<DataModel<Schema, Parent>, BaseData>, Partial<DerivedData>>): void;
}
