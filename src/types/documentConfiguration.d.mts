import type { CONST, documents } from "../foundry/client-esm/client.d.mts";
import type { Document } from "../foundry/common/abstract/module.d.mts";
import type BaseActor from "../foundry/common/documents/actor.d.mts";
import type BaseCard from "../foundry/common/documents/card.d.mts";
import type BaseChatMessage from "../foundry/common/documents/chat-message.d.mts";
import type BaseCombat from "../foundry/common/documents/combat.d.mts";
import type BaseCombatant from "../foundry/common/documents/combatant.d.mts";
import type BaseDrawing from "../foundry/common/documents/drawing.d.mts";
import type BaseFogExploration from "../foundry/common/documents/fog-exploration.d.mts";
import type BaseMeasuredTemplate from "../foundry/common/documents/measured-template.d.mts";
import type BaseRegionBehavior from "../foundry/common/documents/region-behavior.d.mts";
import type BaseSetting from "../foundry/common/documents/setting.d.mts";
import type BaseTableResult from "../foundry/common/documents/table-result.d.mts";
import type BaseToken from "../foundry/common/documents/token.d.mts";
import type BaseUser from "../foundry/common/documents/user.d.mts";
import type BaseWall from "../foundry/common/documents/wall.d.mts";
import type { InterfaceToObject, MakeConform, MustConform, Merge, FixedInstanceType } from "../utils/index.d.mts";

type DocumentConform<T> = MakeConform<T, Document.AnyConstructor>;

// This is written in a verbose and un-DRY way because it's important to keep the types as simple as possible to help avoid circular errors.
// For example a more DRY interface could cause apparent data dependencies on other classes that aren't really there.
// TODO(LukeAbby): Look into this to see if once the circular errors are fixed if this becomes a performance issue.
type DefaultDocumentClass<Name extends Document.Type> =
  | (Name extends "ActiveEffect" ? typeof ActiveEffect : never)
  | (Name extends "ActorDelta" ? typeof ActorDelta : never)
  | (Name extends "Actor" ? typeof Actor : never)
  | (Name extends "Adventure" ? typeof Adventure : never)
  | (Name extends "Card" ? typeof Card : never)
  | (Name extends "Cards" ? typeof Cards : never)
  | (Name extends "ChatMessage" ? typeof ChatMessage : never)
  | (Name extends "Combat" ? typeof Combat : never)
  | (Name extends "Combatant" ? typeof Combatant : never)
  | (Name extends "FogExploration" ? typeof FogExploration : never)
  | (Name extends "Folder" ? typeof Folder : never)
  | (Name extends "Item" ? typeof Item : never)
  | (Name extends "JournalEntryPage" ? typeof JournalEntryPage : never)
  | (Name extends "JournalEntry" ? typeof JournalEntry : never)
  | (Name extends "Macro" ? typeof Macro : never)
  | (Name extends "PlaylistSound" ? typeof PlaylistSound : never)
  | (Name extends "Playlist" ? typeof Playlist : never)
  | (Name extends "RegionBehavior" ? typeof RegionBehavior : never)
  | (Name extends "Region" ? typeof RegionDocument : never)
  | (Name extends "RollTable" ? typeof RollTable : never)
  | (Name extends "Scene" ? typeof Scene : never)
  | (Name extends "Setting" ? typeof Setting : never)
  | (Name extends "TableResult" ? typeof TableResult : never)
  | (Name extends "User" ? typeof User : never)
  | (Name extends "AmbientLight" ? typeof AmbientLightDocument : never)
  | (Name extends "AmbientSound" ? typeof AmbientSoundDocument : never)
  | (Name extends "Drawing" ? typeof DrawingDocument : never)
  | (Name extends "MeasuredTemplate" ? typeof MeasuredTemplateDocument : never)
  | (Name extends "Note" ? typeof NoteDocument : never)
  | (Name extends "Tile" ? typeof TileDocument : never)
  | (Name extends "Token" ? typeof TokenDocument : never)
  | (Name extends "Wall" ? typeof WallDocument : never);

