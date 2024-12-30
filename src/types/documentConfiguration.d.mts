import type { CONST, documents } from "../foundry/client-esm/client.d.mts";
import type { Document } from "../foundry/common/abstract/module.d.mts";
import type BaseActor from "../foundry/common/documents/actor.d.mts";
import type BaseChatMessage from "../foundry/common/documents/chat-message.d.mts";
import type BaseCombat from "../foundry/common/documents/combat.d.mts";
import type BaseCombatant from "../foundry/common/documents/combatant.d.mts";
import type BaseDrawing from "../foundry/common/documents/drawing.d.mts";
import type BaseFogExploration from "../foundry/common/documents/fog-exploration.d.mts";
import type BaseMeasuredTemplate from "../foundry/common/documents/measured-template.d.mts";
import type BaseSetting from "../foundry/common/documents/setting.d.mts";
import type BaseTableResult from "../foundry/common/documents/table-result.d.mts";
import type BaseToken from "../foundry/common/documents/token.d.mts";
import type BaseUser from "../foundry/common/documents/user.d.mts";
import type BaseWall from "../foundry/common/documents/wall.d.mts";
import type { ConformRecord, InterfaceToObject, MakeConform, MustConform, Merge } from "../utils/index.d.mts";

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

type ConformedDefault = ConformRecord<_DefaultDocuments, Document.Internal.Constructor>;

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

type ConformedConfigured = ConformRecord<_ConfiguredDocuments, Document.Internal.Constructor>;

export interface ConfiguredDocuments extends ConformedConfigured {}

