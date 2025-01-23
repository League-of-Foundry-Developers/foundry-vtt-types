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
 *     interface ConfiguredActorDelta<SubType extends ActiveEffect.SubType> extends CustomActorDelta<SubType> {}
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
 *     interface ConfiguredActor<SubType extends ActiveEffect.SubType> extends CustomActor<SubType> {}
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
 *     interface ConfiguredCard<SubType extends ActiveEffect.SubType> extends CustomCard<SubType> {}
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
 *     interface ConfiguredCards<SubType extends ActiveEffect.SubType> extends CustomCards<SubType> {}
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
 *     interface ConfiguredChatMessage<SubType extends ActiveEffect.SubType> extends CustomChatMessage<SubType> {}
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
 *     interface ConfiguredCombat<SubType extends ActiveEffect.SubType> extends CustomCombat<SubType> {}
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
 *     interface ConfiguredCombatant<SubType extends ActiveEffect.SubType> extends CustomCombatant<SubType> {}
 * }
 * ```
 */
export interface ConfiguredCombatant<_SubType extends Combatant.SubType> {}

/**
 * Use this interface to configure your custom generic `FogExploration` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomFogExploration<
 *   SubType extends FogExploration.SubType
 * > extends FogExploration<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredFogExploration<SubType extends ActiveEffect.SubType> extends CustomFogExploration<SubType> {}
 * }
 * ```
 */
export interface ConfiguredFogExploration<_SubType extends FogExploration.SubType> {}

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
 *     interface ConfiguredFolder<SubType extends ActiveEffect.SubType> extends CustomFolder<SubType> {}
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
 *     interface ConfiguredItem<SubType extends ActiveEffect.SubType> extends CustomItem<SubType> {}
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
 *     interface ConfiguredJournalEntryPage<SubType extends ActiveEffect.SubType> extends CustomJournalEntryPage<SubType> {}
 * }
 * ```
 */
export interface ConfiguredJournalEntryPage<_SubType extends JournalEntryPage.SubType> {}

/**
 * Use this interface to configure your custom generic `JournalEntry` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomJournalEntry<
 *   SubType extends JournalEntry.SubType
 * > extends JournalEntry<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredJournalEntry<SubType extends ActiveEffect.SubType> extends CustomJournalEntry<SubType> {}
 * }
 * ```
 */
export interface ConfiguredJournalEntry<_SubType extends JournalEntry.SubType> {}

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
 *     interface ConfiguredMacro<SubType extends ActiveEffect.SubType> extends CustomMacro<SubType> {}
 * }
 * ```
 */
export interface ConfiguredMacro<_SubType extends Macro.SubType> {}

/**
 * Use this interface to configure your custom generic `PlaylistSound` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomPlaylistSound<
 *   SubType extends PlaylistSound.SubType
 * > extends PlaylistSound<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredPlaylistSound<SubType extends ActiveEffect.SubType> extends CustomPlaylistSound<SubType> {}
 * }
 * ```
 */
export interface ConfiguredPlaylistSound<_SubType extends PlaylistSound.SubType> {}

/**
 * Use this interface to configure your custom generic `Playlist` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomPlaylist<
 *   SubType extends Playlist.SubType
 * > extends Playlist<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredPlaylist<SubType extends ActiveEffect.SubType> extends CustomPlaylist<SubType> {}
 * }
 * ```
 */
export interface ConfiguredPlaylist<_SubType extends Playlist.SubType> {}

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
 *     interface ConfiguredRegionBehavior<SubType extends ActiveEffect.SubType> extends CustomRegionBehavior<SubType> {}
 * }
 * ```
 */
export interface ConfiguredRegionBehavior<_SubType extends RegionBehavior.SubType> {}

/**
 * Use this interface to configure your custom generic `RollTable` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomRollTable<
 *   SubType extends RollTable.SubType
 * > extends RollTable<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredRollTable<SubType extends ActiveEffect.SubType> extends CustomRollTable<SubType> {}
 * }
 * ```
 */
export interface ConfiguredRollTable<_SubType extends RollTable.SubType> {}

/**
 * Use this interface to configure your custom generic `Scene` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomScene<
 *   SubType extends Scene.SubType
 * > extends Scene<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredScene<SubType extends ActiveEffect.SubType> extends CustomScene<SubType> {}
 * }
 * ```
 */
export interface ConfiguredScene<_SubType extends Scene.SubType> {}

