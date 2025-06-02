import type BasePackage from "#common/packages/base-package.d.mts";
import type AdditionalTypesField from "#common/packages/sub-types.d.mts";
import type ClientPackageMixin from "./client-package.d.mts";

import fields = foundry.data.fields;

declare class Module extends ClientPackageMixin(foundry.packages.BaseModule) {
  constructor(data: ClientPackageMixin.ModuleCreateData, options: unknown);

  /**
   * Is this package currently active?
   */
  readonly active: boolean;
}

declare namespace Module {
  /**
   * The data put in {@linkcode DataModel._source}. This data is what was
   * persisted to the database and therefore it must be valid JSON.
   *
   * For example a {@link fields.SetField | `SetField`} is persisted to the database as an array
   * but initialized as a {@linkcode Set}.
   */
  interface Source extends fields.SchemaField.SourceData<Schema> {}

  /**
   * The data necessary to create a data model. Used in places like {@linkcode Module.create}
   * and {@link Module | `new Module(...)`}.
   *
   * For example a {@link fields.SetField | `SetField`} can accept any {@linkcode Iterable}
   * with the right values. This means you can pass a `Set` instance, an array of values,
   * a generator, or any other iterable.
   */
  interface CreateData extends fields.SchemaField.CreateData<Schema> {}

  /**
   * The data after a {@linkcode DataModel} has been initialized, for example
   * {@link Module.name | `Module#name`}.
   *
   * This is data transformed from {@linkcode Module.Source} and turned into more
   * convenient runtime data structures. For example a {@link fields.SetField | `SetField`} is
   * persisted to the database as an array of values but at runtime it is a `Set` instance.
   */
  interface InitializedData extends fields.SchemaField.InitializedData<Schema> {}

  /**
   * The data used to update a document, for example {@link Module.update | `Module#update`}.
   * It is a distinct type from {@link Module.CreateData | `DeepPartial<Module.CreateData>`} because
   * it has different rules for `null` and `undefined`.
   */
  interface UpdateData extends fields.SchemaField.UpdateData<Schema> {}

  /**
   * The schema for {@linkcode Module}. This is the source of truth for how an Module document
   * must be structured.
   *
   * Foundry uses this schema to validate the structure of the {@linkcode Module}. For example
   * a {@link fields.StringField | `StringField`} will enforce that the value is a string. More
   * complex fields like {@link fields.SetField | `SetField`} goes through various conversions
   * starting as an array in the database, initialized as a set, and allows updates with any
   * iterable.
   */
  interface Schema extends BasePackage.Schema {
    /**
     * The current package version
     * @remarks Actually defined in BasePackage but defined here to avoid conflict with BaseWorld
     */
    version: fields.StringField<{ required: true; blank: false; initial: "0" }>;

    /**
     * Does this module provide a translation for the core software?
     */
    coreTranslation: fields.BooleanField;

    /**
     * A library module provides no user-facing functionality and is solely for use by other modules. Loaded before any system or module scripts.
     */
    library: fields.BooleanField;

    /**
     * Additional document sub-types provided by this module.
     */
    documentTypes: AdditionalTypesField;
  }
}

export default Module;