type DefaultDocumentInstance<Name extends Document.Type> =
  | (Name extends "ActiveEffect" ? ActiveEffect : never)
  | (Name extends "ActorDelta" ? ActorDelta : never)
  | (Name extends "Actor" ? Actor : never)
  | (Name extends "Adventure" ? Adventure : never)
  | (Name extends "Card" ? Card : never)
  | (Name extends "Cards" ? Cards : never)
  | (Name extends "ChatMessage" ? ChatMessage : never)
  | (Name extends "Combat" ? Combat : never)
  | (Name extends "Combatant" ? Combatant : never)
  | (Name extends "FogExploration" ? FogExploration : never)
  | (Name extends "Folder" ? Folder : never)
  | (Name extends "Item" ? Item : never)
  | (Name extends "JournalEntryPage" ? JournalEntryPage : never)
  | (Name extends "JournalEntry" ? JournalEntry : never)
  | (Name extends "Macro" ? Macro : never)
  | (Name extends "PlaylistSound" ? PlaylistSound : never)
  | (Name extends "Playlist" ? Playlist : never)
  | (Name extends "RegionBehavior" ? RegionBehavior : never)
  | (Name extends "Region" ? RegionDocument : never)
  | (Name extends "RollTable" ? RollTable : never)
  | (Name extends "Scene" ? Scene : never)
  | (Name extends "Setting" ? Setting : never)
  | (Name extends "TableResult" ? TableResult : never)
  | (Name extends "User" ? User : never)
  | (Name extends "AmbientLight" ? AmbientLightDocument : never)
  | (Name extends "AmbientSound" ? AmbientSoundDocument : never)
  | (Name extends "Drawing" ? DrawingDocument : never)
  | (Name extends "MeasuredTemplate" ? MeasuredTemplateDocument : never)
  | (Name extends "Note" ? NoteDocument : never)
  | (Name extends "Tile" ? TileDocument : never)
  | (Name extends "Token" ? TokenDocument : never)
  | (Name extends "Wall" ? WallDocument : never);

type ResolvedDefaultDocuments = {
  [Type in Document.Type]: DefaultDocumentClass<Type>;
};

type TestDefaultDocumentsValid = MustConform<ResolvedDefaultDocuments, Record<string, Document.AnyConstructor>>;

// Note(LukeAbby): This helper type is structured this way to make it as simple as possible for TypeScript to figure out that it's always a Document.
// This also uses `ConcreteDocumentType extends keyof DocumentClassConfig` instead of `GetKey` or equivalent for the critical purposes of stymying circular errors.
// See https://gist.github.com/LukeAbby/f9561689e5cad8a4b1e9cb92a8c63982 for more information.
type GetDocumentClass<ConcreteDocumentType extends Document.Type> =
  ConcreteDocumentType extends keyof DocumentClassConfig
    ? DocumentClassConfig[ConcreteDocumentType]
    : DefaultDocumentClass<ConcreteDocumentType>;

type GetDocumentInstance<ConcreteDocumentType extends Document.Type> =
  ConcreteDocumentType extends keyof DocumentClassConfig
    ? FixedInstanceType<DocumentClassConfig[ConcreteDocumentType]>
    : DefaultDocumentInstance<ConcreteDocumentType>;

// This interface exists as a way to catch circular errors easier.
// This makes it more verbose than it might seem it has to be but it's important to stay this way.
interface _ConfiguredDocumentClass {
  ActiveEffect: GetDocumentClass<"ActiveEffect">;
  ActorDelta: GetDocumentClass<"ActorDelta">;
  Actor: GetDocumentClass<"Actor">;
  Adventure: GetDocumentClass<"Adventure">;
  Card: GetDocumentClass<"Card">;
  Cards: GetDocumentClass<"Cards">;
  ChatMessage: GetDocumentClass<"ChatMessage">;
  Combat: GetDocumentClass<"Combat">;
  Combatant: GetDocumentClass<"Combatant">;
  FogExploration: GetDocumentClass<"FogExploration">;
  Folder: GetDocumentClass<"Folder">;
  Item: GetDocumentClass<"Item">;
  JournalEntryPage: GetDocumentClass<"JournalEntryPage">;
  JournalEntry: GetDocumentClass<"JournalEntry">;
  Macro: GetDocumentClass<"Macro">;
  PlaylistSound: GetDocumentClass<"PlaylistSound">;
  Playlist: GetDocumentClass<"Playlist">;
  RegionBehavior: GetDocumentClass<"RegionBehavior">;
  Region: GetDocumentClass<"Region">;
  RollTable: GetDocumentClass<"RollTable">;
  Scene: GetDocumentClass<"Scene">;
  Setting: GetDocumentClass<"Setting">;
  TableResult: GetDocumentClass<"TableResult">;
  User: GetDocumentClass<"User">;

