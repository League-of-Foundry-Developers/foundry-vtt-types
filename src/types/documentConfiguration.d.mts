// This file pertains to setting up documents, including defaults. For this reason there's a lot of references to `SomeDocument` instead of `SomeDocument.implementation`.
/* eslint-disable @typescript-eslint/no-restricted-types, no-restricted-syntax */

import type { documents } from "../foundry/client-esm/client.d.mts";
import type { Document } from "../foundry/common/abstract/module.d.mts";
import type { InterfaceToObject, MakeConform, MustConform, FixedInstanceType } from "fvtt-types/utils";

type DocumentConform<T> = MakeConform<T, Document.AnyConstructor>;

interface DefaultDocumentClasses {
  ActiveEffect: typeof ActiveEffect;
  ActorDelta: typeof ActorDelta;
  Actor: typeof Actor;
  Adventure: typeof Adventure;
  Card: typeof Card;
  Cards: typeof Cards;
  ChatMessage: typeof ChatMessage;
  Combat: typeof Combat;
  Combatant: typeof Combatant;
  FogExploration: typeof FogExploration;
  Folder: typeof Folder;
  Item: typeof Item;
  JournalEntryPage: typeof JournalEntryPage;
  JournalEntry: typeof JournalEntry;
  Macro: typeof Macro;
  PlaylistSound: typeof PlaylistSound;
  Playlist: typeof Playlist;
  RegionBehavior: typeof RegionBehavior;
  RollTable: typeof RollTable;
  Scene: typeof Scene;
  Setting: typeof Setting;
  TableResult: typeof TableResult;
  User: typeof User;
  AmbientLight: typeof AmbientLightDocument;
  AmbientSound: typeof AmbientSoundDocument;
  Drawing: typeof DrawingDocument;
  MeasuredTemplate: typeof MeasuredTemplateDocument;
  Region: typeof RegionDocument;
  Note: typeof NoteDocument;
  Tile: typeof TileDocument;
  Token: typeof TokenDocument;
  Wall: typeof WallDocument;
}

interface DefaultDocumentInstance {
  ActiveEffect: ActiveEffect;
  ActorDelta: ActorDelta;
  Actor: Actor;
  Adventure: Adventure;
  Card: Card;
  Cards: Cards;
  ChatMessage: ChatMessage;
  Combat: Combat;
  Combatant: Combatant;
  FogExploration: FogExploration;
  Folder: Folder;
  Item: Item;
  JournalEntryPage: JournalEntryPage;
  JournalEntry: JournalEntry;
  Macro: Macro;
  PlaylistSound: PlaylistSound;
  Playlist: Playlist;
  RegionBehavior: RegionBehavior;
  RollTable: RollTable;
  Scene: Scene;
  Setting: Setting;
  TableResult: TableResult;
  User: User;
  AmbientLight: AmbientLightDocument;
  AmbientSound: AmbientSoundDocument;
  Drawing: DrawingDocument;
  MeasuredTemplate: MeasuredTemplateDocument;
  Note: NoteDocument;
  Region: RegionDocument;
  Tile: TileDocument;
  Token: TokenDocument;
  Wall: WallDocument;
}

type ResolvedDefaultDocuments = {
  [Type in Document.Type]: DefaultDocumentClasses[Type];
};

type TestDefaultDocumentsValid = MustConform<ResolvedDefaultDocuments, Record<string, Document.AnyConstructor>>;

// Note(LukeAbby): This helper type is structured this way to make it as simple as possible for TypeScript to figure out that it's always a Document.
// This also uses `ConcreteDocumentType extends keyof DocumentClassConfig` instead of `GetKey` or equivalent for the critical purposes of stymying circular errors.
// See https://gist.github.com/LukeAbby/f9561689e5cad8a4b1e9cb92a8c63982 for more information.
type GetDocumentClass<ConcreteDocumentType extends Document.Type> =
  ConcreteDocumentType extends keyof DocumentClassConfig
    ? DocumentClassConfig[ConcreteDocumentType]
    : DefaultDocumentClasses[ConcreteDocumentType];

