import DataModel from "../abstract/data.mjs";
import * as fields from "../data/fields.mjs";

declare namespace ApplicationConfiguration {
  type Schema = {};
}

interface ApplicationConfiguration extends fields.SchemaField.InnerInitializedType<ApplicationConfiguration.Schema> {}

declare class ApplicationConfiguration extends DataModel<fields.SchemaField<ApplicationConfiguration.Schema>> {}

export { ApplicationConfiguration };
