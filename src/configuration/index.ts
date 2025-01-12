/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * Use this interface to configure your custom generic `ActiveEffect` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredActiveEffect<SubType extends ActiveEffect.SubType> extends CustomActiveEffect<SubType> {}
 * }
 * ```
 */
export interface ConfiguredActiveEffect<_SubType extends ActiveEffect.SubType> {}

/**
 * Use this interface to configure your custom generic `Item` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredItem<SubType extends Item.SubType> extends CustomItem<SubType> {}
 * }
 * ```
 */
export interface ConfiguredItem<_SubType extends Item.SubType> {}