  AmbientLight: GetDocumentClass<"AmbientLight">;
  AmbientSound: GetDocumentClass<"AmbientSound">;
  Drawing: GetDocumentClass<"Drawing">;
  MeasuredTemplate: GetDocumentClass<"MeasuredTemplate">;
  Note: GetDocumentClass<"Note">;
  Tile: GetDocumentClass<"Tile">;
  Token: GetDocumentClass<"Token">;
  Wall: GetDocumentClass<"Wall">;
}

interface _ConfiguredDocumentInstance {
  ActiveEffect: GetDocumentInstance<"ActiveEffect">;
  ActorDelta: GetDocumentInstance<"ActorDelta">;
  Actor: GetDocumentInstance<"Actor">;
  Adventure: GetDocumentInstance<"Adventure">;
  Card: GetDocumentInstance<"Card">;
  Cards: GetDocumentInstance<"Cards">;
  ChatMessage: GetDocumentInstance<"ChatMessage">;
  Combat: GetDocumentInstance<"Combat">;
  Combatant: GetDocumentInstance<"Combatant">;
  FogExploration: GetDocumentInstance<"FogExploration">;
  Folder: GetDocumentInstance<"Folder">;
  Item: GetDocumentInstance<"Item">;
  JournalEntryPage: GetDocumentInstance<"JournalEntryPage">;
  JournalEntry: GetDocumentInstance<"JournalEntry">;
  Macro: GetDocumentInstance<"Macro">;
  PlaylistSound: GetDocumentInstance<"PlaylistSound">;
  Playlist: GetDocumentInstance<"Playlist">;
  RegionBehavior: GetDocumentInstance<"RegionBehavior">;
  Region: GetDocumentInstance<"Region">;
  RollTable: GetDocumentInstance<"RollTable">;
  Scene: GetDocumentInstance<"Scene">;
  Setting: GetDocumentInstance<"Setting">;
  TableResult: GetDocumentInstance<"TableResult">;
  User: GetDocumentInstance<"User">;

  AmbientLight: GetDocumentInstance<"AmbientLight">;
  AmbientSound: GetDocumentInstance<"AmbientSound">;
  Drawing: GetDocumentInstance<"Drawing">;
  MeasuredTemplate: GetDocumentInstance<"MeasuredTemplate">;
  Note: GetDocumentInstance<"Note">;
  Tile: GetDocumentInstance<"Tile">;
  Token: GetDocumentInstance<"Token">;
  Wall: GetDocumentInstance<"Wall">;
}

type TestConfiguredDocumentsValid = MustConform<
  InterfaceToObject<_ConfiguredDocumentClass>,
  Record<string, Document.AnyConstructor>
>;

type ConformedConfiguredClass = {
  [K in keyof _ConfiguredDocumentClass]: MakeConform<
    _ConfiguredDocumentClass[K],
    Document.Internal.Constructor,
    ConfigurationFailure[K]
  >;
};

export interface ConfiguredDocumentClass extends ConformedConfiguredClass {}
export interface ConfiguredDocumentInstance extends _ConfiguredDocumentInstance {}

interface ActiveEffectMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "ActiveEffect";
      collection: "effects";
      hasTypeData: true;
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }>
  > {}

interface ActorDeltaMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "ActorDelta";
      collection: "delta";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      embedded: {
        Item: "items";
        ActiveEffect: "effects";
      };
      schemaVersion: string;
    }>
  > {}

