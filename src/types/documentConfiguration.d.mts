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
import type { InterfaceToObject, MakeConform, MustConform, Merge, FixedInstanceType } from "fvtt-types/utils";

type DocumentConform<T> = MakeConform<T, Document.AnyConstructor>;

declare namespace Implementation {
  import _ActiveEffect = globalThis.ActiveEffect;
  import _ActorDelta = globalThis.ActorDelta;
  import _Actor = globalThis.Actor;
  import _Adventure = globalThis.Adventure;
  import _Card = globalThis.Card;
  import _Cards = globalThis.Cards;
  import _ChatMessage = globalThis.ChatMessage;
  import _Combat = globalThis.Combat;
  import _Combatant = globalThis.Combatant;
  import _FogExploration = globalThis.FogExploration;
  import _Folder = globalThis.Folder;
  import _Item = globalThis.Item;
  import _JournalEntryPage = globalThis.JournalEntryPage;
  import _JournalEntry = globalThis.JournalEntry;
  import _Macro = globalThis.Macro;
  import _PlaylistSound = globalThis.PlaylistSound;
  import _Playlist = globalThis.Playlist;
  import _RegionBehavior = globalThis.RegionBehavior;
  import _RollTable = globalThis.RollTable;
  import _Scene = globalThis.Scene;
  import _Setting = globalThis.Setting;
  import _TableResult = globalThis.TableResult;
  import _User = globalThis.User;
  import _AmbientLightDocument = globalThis.AmbientLightDocument;
  import _AmbientSoundDocument = globalThis.AmbientSoundDocument;
  import _DrawingDocument = globalThis.DrawingDocument;
  import _MeasuredTemplateDocument = globalThis.MeasuredTemplateDocument;
  import _RegionDocument = globalThis.RegionDocument;
  import _NoteDocument = globalThis.NoteDocument;
  import _TileDocument = globalThis.TileDocument;
  import _TokenDocument = globalThis.TokenDocument;
  import _WallDocument = globalThis.WallDocument;

  class ActiveEffect<out SubType extends ActiveEffect.SubType = ActiveEffect.SubType> extends _ActiveEffect<SubType> {}
  class ActorDelta<out SubType extends ActorDelta.SubType = ActorDelta.SubType> extends _ActorDelta<SubType> {}
  class Actor<out SubType extends Actor.SubType = Actor.SubType> extends _Actor<SubType> {}
  class Adventure extends _Adventure {}
  class Card<out SubType extends Card.SubType = Card.SubType> extends _Card<SubType> {}
  class Cards<out SubType extends Cards.SubType = Cards.SubType> extends _Cards<SubType> {}
  class ChatMessage<out SubType extends ChatMessage.SubType = ChatMessage.SubType> extends _ChatMessage<SubType> {}
  class Combat<out SubType extends Combat.SubType = Combat.SubType> extends _Combat<SubType> {}
  class Combatant<out SubType extends Combatant.SubType = Combatant.SubType> extends _Combatant<SubType> {}
  class FogExploration extends _FogExploration {}
  class Folder<out SubType extends Folder.SubType = Folder.SubType> extends _Folder<SubType> {}
  class Item<out SubType extends Item.SubType = Item.SubType> extends _Item<SubType> {}
  class JournalEntryPage<
    out SubType extends JournalEntryPage.SubType = JournalEntryPage.SubType,
  > extends _JournalEntryPage<SubType> {}
  class JournalEntry extends _JournalEntry {}
  class Macro<out SubType extends Macro.SubType = Macro.SubType> extends _Macro<SubType> {}
  class PlaylistSound extends _PlaylistSound {}
  class Playlist extends _Playlist {}
  class RegionBehavior<
    out SubType extends RegionBehavior.SubType = RegionBehavior.SubType,
  > extends _RegionBehavior<SubType> {}
  class RollTable extends _RollTable {}
  class Scene extends _Scene {}
  class Setting extends _Setting {}
  class TableResult<out SubType extends TableResult.SubType = TableResult.SubType> extends _TableResult<SubType> {}
  class User extends _User {}
  class AmbientLightDocument extends _AmbientLightDocument {}
  class AmbientSoundDocument extends _AmbientSoundDocument {}
  class DrawingDocument extends _DrawingDocument {}
  class MeasuredTemplateDocument extends _MeasuredTemplateDocument {}
  class RegionDocument extends _RegionDocument {}
  class NoteDocument extends _NoteDocument {}
  class TileDocument extends _TileDocument {}
  class TokenDocument extends _TokenDocument {}
  class WallDocument extends _WallDocument {}
}

