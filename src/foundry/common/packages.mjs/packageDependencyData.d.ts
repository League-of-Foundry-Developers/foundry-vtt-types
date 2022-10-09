import { FieldReturnType, PropertiesToSource } from "../../../types/helperTypes";
import { DocumentData } from "../abstract/module.mjs";
import * as fields from "../data/fields.mjs";

interface PackageDependencyDataSchema extends DocumentSchema {
  name: fields.RequiredString;
  type: FieldReturnType<
    fields.RequiredString,
    {
      default: "module";
      validate: (v: unknown) => boolean;
      validationError: 'Invalid package type "{value}" which must be a value from CONST.PACKAGE_TYPES';
    }
  >;
  manifest: fields.StringField;
}

interface PackageDependencyDataProperties {
  /** The dependency package name */
  name: string;

  /**
   * The dependency package type, from CONST.PACKAGE_TYPES
   * @defaultValue `"module"`
   */
  type: foundry.CONST.PACKAGE_TYPES;

  /** An explicit manifest URL, otherwise learned from the Foundry web server */
  manifest: string | undefined;
}

interface PackageDependencyDataConstructorData {
  /** The dependency package name */
  name: string;

  /**
   * The dependency package type, from CONST.PACKAGE_TYPES
   * @defaultValue `"module"`
   */
  type?: foundry.CONST.PACKAGE_TYPES | null | undefined;

  /** An explicit manifest URL, otherwise learned from the Foundry web server */
  manifest?: string | null | undefined;
}

type PackageDependencyDataSource = PropertiesToSource<PackageDependencyDataProperties>;

/**
 * An inner data object which represents a single package dependency in the dependencies array.
 */
export class PackageDependencyData extends DocumentData<
  PackageDependencyDataSchema,
  PackageDependencyDataProperties,
  PackageDependencyDataSource,
  PackageDependencyDataConstructorData
> {
  static override defineSchema(): PackageDependencyDataSchema;

  protected override _getMissingFieldErrorMessage(name: string, field: DocumentField<unknown>): string;

  protected override _getInvalidFieldValueErrorMessage(
    name: string,
    field: DocumentField<unknown>,
    value: unknown
  ): string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PackageDependencyData extends PackageDependencyDataProperties {}
