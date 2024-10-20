import type { Document } from "../foundry/common/abstract/module.d.mts";
import type { ConformRecord, InterfaceToObject, MakeConform, MustConform } from "./helperTypes.d.mts";

type DocumentConform<T> = MakeConform<T, Document.AnyConstructor>;

// This interface holds all documents without configuration.
// It is structured this way to create a place for errors to show up if the type complexity grows too great.
interface _DefaultDocuments {
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
  RollTable: typeof RollTable;
  Scene: typeof Scene;
  Setting: typeof Setting;
  TableResult: typeof TableResult;
  User: typeof User;

  // Placeables have corresponding document classes.
  AmbientLight: typeof AmbientLightDocument;
  AmbientSound: typeof AmbientSoundDocument;
  Drawing: typeof DrawingDocument;
  MeasuredTemplate: typeof MeasuredTemplateDocument;
  Note: typeof NoteDocument;
  Tile: typeof TileDocument;
  Token: typeof TokenDocument;
  Wall: typeof WallDocument;
}

type TestDefaultDocumentsValid = MustConform<
  InterfaceToObject<_DefaultDocuments>,
  Record<string, Document.AnyConstructor>
>;

type ConformedDefault = ConformRecord<_DefaultDocuments, Document.AnyConstructor>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DefaultDocuments extends ConformedDefault {}

// Note(LukeAbby): This helper type is structured this way to make it as simple as possible for TypeScript to figure out that it's always a Document.
// This also uses `ConcreteDocumentType extends keyof DocumentClassConfig` instead of `GetKey` or equivalent for the critical purposes of stymying circular errors.
// See https://gist.github.com/LukeAbby/f9561689e5cad8a4b1e9cb92a8c63982 for more information.
type ConfiguredDocument<ConcreteDocumentType extends Document.Type> =
  ConcreteDocumentType extends keyof DocumentClassConfig
    ? DocumentClassConfig[ConcreteDocumentType]
    : DefaultDocuments[ConcreteDocumentType];

// This interface exists as a way to catch circular errors easier.
// This makes it more verbose than it might seem it has to be but it's important to stay this way.
interface _ConfiguredDocuments {
  ActiveEffect: ConfiguredDocument<"ActiveEffect">;
  ActorDelta: ConfiguredDocument<"ActorDelta">;
  Actor: ConfiguredDocument<"Actor">;
  Adventure: ConfiguredDocument<"Adventure">;
  Card: ConfiguredDocument<"Card">;
  Cards: ConfiguredDocument<"Cards">;
  ChatMessage: ConfiguredDocument<"ChatMessage">;
  Combat: ConfiguredDocument<"Combat">;
  Combatant: ConfiguredDocument<"Combatant">;
  FogExploration: ConfiguredDocument<"FogExploration">;
  Folder: ConfiguredDocument<"Folder">;
  Item: ConfiguredDocument<"Item">;
  JournalEntryPage: ConfiguredDocument<"JournalEntryPage">;
  JournalEntry: ConfiguredDocument<"JournalEntry">;
  Macro: ConfiguredDocument<"Macro">;
  PlaylistSound: ConfiguredDocument<"PlaylistSound">;
  Playlist: ConfiguredDocument<"Playlist">;
  RollTable: ConfiguredDocument<"RollTable">;
  Scene: ConfiguredDocument<"Scene">;
  Setting: ConfiguredDocument<"Setting">;
  TableResult: ConfiguredDocument<"TableResult">;
  User: ConfiguredDocument<"User">;

  AmbientLight: ConfiguredDocument<"AmbientLight">;
  AmbientSound: ConfiguredDocument<"AmbientSound">;
  Drawing: ConfiguredDocument<"Drawing">;
  MeasuredTemplate: ConfiguredDocument<"MeasuredTemplate">;
  Note: ConfiguredDocument<"Note">;
  Tile: ConfiguredDocument<"Tile">;
  Token: ConfiguredDocument<"Token">;
  Wall: ConfiguredDocument<"Wall">;
}

type TestConfiguredDocumentsValid = MustConform<
  InterfaceToObject<_ConfiguredDocuments>,
  Record<string, Document.AnyConstructor>
>;

type ConformedConfigured = ConformRecord<_ConfiguredDocuments, Document.AnyConstructor>;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface ConfiguredDocuments extends _ConfiguredDocuments {}