interface ActorMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Actor";
      collection: "actors";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
      embedded: { ActiveEffect: "effects"; Item: "items" };
      hasTypeData: true;
      label: string;
      labelPlural: string;
      permissions: {
        create(user: User.Internal.ConfiguredInstance, doc: Actor.ConfiguredInstance): boolean;
        update(
          user: User.Internal.ConfiguredInstance,
          doc: Actor.ConfiguredInstance,
          data: BaseActor.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface AdventureMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Adventure";
      collection: "adventures";
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }>
  > {}

interface AmbientLightMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "AmbientLight";
      collection: "lights";
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }>
  > {}

interface AmbientSoundMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "AmbientSound";
      collection: "sounds";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      schemaVersion: string;
    }>
  > {}

interface CardMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Card";
      collection: "cards";
      hasTypeData: true;
      indexed: true;
      label: string;
      labelPlural: string;
      permissions: {
        create(
          user: User.Internal.ConfiguredInstance,
          doc: Card.ConfiguredInstance,
          data: BaseCard.UpdateData,
        ): boolean;
        update(
          user: User.Internal.ConfiguredInstance,
          doc: Card.ConfiguredInstance,
          data: BaseCard.UpdateData,
        ): boolean;
      };
      compendiumIndexFields: ["name", "type", "suit", "sort"];
      schemaVersion: string;
    }>
  > {}

interface CardsMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Cards";
      collection: "cards";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "description", "img", "type", "sort", "folder"];
      embedded: { Card: "cards" };
      hasTypeData: true;
      label: string;
      labelPlural: string;
      coreTypes: ["deck", "hand", "pile"];
      schemaVersion: string;
    }>
  > {}

