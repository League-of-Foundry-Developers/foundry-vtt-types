import DataModel from "../abstract/data.mjs";
import * as fields from "../data/fields.mjs";

declare namespace ApplicationConfiguration {
  type Schema = {};
}

export class ApplicationConfiguration extends DataModel<fields.SchemaField<ApplicationConfiguration.Schema>> {}