type GetDocumentInstance<ConcreteDocumentType extends Document.Type> =
  ConcreteDocumentType extends keyof DocumentClassConfig
    ? FixedInstanceType<DocumentClassConfig[ConcreteDocumentType]>
    : DefaultDocumentInstance[ConcreteDocumentType];

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

type TestConfiguredClassesValid = MustConform<
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

type TestConfiguredInstanceValid = MustConform<
  InterfaceToObject<_ConfiguredDocumentInstance>,
  Record<string, Document.Any>
>;

type ConformedConfiguredInstance = {
  [K in keyof _ConfiguredDocumentInstance]: MakeConform<_ConfiguredDocumentInstance[K], Document.Any>;
};

export interface ConfiguredDocumentClass extends ConformedConfiguredClass {}
export interface ConfiguredDocumentInstance extends ConformedConfiguredInstance {}

export interface ConfiguredMetadata {
  ActiveEffect: ActiveEffect.Metadata;
  ActorDelta: ActorDelta.Metadata;
  Actor: Actor.Metadata;
  Adventure: Adventure.Metadata;
  AmbientLight: AmbientLightDocument.Metadata;
  AmbientSound: AmbientSoundDocument.Metadata;
  Card: Card.Metadata;
  Cards: Cards.Metadata;
  ChatMessage: ChatMessage.Metadata;
  Combat: Combat.Metadata;
  Combatant: Combatant.Metadata;
  Drawing: DrawingDocument.Metadata;
  FogExploration: FogExploration.Metadata;
  Folder: Folder.Metadata;
  Item: Item.Metadata;
  JournalEntryPage: JournalEntryPage.Metadata;
  JournalEntry: JournalEntry.Metadata;
  Macro: Macro.Metadata;
  MeasuredTemplate: MeasuredTemplateDocument.Metadata;
  Note: NoteDocument.Metadata;
  PlaylistSound: PlaylistSound.Metadata;
  Playlist: Playlist.Metadata;
  RegionBehavior: RegionBehavior.Metadata;
  Region: RegionDocument.Metadata;
  RollTable: RollTable.Metadata;
  Scene: Scene.Metadata;
  Setting: Setting.Metadata;
  TableResult: TableResult.Metadata;
  Tile: TileDocument.Metadata;
  Token: TokenDocument.Metadata;
  User: User.Metadata;
  Wall: WallDocument.Metadata;
}

type MetadataShape = {
  [Name in Document.Type]: Document.Metadata<Document.Any>;
};

type TestConfiguredMetadataValid = MustConform<ConfiguredMetadata, MetadataShape>;

export interface CreateData {
  ActiveEffect: documents.BaseActiveEffect.CreateData;
  ActorDelta: documents.BaseActorDelta.CreateData;
  Actor: documents.BaseActor.CreateData;
  Adventure: documents.BaseAdventure.CreateData;
  Card: documents.BaseCard.CreateData;
  Cards: documents.BaseCards.CreateData;
  ChatMessage: documents.BaseChatMessage.CreateData;
  Combat: documents.BaseCombat.CreateData;
  Combatant: documents.BaseCombatant.CreateData;
  FogExploration: documents.BaseFogExploration.CreateData;
  Folder: documents.BaseFolder.CreateData;
  Item: documents.BaseItem.CreateData;
  JournalEntryPage: documents.BaseJournalEntryPage.CreateData;
  JournalEntry: documents.BaseJournalEntry.CreateData;
  Macro: documents.BaseMacro.CreateData;
  PlaylistSound: documents.BasePlaylistSound.CreateData;
  Playlist: documents.BasePlaylist.CreateData;
  RegionBehavior: documents.BaseRegionBehavior.CreateData;
  RollTable: documents.BaseRollTable.CreateData;
  Scene: documents.BaseScene.CreateData;
  Setting: documents.BaseSetting.CreateData;
  TableResult: documents.BaseTableResult.CreateData;
  User: documents.BaseUser.CreateData;
  AmbientLight: documents.BaseAmbientLight.CreateData;
  AmbientSound: documents.BaseAmbientSound.CreateData;
  Drawing: documents.BaseDrawing.CreateData;
  MeasuredTemplate: documents.BaseMeasuredTemplate.CreateData;
  Note: documents.BaseNote.CreateData;
  Region: documents.BaseRegion.CreateData;
  Tile: documents.BaseTile.CreateData;
  Token: documents.BaseToken.CreateData;
  Wall: documents.BaseWall.CreateData;
}