interface ChatMessageMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "ChatMessage";
      collection: "messages";
      label: string;
      labelPlural: string;
      hasTypeData: true;
      isPrimary: true;
      permissions: {
        create(user: User.Internal.ConfiguredInstance, doc: ChatMessage.ConfiguredInstance): boolean;
        update(
          user: User.Internal.ConfiguredInstance,
          doc: ChatMessage.ConfiguredInstance,
          data: BaseChatMessage.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface CombatMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Combat";
      collection: "combats";
      label: string;
      labelPlural: string;
      embedded: {
        Combatant: "combatants";
      };
      hasTypeData: true;
      permissions: {
        update(
          user: User.Internal.ConfiguredInstance,
          doc: Combat.ConfiguredInstance,
          data: BaseCombat.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface CombatantMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Combatant";
      collection: "combatants";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      hasTypeData: true;
      schemaVersion: string;
      permissions: {
        create(user: User.Internal.ConfiguredInstance, doc: Combatant.ConfiguredInstance): boolean;
        update(
          user: User.Internal.ConfiguredInstance,
          doc: Combatant.ConfiguredInstance,
          data: BaseCombatant.UpdateData,
        ): boolean;
      };
    }>
  > {}

interface DrawingMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Drawing";
      collection: "drawings";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      permissions: {
        create: "DRAWING_CREATE";
        update(
          user: User.Internal.ConfiguredInstance,
          doc: DrawingDocument.ConfiguredInstance,
          data: BaseDrawing.UpdateData,
        ): boolean;
        delete(
          user: User.Internal.ConfiguredInstance,
          doc: DrawingDocument.ConfiguredInstance,
          data: BaseDrawing.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface FogExplorationMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "FogExploration";
      collection: "fog";
      label: string;
      labelPlural: string;
      isPrimary: true;
      permissions: {
        create: "PLAYER";
        update(
          user: User.Internal.ConfiguredInstance,
          doc: FogExploration.ConfiguredInstance,
          data: BaseFogExploration.UpdateData,
        ): boolean;
        delete(
          user: User.Internal.ConfiguredInstance,
          doc: FogExploration.ConfiguredInstance,
          data: BaseFogExploration.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface FolderMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Folder";
      collection: "folders";
      label: string;
      labelPlural: string;
      coreTypes: typeof CONST.FOLDER_DOCUMENT_TYPES;
      schemaVersion: string;
    }>
  > {}

interface ItemMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Item";
      collection: "items";
      hasTypeData: true;
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
      embedded: { ActiveEffect: "effects" };
      label: string;
      labelPlural: string;
      permissions: { create: "ITEM_CREATE" };
      schemaVersion: string;
    }>
  > {}

interface JournalEntryPageMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "JournalEntryPage";
      collection: "pages";
      hasTypeData: true;
      indexed: true;
      label: string;
      labelPlural: string;
      coreTypes: ["text", "image", "pdf", "video"];
      compendiumIndexFields: ["name", "type", "sort"];
      schemaVersion: string;
    }>
  > {}

interface JournalEntryMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "JournalEntry";
      collection: "journal";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "sort", "folder"];
      embedded: { JournalEntryPage: "pages" };
      label: string;
      labelPlural: string;
      permissions: {
        create: "JOURNAL_CREATE";
      };
      schemaVersion: string;
    }>
  > {}

interface MacroMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Macro";
      collection: "macros";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      label: string;
      labelPlural: string;
      coreTypes: CONST.MACRO_TYPES[];
      permissions: {
        create(user: User.Internal.ConfiguredInstance, doc: Macro.ConfiguredInstance): boolean;
        update(user: User.Internal.ConfiguredInstance, doc: Macro.ConfiguredInstance): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface MeasuredTemplateMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "MeasuredTemplate";
      collection: "templates";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      permissions: {
        create(user: User.Internal.ConfiguredInstance, doc: MeasuredTemplateDocument.ConfiguredInstance): boolean;
        update(
          user: User.Internal.ConfiguredInstance,
          doc: MeasuredTemplateDocument.ConfiguredInstance,
          data: BaseMeasuredTemplate.UpdateData,
        ): boolean;
        delete(
          user: User.Internal.ConfiguredInstance,
          doc: MeasuredTemplateDocument.ConfiguredInstance,
          data: BaseMeasuredTemplate.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface NoteMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Note";
      collection: "notes";
      label: string;
      labelPlural: string;
      permissions: {
        create: "NOTE_CREATE";
      };
      schemaVersion: string;
    }>
  > {}

interface PlaylistSoundMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "PlaylistSound";
      collection: "sounds";
      indexed: true;
      label: string;
      labelPlural: string;
      compendiumIndexFields: ["name", "sort"];
      schemaVersion: string;
    }>
  > {}

interface PlaylistMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Playlist";
      collection: "playlists";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "sort", "folder"];
      embedded: { PlaylistSound: "sounds" };
      label: string;
      labelPlural: string;
      permissions: {
        create: "PLAYLIST_CREATE";
      };
      schemaVersion: string;
    }>
  > {}

interface RegionBehaviorMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "RegionBehavior";
      collection: "behaviors";
      label: string;
      labelPlural: string;
      coreTypes: [
        "adjustDarknessLevel",
        "displayScrollingText",
        "executeMacro",
        "executeScript",
        "pauseGame",
        "suppressWeather",
        "teleportToken",
        "toggleBehavior",
      ];
      hasTypeData: true;
      isEmbedded: true;
      permissions: {
        create(user: User.Internal.ConfiguredInstance, doc: RegionBehavior.ConfiguredInstance): boolean;
        update(
          user: User.Internal.ConfiguredInstance,
          doc: RegionBehavior.ConfiguredInstance,
          data: BaseRegionBehavior.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface RegionMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Region";
      collection: "regions";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      embedded: {
        RegionBehavior: "behaviors";
      };
      schemaVersion: string;
    }>
  > {}

interface RollTableMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "RollTable";
      collection: "tables";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      embedded: { TableResult: "results" };
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }>
  > {}

interface SceneMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Scene";
      collection: "scenes";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "thumb", "sort", "folder"];
      embedded: {
        AmbientLight: "lights";
        AmbientSound: "sounds";
        Drawing: "drawings";
        MeasuredTemplate: "templates";
        Note: "notes";
        Region: "regions";
        Tile: "tiles";
        Token: "tokens";
        Wall: "walls";
      };
      label: string;
      labelPlural: string;
      preserveOnImport: ["_id", "sort", "ownership", "active"];
      schemaVersion: string;
    }>
  > {}

