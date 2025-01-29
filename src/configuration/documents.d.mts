/* eslint-disable @typescript-eslint/no-empty-object-type */

/**
 * Use this interface to configure your custom generic `ActiveEffect` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomActiveEffect<
 *   SubType extends ActiveEffect.SubType
 * > extends ActiveEffect<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredActiveEffect<SubType extends ActiveEffect.SubType> extends CustomActiveEffect<SubType> {}
 * }
 * ```
 */
export interface ConfiguredActiveEffect<_SubType extends ActiveEffect.SubType> {}

/**
 * Use this interface to configure your custom generic `ActorDelta` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomActorDelta<
 *   SubType extends ActorDelta.SubType
 * > extends ActorDelta<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredActorDelta<SubType extends ActorDelta.SubType> extends CustomActorDelta<SubType> {}
 * }
 * ```
 */
export interface ConfiguredActorDelta<_SubType extends ActorDelta.SubType> {}

/**
 * Use this interface to configure your custom generic `Actor` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomActor<
 *   SubType extends Actor.SubType
 * > extends Actor<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredActor<SubType extends Actor.SubType> extends CustomActor<SubType> {}
 * }
 * ```
 */
export interface ConfiguredActor<_SubType extends Actor.SubType> {}

/**
 * Use this interface to configure your custom generic `Card` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomCard<
 *   SubType extends Card.SubType
 * > extends Card<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredCard<SubType extends Card.SubType> extends CustomCard<SubType> {}
 * }
 * ```
 */
export interface ConfiguredCard<_SubType extends Card.SubType> {}

/**
 * Use this interface to configure your custom generic `Cards` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomCards<
 *   SubType extends Cards.SubType
 * > extends Cards<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredCards<SubType extends Cards.SubType> extends CustomCards<SubType> {}
 * }
 * ```
 */
export interface ConfiguredCards<_SubType extends Cards.SubType> {}

/**
 * Use this interface to configure your custom generic `ChatMessage` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomChatMessage<
 *   SubType extends ChatMessage.SubType
 * > extends ChatMessage<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredChatMessage<SubType extends ChatMessage.SubType> extends CustomChatMessage<SubType> {}
 * }
 * ```
 */
export interface ConfiguredChatMessage<_SubType extends ChatMessage.SubType> {}

/**
 * Use this interface to configure your custom generic `Combat` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomCombat<
 *   SubType extends Combat.SubType
 * > extends Combat<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredCombat<SubType extends Combat.SubType> extends CustomCombat<SubType> {}
 * }
 * ```
 */
export interface ConfiguredCombat<_SubType extends Combat.SubType> {}

/**
 * Use this interface to configure your custom generic `Combatant` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomCombatant<
 *   SubType extends Combatant.SubType
 * > extends Combatant<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredCombatant<SubType extends Combatant.SubType> extends CustomCombatant<SubType> {}
 * }
 * ```
 */
export interface ConfiguredCombatant<_SubType extends Combatant.SubType> {}

/**
 * Use this interface to configure your custom generic `Folder` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomFolder<
 *   SubType extends Folder.SubType
 * > extends Folder<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredFolder<SubType extends Folder.SubType> extends CustomFolder<SubType> {}
 * }
 * ```
 */
export interface ConfiguredFolder<_SubType extends Folder.SubType> {}

/**
 * Use this interface to configure your custom generic `Item` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomItem<
 *   SubType extends Item.SubType
 * > extends Item<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredItem<SubType extends Item.SubType> extends CustomItem<SubType> {}
 * }
 * ```
 */
export interface ConfiguredItem<_SubType extends Item.SubType> {}

/**
 * Use this interface to configure your custom generic `JournalEntryPage` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomJournalEntryPage<
 *   SubType extends JournalEntryPage.SubType
 * > extends JournalEntryPage<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredJournalEntryPage<SubType extends JournalEntryPage.SubType> extends CustomJournalEntryPage<SubType> {}
 * }
 * ```
 */
export interface ConfiguredJournalEntryPage<_SubType extends JournalEntryPage.SubType> {}

/**
 * Use this interface to configure your custom generic `Macro` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomMacro<
 *   SubType extends Macro.SubType
 * > extends Macro<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredMacro<SubType extends Macro.SubType> extends CustomMacro<SubType> {}
 * }
 * ```
 */
export interface ConfiguredMacro<_SubType extends Macro.SubType> {}

/**
 * Use this interface to configure your custom generic `RegionBehavior` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomRegionBehavior<
 *   SubType extends RegionBehavior.SubType
 * > extends RegionBehavior<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredRegionBehavior<SubType extends RegionBehavior.SubType> extends CustomRegionBehavior<SubType> {}
 * }
 * ```
 */
export interface ConfiguredRegionBehavior<_SubType extends RegionBehavior.SubType> {}

/**
 * Use this interface to configure your custom generic `TableResult` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomTableResult<
 *   SubType extends TableResult.SubType
 * > extends TableResult<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredTableResult<SubType extends TableResult.SubType> extends CustomTableResult<SubType> {}
 * }
 * ```
 */
export interface ConfiguredTableResult<_SubType extends TableResult.SubType> {}