// This is a more paranoid version of `MakeConform` that catches `any`, `errorType`, etc. and returns
// `Document.AnyConstructor` instead of letting them cascade.
type ConformToDocumentConstructor<T extends Document.AnyConstructor> = [T] extends [Document.AnyConstructor]
  ? [1 & T] extends [2]
    ? Document.AnyConstructor
    : T
  : Document.AnyConstructor;

interface MisconfiguredActiveEffect extends ConformToDocumentConstructor<typeof ActiveEffect> {}
interface MisconfiguredActorDelta extends ConformToDocumentConstructor<typeof ActorDelta> {}
interface MisconfiguredActor extends ConformToDocumentConstructor<typeof Actor> {}
interface MisconfiguredAdventure extends ConformToDocumentConstructor<typeof Adventure> {}
interface MisconfiguredCard extends ConformToDocumentConstructor<typeof Card> {}
interface MisconfiguredCards extends ConformToDocumentConstructor<typeof Cards> {}
interface MisconfiguredChatMessage extends ConformToDocumentConstructor<typeof ChatMessage> {}
interface MisconfiguredCombat extends ConformToDocumentConstructor<typeof Combat> {}
interface MisconfiguredCombatant extends ConformToDocumentConstructor<typeof Combatant> {}
interface MisconfiguredFogExploration extends ConformToDocumentConstructor<typeof FogExploration> {}
interface MisconfiguredFolder extends ConformToDocumentConstructor<typeof Folder> {}
interface MisconfiguredItem extends ConformToDocumentConstructor<typeof Item> {}
interface MisconfiguredJournalEntryPage extends ConformToDocumentConstructor<typeof JournalEntryPage> {}
interface MisconfiguredJournalEntry extends ConformToDocumentConstructor<typeof JournalEntry> {}
interface MisconfiguredMacro extends ConformToDocumentConstructor<typeof Macro> {}
interface MisconfiguredPlaylistSound extends ConformToDocumentConstructor<typeof PlaylistSound> {}
interface MisconfiguredPlaylist extends ConformToDocumentConstructor<typeof Playlist> {}
interface MisconfiguredRegionBehavior extends ConformToDocumentConstructor<typeof RegionBehavior> {}
interface MisconfiguredRollTable extends ConformToDocumentConstructor<typeof RollTable> {}
interface MisconfiguredScene extends ConformToDocumentConstructor<typeof Scene> {}
interface MisconfiguredSetting extends ConformToDocumentConstructor<typeof Setting> {}
interface MisconfiguredTableResult extends ConformToDocumentConstructor<typeof TableResult> {}
interface MisconfiguredUser extends ConformToDocumentConstructor<typeof User> {}
interface MisconfiguredAmbientLight extends ConformToDocumentConstructor<typeof AmbientLightDocument> {}
interface MisconfiguredAmbientSound extends ConformToDocumentConstructor<typeof AmbientSoundDocument> {}
interface MisconfiguredDrawing extends ConformToDocumentConstructor<typeof DrawingDocument> {}
interface MisconfiguredMeasuredTemplate extends ConformToDocumentConstructor<typeof MeasuredTemplateDocument> {}
interface MisconfiguredNote extends ConformToDocumentConstructor<typeof NoteDocument> {}
interface MisconfiguredRegion extends ConformToDocumentConstructor<typeof RegionDocument> {}
interface MisconfiguredTile extends ConformToDocumentConstructor<typeof TileDocument> {}
interface MisconfiguredToken extends ConformToDocumentConstructor<typeof TokenDocument> {}
interface MisconfiguredWall extends ConformToDocumentConstructor<typeof WallDocument> {}

/* eslint-enable */

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
  Region: MisconfiguredRegion;
  Tile: MisconfiguredTile;
  Token: MisconfiguredToken;
  Wall: MisconfiguredWall;
}