interface SettingMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Setting";
      collection: "settings";
      label: string;
      labelPlural: string;
      permissions: {
        create(
          user: User.Internal.ConfiguredInstance,
          doc: Setting.ConfiguredInstance,
          data: BaseSetting.UpdateData,
        ): boolean;
        update(
          user: User.Internal.ConfiguredInstance,
          doc: Setting.ConfiguredInstance,
          data: BaseSetting.UpdateData,
        ): boolean;
        delete(
          user: User.Internal.ConfiguredInstance,
          doc: Setting.ConfiguredInstance,
          data: BaseSetting.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface TableResultMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "TableResult";
      collection: "results";
      label: string;
      labelPlural: string;
      coreTypes: foundry.CONST.TABLE_RESULT_TYPES[];
      permissions: {
        update(
          user: User.Internal.ConfiguredInstance,
          doc: TableResult.ConfiguredInstance,
          data: BaseTableResult.UpdateData,
        ): boolean;
      };
      compendiumIndexFields: ["type"];
      schemaVersion: string;
    }>
  > {}

interface TileMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Tile";
      collection: "tiles";
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }>
  > {}

interface TokenMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Token";
      collection: "tokens";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      embedded: {
        ActorDelta: "delta";
      };
      permissions: {
        create: "TOKEN_CREATE";
        update(
          user: User.Internal.ConfiguredInstance,
          doc: TokenDocument.ConfiguredInstance,
          data: BaseToken.UpdateData,
        ): boolean;
        delete: "TOKEN_DELETE";
      };
      schemaVersion: string;
    }>
  > {}

interface UserMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "User";
      collection: "users";
      label: string;
      labelPlural: string;
      permissions: {
        create(
          user: User.Internal.ConfiguredInstance,
          doc: User.Internal.ConfiguredInstance,
          data: BaseUser.UpdateData,
        ): boolean;
        update(
          user: User.Internal.ConfiguredInstance,
          doc: User.Internal.ConfiguredInstance,
          changes: BaseUser.UpdateData,
        ): boolean;
        delete(user: User.Internal.ConfiguredInstance, doc: User.Internal.ConfiguredInstance): boolean;
      };
      schemaVersion: string;
    }>
  > {}

interface WallMetadata
  extends Merge<
    Document.Metadata.Default,
    Readonly<{
      name: "Wall";
      collection: "walls";
      label: string;
      labelPlural: string;
      permissions: {
        update(
          user: User.Internal.ConfiguredInstance,
          doc: WallDocument.ConfiguredInstance,
          data: BaseWall.UpdateData,
        ): boolean;
      };
      schemaVersion: string;
    }>
  > {}

export interface ConfiguredMetadata {
  ActiveEffect: ActiveEffectMetadata;
  ActorDelta: ActorDeltaMetadata;
  Actor: ActorMetadata;
  Adventure: AdventureMetadata;
  AmbientLight: AmbientLightMetadata;
  AmbientSound: AmbientSoundMetadata;
  Card: CardMetadata;
  Cards: CardsMetadata;
  ChatMessage: ChatMessageMetadata;
  Combat: CombatMetadata;
  Combatant: CombatantMetadata;
  Drawing: DrawingMetadata;
  FogExploration: FogExplorationMetadata;
  Folder: FolderMetadata;
  Item: ItemMetadata;
  JournalEntryPage: JournalEntryPageMetadata;
  JournalEntry: JournalEntryMetadata;
  Macro: MacroMetadata;
  MeasuredTemplate: MeasuredTemplateMetadata;
  Note: NoteMetadata;
  PlaylistSound: PlaylistSoundMetadata;
  Playlist: PlaylistMetadata;
  RegionBehavior: RegionBehaviorMetadata;
  Region: RegionMetadata;
  RollTable: RollTableMetadata;
  Scene: SceneMetadata;
  Setting: SettingMetadata;
  TableResult: TableResultMetadata;
  Tile: TileMetadata;
  Token: TokenMetadata;
  User: UserMetadata;
  Wall: WallMetadata;
}

type MetadataShape = {
  [Name in Document.Type]: Document.Metadata<Document.Any>;
};

type TestConfiguredMetadataValid = MustConform<ConfiguredMetadata, MetadataShape>;

