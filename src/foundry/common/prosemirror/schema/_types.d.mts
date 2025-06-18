/* eslint-disable @typescript-eslint/no-unused-vars */
// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

export {};

// These types are only used for internal/private method things; the namespace it would make
// the most sense to put them in otherwise is not accessible under `foundry`

interface AllowedAttributeConfiguration {
  /** The set of exactly-matching attribute names. */
  attrs: Set<string>;

  /** A list of wildcard allowed prefixes for attributes. */
  wildcards: string[];
}

interface ManagedAttributesSpec {
  /** A list of managed attributes. */
  attributes: string[];

  /** A list of CSS property names that are managed as inline styles. */
  styles: string[];

  /** A list of managed class names. */
  classes: string[];
}