/**
 * Use this interface to configure your custom generic `Setting` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomSetting<
 *   SubType extends Setting.SubType
 * > extends Setting<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredSetting<SubType extends ActiveEffect.SubType> extends CustomSetting<SubType> {}
 * }
 * ```
 */
export interface ConfiguredSetting<_SubType extends Setting.SubType> {}

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
 *     interface ConfiguredTableResult<SubType extends ActiveEffect.SubType> extends CustomTableResult<SubType> {}
 * }
 * ```
 */
export interface ConfiguredTableResult<_SubType extends TableResult.SubType> {}

/**
 * Use this interface to configure your custom generic `User` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomUser<
 *   SubType extends User.SubType
 * > extends User<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredUser<SubType extends ActiveEffect.SubType> extends CustomUser<SubType> {}
 * }
 * ```
 */
export interface ConfiguredUser<_SubType extends User.SubType> {}

/**
 * Use this interface to configure your custom generic `AmbientLightDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomAmbientLightDocument<
 *   SubType extends AmbientLightDocument.SubType
 * > extends AmbientLightDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredAmbientLightDocument<SubType extends ActiveEffect.SubType> extends CustomAmbientLightDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredAmbientLightDocument<_SubType extends AmbientLightDocument.SubType> {}

/**
 * Use this interface to configure your custom generic `AmbientSoundDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomAmbientSoundDocument<
 *   SubType extends AmbientSoundDocument.SubType
 * > extends AmbientSoundDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredAmbientSoundDocument<SubType extends ActiveEffect.SubType> extends CustomAmbientSoundDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredAmbientSoundDocument<_SubType extends AmbientSoundDocument.SubType> {}

/**
 * Use this interface to configure your custom generic `DrawingDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomDrawingDocument<
 *   SubType extends DrawingDocument.SubType
 * > extends DrawingDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredDrawingDocument<SubType extends ActiveEffect.SubType> extends CustomDrawingDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredDrawingDocument<_SubType extends DrawingDocument.SubType> {}

/**
 * Use this interface to configure your custom generic `MeasuredTemplateDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomMeasuredTemplateDocument<
 *   SubType extends MeasuredTemplateDocument.SubType
 * > extends MeasuredTemplateDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredMeasuredTemplateDocument<SubType extends ActiveEffect.SubType> extends CustomMeasuredTemplateDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredMeasuredTemplateDocument<_SubType extends MeasuredTemplateDocument.SubType> {}

/**
 * Use this interface to configure your custom generic `NoteDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomNoteDocument<
 *   SubType extends NoteDocument.SubType
 * > extends NoteDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredNoteDocument<SubType extends ActiveEffect.SubType> extends CustomNoteDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredNoteDocument<_SubType extends NoteDocument.SubType> {}

/**
 * Use this interface to configure your custom generic `RegionDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomRegionDocument<
 *   SubType extends RegionDocument.SubType
 * > extends RegionDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredRegionDocument<SubType extends ActiveEffect.SubType> extends CustomRegionDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredRegionDocument<_SubType extends RegionDocument.SubType> {}

/**
 * Use this interface to configure your custom generic `TileDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomTileDocument<
 *   SubType extends TileDocument.SubType
 * > extends TileDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredTileDocument<SubType extends ActiveEffect.SubType> extends CustomTileDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredTileDocument<_SubType extends TileDocument.SubType> {}

/**
 * Use this interface to configure your custom generic `TokenDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomTokenDocument<
 *   SubType extends TokenDocument.SubType
 * > extends TokenDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredTokenDocument<SubType extends ActiveEffect.SubType> extends CustomTokenDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredTokenDocument<_SubType extends TokenDocument.SubType> {}

/**
 * Use this interface to configure your custom generic `WallDocument` implementation.
 * See also {@link DocumentClassConfig | `DocumentClassConfig`} to configure your class.
 *
 * @example
 * ```typescript
 * class CustomWallDocument<
 *   SubType extends WallDocument.SubType
 * > extends WallDocument<SubType> {
 *   ...
 * }
 *
 * declare module "fvtt-types/configuration" {
 *     interface ConfiguredWallDocument<SubType extends ActiveEffect.SubType> extends CustomWallDocument<SubType> {}
 * }
 * ```
 */
export interface ConfiguredWallDocument<_SubType extends WallDocument.SubType> {}