export interface CreateData {
  ActiveEffect: documents.BaseActiveEffect.ConstructorData;
  ActorDelta: documents.BaseActorDelta.ConstructorData;
  Actor: documents.BaseActor.ConstructorData;
  Adventure: documents.BaseAdventure.ConstructorData;
  Card: documents.BaseCard.ConstructorData;
  Cards: documents.BaseCards.ConstructorData;
  ChatMessage: documents.BaseChatMessage.ConstructorData;
  Combat: documents.BaseCombat.ConstructorData;
  Combatant: documents.BaseCombatant.ConstructorData;
  FogExploration: documents.BaseFogExploration.ConstructorData;
  Folder: documents.BaseFolder.ConstructorData;
  Item: documents.BaseItem.ConstructorData;
  JournalEntryPage: documents.BaseJournalEntryPage.ConstructorData;
  JournalEntry: documents.BaseJournalEntry.ConstructorData;
  Macro: documents.BaseMacro.ConstructorData;
  PlaylistSound: documents.BasePlaylistSound.ConstructorData;
  Playlist: documents.BasePlaylist.ConstructorData;
  RegionBehavior: documents.BaseRegionBehavior.ConstructorData;
  Region: documents.BaseRegion.ConstructorData;
  RollTable: documents.BaseRollTable.ConstructorData;
  Scene: documents.BaseScene.ConstructorData;
  Setting: documents.BaseSetting.ConstructorData;
  TableResult: documents.BaseTableResult.ConstructorData;
  User: documents.BaseUser.ConstructorData;
  AmbientLight: documents.BaseAmbientLight.ConstructorData;
  AmbientSound: documents.BaseAmbientSound.ConstructorData;
  Drawing: documents.BaseDrawing.ConstructorData;
  MeasuredTemplate: documents.BaseMeasuredTemplate.ConstructorData;
  Note: documents.BaseNote.ConstructorData;
  Tile: documents.BaseTile.ConstructorData;
  Token: documents.BaseToken.ConstructorData;
  Wall: documents.BaseWall.ConstructorData;
}

// This is a more paranoid version of `MakeConform` that catches `any`, `errorType`, etc. and returns
// `Document.AnyConstructor` instead of letting them cascade.
type ConformToDocumentConstructor<T> = [T] extends [Document.AnyConstructor]
  ? [1 & T] extends [2]
    ? Document.AnyConstructor
    : T
  : Document.AnyConstructor;

type ActiveEffectClass = ConformToDocumentConstructor<typeof ActiveEffect>;
type ActorDeltaClass = ConformToDocumentConstructor<typeof ActorDelta>;
type ActorClass = ConformToDocumentConstructor<typeof Actor>;
type AdventureClass = ConformToDocumentConstructor<typeof Adventure>;
type CardClass = ConformToDocumentConstructor<typeof Card>;
type CardsClass = ConformToDocumentConstructor<typeof Cards>;
type ChatMessageClass = ConformToDocumentConstructor<typeof ChatMessage>;
type CombatClass = ConformToDocumentConstructor<typeof Combat>;
type CombatantClass = ConformToDocumentConstructor<typeof Combatant>;
type FogExplorationClass = ConformToDocumentConstructor<typeof FogExploration>;
type FolderClass = ConformToDocumentConstructor<typeof Folder>;
type ItemClass = ConformToDocumentConstructor<typeof Item>;
type JournalEntryPageClass = ConformToDocumentConstructor<typeof JournalEntryPage>;
type JournalEntryClass = ConformToDocumentConstructor<typeof JournalEntry>;
type MacroClass = ConformToDocumentConstructor<typeof Macro>;
type PlaylistSoundClass = ConformToDocumentConstructor<typeof PlaylistSound>;
type PlaylistClass = ConformToDocumentConstructor<typeof Playlist>;
type RegionBehaviorClass = ConformToDocumentConstructor<typeof RegionBehavior>;
type RegionClass = ConformToDocumentConstructor<typeof Region>;
type RollTableClass = ConformToDocumentConstructor<typeof RollTable>;
type SceneClass = ConformToDocumentConstructor<typeof Scene>;
type SettingClass = ConformToDocumentConstructor<typeof Setting>;
type TableResultClass = ConformToDocumentConstructor<typeof TableResult>;
type UserClass = ConformToDocumentConstructor<typeof User>;
type AmbientLightClass = ConformToDocumentConstructor<typeof AmbientLight>;
type AmbientSoundClass = ConformToDocumentConstructor<typeof AmbientSound>;
type DrawingClass = ConformToDocumentConstructor<typeof Drawing>;
type MeasuredTemplateClass = ConformToDocumentConstructor<typeof MeasuredTemplate>;
type NoteClass = ConformToDocumentConstructor<typeof Note>;
type TileClass = ConformToDocumentConstructor<typeof Tile>;
type TokenClass = ConformToDocumentConstructor<typeof Token>;
type WallClass = ConformToDocumentConstructor<typeof Wall>;