interface _ConfiguredMetadata<ThisType extends Document.Internal.Instance.Any> {
  ActiveEffect: Merge<
    Document.Metadata.Default,
    {
      name: "ActiveEffect";
      collection: "effects";
      hasTypeData: true;
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }
  >;
  ActorDelta: Merge<
    Document.Metadata.Default,
    {
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
    }
  >;
  Actor: Merge<
    Document.Metadata.Default,
    {
      name: "Actor";
      collection: "actors";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "type", "sort", "folder"];
      embedded: { ActiveEffect: "effects"; Item: "items" };
      hasTypeData: true;
      label: string;
      labelPlural: string;
      permissions: {
        create(user: BaseUser, doc: ThisType): boolean;
        update(user: BaseUser, doc: ThisType, data: BaseActor.UpdateData): boolean;
      };
      schemaVersion: string;
    }
  >;
  Adventure: Merge<
    Document.Metadata.Default,
    {
      name: "Adventure";
      collection: "adventures";
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }
  >;
  AmbientLight: Merge<
    Document.Metadata.Default,
    {
      name: "AmbientLight";
      collection: "lights";
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }
  >;
  AmbientSound: Merge<
    Document.Metadata.Default,
    {
      name: "AmbientSound";
      collection: "sounds";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      schemaVersion: string;
    }
  >;
  Card: Merge<
    Document.Metadata.Default,
    {
      name: "Card";
      collection: "cards";
      hasTypeData: true;
      indexed: true;
      label: string;
      labelPlural: string;
      permissions: {
        create: () => boolean;
        update: () => boolean;
      };
      compendiumIndexFields: ["name", "type", "suit", "sort"];
      schemaVersion: string;
    }
  >;
  Cards: Merge<
    Document.Metadata.Default,
    {
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
    }
  >;
  ChatMessage: Merge<
    Document.Metadata.Default,
    {
      name: "ChatMessage";
      collection: "messages";
      label: string;
      labelPlural: string;
      isPrimary: true;
      permissions: {
        create(user: BaseUser, doc: ThisType): boolean;
        update(user: BaseUser, doc: ThisType, data: BaseChatMessage.UpdateData): boolean;
      };
      schemaVersion: string;
    }
  >;
  Combat: Merge<
    Document.Metadata.Default,
    {
      name: "Combat";
      collection: "combats";
      label: string;
      labelPlural: string;
      embedded: {
        Combatant: "combatants";
      };
      hasTypeData: true;
      permissions: {
        update(user: BaseUser, doc: ThisType, data: BaseCombat.UpdateData): boolean;
      };
      schemaVersion: string;
    }
  >;
  Combatant: Merge<
    Document.Metadata.Default,
    {
      name: "Combatant";
      collection: "combatants";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      hasTypeData: true;
      schemaVersion: string;
      permissions: {
        create(user: BaseUser, doc: ThisType): boolean;
        update(user: BaseUser, doc: ThisType, data: BaseCombatant.UpdateData): boolean;
      };
    }
  >;
  Drawing: Merge<
    Document.Metadata.Default,
    {
      name: "Drawing";
      collection: "drawings";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      permissions: {
        create: "DRAWING_CREATE";
        update(user: BaseUser, doc: ThisType, data: BaseDrawing.UpdateData): boolean;
        delete(user: BaseUser, doc: ThisType, data: BaseDrawing.UpdateData): boolean;
      };
      schemaVersion: string;
    }
  >;
  FogExploration: Merge<
    Document.Metadata.Default,
    {
      name: "FogExploration";
      collection: "fog";
      label: string;
      labelPlural: string;
      isPrimary: true;
      permissions: {
        create: "PLAYER";
        update(user: BaseUser, doc: ThisType, data: BaseFogExploration.UpdateData): boolean;
        delete(user: BaseUser, doc: ThisType, data: BaseFogExploration.UpdateData): boolean;
      };
      schemaVersion: string;
    }
  >;
  Folder: Merge<
    Document.Metadata.Default,
    {
      name: "Folder";
      collection: "folders";
      label: string;
      labelPlural: string;
      coreTypes: typeof CONST.FOLDER_DOCUMENT_TYPES;
      schemaVersion: string;
    }
  >;
  Item: Merge<
    Document.Metadata.Default,
    {
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
    }
  >;
  JournalEntryPage: Merge<
    Document.Metadata.Default,
    {
      name: "JournalEntryPage";
      collection: "pages";
      hasTypeData: true;
      indexed: true;
      label: string;
      labelPlural: string;
      coreTypes: ["text", "image", "pdf", "video"];
      compendiumIndexFields: ["name", "type", "sort"];
      schemaVersion: string;
    }
  >;
  JournalEntry: Merge<
    Document.Metadata.Default,
    {
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
    }
  >;
  Macro: Merge<
    Document.Metadata.Default,
    {
      name: "Macro";
      collection: "macros";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      label: string;
      labelPlural: string;
      coreTypes: CONST.MACRO_TYPES[];
      permissions: {
        create(user: BaseUser, doc: ThisType): boolean;
        update(user: BaseUser, doc: ThisType): boolean;
      };
      schemaVersion: string;
    }
  >;
  MeasuredTemplate: Merge<
    Document.Metadata.Default,
    {
      name: "MeasuredTemplate";
      collection: "templates";
      label: string;
      labelPlural: string;
      isEmbedded: true;
      permissions: {
        create(user: BaseUser, doc: ThisType): boolean;
        update(user: BaseUser, doc: ThisType, data: BaseMeasuredTemplate.UpdateData): boolean;
        delete(user: BaseUser, doc: ThisType, data: BaseMeasuredTemplate.UpdateData): boolean;
      };
      schemaVersion: string;
    }
  >;
  Note: Merge<
    Document.Metadata.Default,
    {
      name: "Note";
      collection: "notes";
      label: string;
      labelPlural: string;
      permissions: {
        create: "NOTE_CREATE";
      };
      schemaVersion: string;
    }
  >;
  PlaylistSound: Merge<
    Document.Metadata.Default,
    {
      name: "PlaylistSound";
      collection: "sounds";
      indexed: true;
      label: string;
      labelPlural: string;
      compendiumIndexFields: ["name", "sort"];
      schemaVersion: string;
    }
  >;
  Playlist: Merge<
    Document.Metadata.Default,
    {
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
    }
  >;
  RollTable: Merge<
    Document.Metadata.Default,
    {
      name: "RollTable";
      collection: "tables";
      indexed: true;
      compendiumIndexFields: ["_id", "name", "img", "sort", "folder"];
      embedded: { TableResult: "results" };
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }
  >;
  Scene: Merge<
    Document.Metadata.Default,
    {
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
        Tile: "tiles";
        Token: "tokens";
        Wall: "walls";
      };
      label: string;
      labelPlural: string;
      preserveOnImport: ["_id", "sort", "ownership", "active"];
      schemaVersion: string;
    }
  >;
  Setting: Merge<
    Document.Metadata.Default,
    {
      name: "Setting";
      collection: "settings";
      label: string;
      labelPlural: string;
      permissions: {
        create(user: BaseUser, doc: ThisType, data: BaseSetting.UpdateData): boolean;
        update(user: BaseUser, doc: ThisType, data: BaseSetting.UpdateData): boolean;
        delete(user: BaseUser, doc: ThisType, data: BaseSetting.UpdateData): boolean;
      };
      schemaVersion: string;
    }
  >;
  TableResult: Merge<
    Document.Metadata.Default,
    {
      name: "TableResult";
      collection: "results";
      label: string;
      labelPlural: string;
      coreTypes: foundry.CONST.TABLE_RESULT_TYPES[];
      permissions: {
        update(user: BaseUser, doc: ThisType, data: BaseTableResult.UpdateData): boolean;
      };
      compendiumIndexFields: ["type"];
      schemaVersion: string;
    }
  >;
  Tile: Merge<
    Document.Metadata.Default,
    {
      name: "Tile";
      collection: "tiles";
      label: string;
      labelPlural: string;
      schemaVersion: string;
    }
  >;
  Token: Merge<
    Document.Metadata.Default,
    {
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
        update(user: BaseUser, doc: ThisType, data: BaseToken.UpdateData): boolean;
        delete: "TOKEN_DELETE";
      };
      schemaVersion: string;
    }
  >;
  User: Merge<
    Document.Metadata.Default,
    {
      name: "User";
      collection: "users";
      label: string;
      labelPlural: string;
      permissions: {
        create(user: BaseUser, doc: ThisType, data: BaseUser.UpdateData): boolean;
        update(user: BaseUser, doc: ThisType, changes: BaseUser.UpdateData): boolean;
        delete(user: BaseUser, doc: ThisType): boolean;
      };
      schemaVersion: string;
    }
  >;
  Wall: Merge<
    Document.Metadata.Default,
    {
      name: "Wall";
      collection: "walls";
      label: string;
      labelPlural: string;
      permissions: {
        update(user: BaseUser, doc: ThisType, data: BaseWall.UpdateData): boolean;
      };
      schemaVersion: string;
    }
  >;
}

type ReadonlyMetadata<ThisType extends Document.Internal.Instance.Any> = {
  [K in keyof _ConfiguredMetadata<ThisType>]: Readonly<_ConfiguredMetadata<ThisType>[K]>;
};

interface ConfiguredMetadata<ThisType extends Document.Internal.Instance.Any> extends ReadonlyMetadata<ThisType> {}

type MetadataShape = {
  [Name in Document.Type]: Document.Metadata<Document.Any>;
};

type TestConfiguredMetadataValid = MustConform<InterfaceToObject<ConfiguredMetadata<Document.Any>>, MetadataShape>;

export interface ConstructorData {
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