interface DefaultDocumentClasses {
  ActiveEffect: typeof Implementation.ActiveEffect;
  ActorDelta: typeof Implementation.ActorDelta;
  Actor: typeof Implementation.Actor;
  Adventure: typeof Implementation.Adventure;
  Card: typeof Implementation.Card;
  Cards: typeof Implementation.Cards;
  ChatMessage: typeof Implementation.ChatMessage;
  Combat: typeof Implementation.Combat;
  Combatant: typeof Implementation.Combatant;
  FogExploration: typeof Implementation.FogExploration;
  Folder: typeof Implementation.Folder;
  Item: typeof Implementation.Item;
  JournalEntryPage: typeof Implementation.JournalEntryPage;
  JournalEntry: typeof Implementation.JournalEntry;
  Macro: typeof Implementation.Macro;
  PlaylistSound: typeof Implementation.PlaylistSound;
  Playlist: typeof Implementation.Playlist;
  RegionBehavior: typeof Implementation.RegionBehavior;
  RollTable: typeof Implementation.RollTable;
  Scene: typeof Implementation.Scene;
  Setting: typeof Implementation.Setting;
  TableResult: typeof Implementation.TableResult;
  User: typeof Implementation.User;
  AmbientLight: typeof Implementation.AmbientLightDocument;
  AmbientSound: typeof Implementation.AmbientSoundDocument;
  Drawing: typeof Implementation.DrawingDocument;
  MeasuredTemplate: typeof Implementation.MeasuredTemplateDocument;
  Region: typeof Implementation.RegionDocument;
  Note: typeof Implementation.NoteDocument;
  Tile: typeof Implementation.TileDocument;
  Token: typeof Implementation.TokenDocument;
  Wall: typeof Implementation.WallDocument;
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
        create(user: User.Internal.Implementation, doc: Actor.Implementation): boolean;
        update(user: User.Internal.Implementation, doc: Actor.Implementation, data: BaseActor.UpdateData): boolean;
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
        create(user: User.Internal.Implementation, doc: Card.Implementation, data: BaseCard.UpdateData): boolean;
        update(user: User.Internal.Implementation, doc: Card.Implementation, data: BaseCard.UpdateData): boolean;
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
        create(user: User.Internal.Implementation, doc: ChatMessage.Implementation): boolean;
        update(
          user: User.Internal.Implementation,
          doc: ChatMessage.Implementation,
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
        update(user: User.Internal.Implementation, doc: Combat.Implementation, data: BaseCombat.UpdateData): boolean;
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
        create(user: User.Internal.Implementation, doc: Combatant.Implementation): boolean;
        update(
          user: User.Internal.Implementation,
          doc: Combatant.Implementation,
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
          user: User.Internal.Implementation,
          doc: DrawingDocument.Implementation,
          data: BaseDrawing.UpdateData,
        ): boolean;
        delete(
          user: User.Internal.Implementation,
          doc: DrawingDocument.Implementation,
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
          user: User.Internal.Implementation,
          doc: FogExploration.Implementation,
          data: BaseFogExploration.UpdateData,
        ): boolean;
        delete(
          user: User.Internal.Implementation,
          doc: FogExploration.Implementation,
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
        create(user: User.Internal.Implementation, doc: Macro.Implementation): boolean;
        update(user: User.Internal.Implementation, doc: Macro.Implementation): boolean;
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
        create(user: User.Internal.Implementation, doc: MeasuredTemplateDocument.Implementation): boolean;
        update(
          user: User.Internal.Implementation,
          doc: MeasuredTemplateDocument.Implementation,
          data: BaseMeasuredTemplate.UpdateData,
        ): boolean;
        delete(
          user: User.Internal.Implementation,
          doc: MeasuredTemplateDocument.Implementation,
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
        create(user: User.Internal.Implementation, doc: RegionBehavior.Implementation): boolean;
        update(
          user: User.Internal.Implementation,
          doc: RegionBehavior.Implementation,
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
        create(user: User.Internal.Implementation, doc: Setting.Implementation, data: BaseSetting.UpdateData): boolean;
        update(user: User.Internal.Implementation, doc: Setting.Implementation, data: BaseSetting.UpdateData): boolean;
        delete(user: User.Internal.Implementation, doc: Setting.Implementation, data: BaseSetting.UpdateData): boolean;
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
          user: User.Internal.Implementation,
          doc: TableResult.Implementation,
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
          user: User.Internal.Implementation,
          doc: TokenDocument.Implementation,
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
          user: User.Internal.Implementation,
          doc: User.Internal.Implementation,
          data: BaseUser.UpdateData,
        ): boolean;
        update(
          user: User.Internal.Implementation,
          doc: User.Internal.Implementation,
          changes: BaseUser.UpdateData,
        ): boolean;
        delete(user: User.Internal.Implementation, doc: User.Internal.Implementation): boolean;
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
          user: User.Internal.Implementation,
          doc: WallDocument.Implementation,
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