interface MisconfiguredActiveEffect extends ActiveEffectClass {}
interface MisconfiguredActorDelta extends ActorDeltaClass {}
interface MisconfiguredActor extends ActorClass {}
interface MisconfiguredAdventure extends AdventureClass {}
interface MisconfiguredCard extends CardClass {}
interface MisconfiguredCards extends CardsClass {}
interface MisconfiguredChatMessage extends ChatMessageClass {}
interface MisconfiguredCombat extends CombatClass {}
interface MisconfiguredCombatant extends CombatantClass {}
interface MisconfiguredFogExploration extends FogExplorationClass {}
interface MisconfiguredFolder extends FolderClass {}
interface MisconfiguredItem extends ItemClass {}
interface MisconfiguredJournalEntryPage extends JournalEntryPageClass {}
interface MisconfiguredJournalEntry extends JournalEntryClass {}
interface MisconfiguredMacro extends MacroClass {}
interface MisconfiguredPlaylistSound extends PlaylistSoundClass {}
interface MisconfiguredPlaylist extends PlaylistClass {}
interface MisconfiguredRegionBehavior extends RegionBehaviorClass {}
interface MisconfiguredRegion extends RegionClass {}
interface MisconfiguredRollTable extends RollTableClass {}
interface MisconfiguredScene extends SceneClass {}
interface MisconfiguredSetting extends SettingClass {}
interface MisconfiguredTableResult extends TableResultClass {}
interface MisconfiguredUser extends UserClass {}
interface MisconfiguredAmbientLight extends AmbientLightClass {}
interface MisconfiguredAmbientSound extends AmbientSoundClass {}
interface MisconfiguredDrawing extends DrawingClass {}
interface MisconfiguredMeasuredTemplate extends MeasuredTemplateClass {}
interface MisconfiguredNote extends NoteClass {}
interface MisconfiguredTile extends TileClass {}
interface MisconfiguredToken extends TokenClass {}
interface MisconfiguredWall extends WallClass {}

export interface ConfigurationFailure {
  ActiveEffect: MisconfiguredActiveEffect;
  ActorDelta: MisconfiguredActorDelta;
  Actor: MisconfiguredActor;
  Adventure: MisconfiguredAdventure;
  Card: MisconfiguredCard;
  Cards: MisconfiguredCards;
  ChatMessage: MisconfiguredChatMessage;
  Combat: MisconfiguredCombat;
  Combatant: MisconfiguredCombatant;
  FogExploration: MisconfiguredFogExploration;
  Folder: MisconfiguredFolder;
  Item: MisconfiguredItem;
  JournalEntryPage: MisconfiguredJournalEntryPage;
  JournalEntry: MisconfiguredJournalEntry;
  Macro: MisconfiguredMacro;
  PlaylistSound: MisconfiguredPlaylistSound;
  Playlist: MisconfiguredPlaylist;
  RegionBehavior: MisconfiguredRegionBehavior;
  Region: MisconfiguredRegion;
  RollTable: MisconfiguredRollTable;
  Scene: MisconfiguredScene;
  Setting: MisconfiguredSetting;
  TableResult: MisconfiguredTableResult;
  User: MisconfiguredUser;
  AmbientLight: MisconfiguredAmbientLight;
  AmbientSound: MisconfiguredAmbientSound;
  Drawing: MisconfiguredDrawing;
  MeasuredTemplate: MisconfiguredMeasuredTemplate;
  Note: MisconfiguredNote;
  Tile: MisconfiguredTile;
  Token: MisconfiguredToken;
  Wall: MisconfiguredWall;
}
