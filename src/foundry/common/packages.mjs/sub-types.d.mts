import type { ObjectField } from "../data/fields.d.mts";

/**
 * A special [ObjectField]{@link ObjectField} available to packages which configures any additional Document sub-types
 * provided by the package.
 */
export default class AdditionalTypesField extends ObjectField {}
