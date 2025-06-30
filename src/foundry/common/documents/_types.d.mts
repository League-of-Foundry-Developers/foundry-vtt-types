/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names, such as SettingConfig vs. ClientSetting.SettingConfig

export {};

type ActiveEffectData = ActiveEffect.InitializedData;

type EffectDurationData = ActiveEffect.DurationData;

type EffectChangeData = ActiveEffect.ChangeData;

type ActorData = Actor.InitializedData;

type ActorDeltaData = ActorDelta.InitializedData;

type AdventureData = Adventure.InitializedData;

type AmbientLightData = AmbientLightDocument.InitializedData;

type AmbientSoundData = AmbientSoundDocument.InitializedData;

type AmbientSoundEffect = AmbientSoundDocument.Effect;

type CardData = Card.InitializedData;

type CardFaceData = Card.FaceData;

type CardsData = Cards.InitializedData;

type ChatMessageData = ChatMessage.InitializedData;

type ChatSpeakerData = ChatMessage.SpeakerData;

type CombatData = Combat.InitializedData;

type CombatantData = Combatant.InitializedData;

type CombatantGroupData = CombatantGroup.InitializedData;

type DrawingData = DrawingDocument.InitializedData;

type FogExplorationData = FogExploration.InitializedData;

type FolderData = Folder.InitializedData;

type ItemData = Item.InitializedData;

type JournalEntryData = JournalEntry.InitializedData;

type JournalEntryCategoryData = JournalEntryCategory.InitializedData;

type JournalEntryPageImageData = JournalEntryPage.InitializedData["image"];

type JournalEntryPageTextData = JournalEntryPage.InitializedData["text"];

type JournalEntryPageVideoData = JournalEntryPage.InitializedData["video"];

type JournalEntryPageTitleData = JournalEntryPage.InitializedData["title"];

type JournalEntryPageData = JournalEntryPage.InitializedData;

type MacroData = Macro.InitializedData;

type MeasuredTemplateData = MeasuredTemplateDocument.InitializedData;

type NoteData = NoteDocument.InitializedData;

type PlaylistData = Playlist.InitializedData;

type PlaylistSoundData = PlaylistSound.InitializedData;

type RollTableData = RollTable.InitializedData;

type SceneData = Scene.InitializedData;

type GridData = Scene.InitializedData["grid"];

type EnvironmentData = Scene.InitializedData["environment"]["base"];

interface _GlobalLightData {
  enabled: number; // TODO: Report as a likely error.
  bright: boolean;
}

type GlobalLightData = Scene.InitializedData["environment"]["globalLight"];

type SceneEnvironmentData = Scene.InitializedData["environment"];

type RegionData = RegionDocument.InitializedData;

type RegionBehaviorData = RegionBehavior.InitializedData;

type RegionSocketEvent = RegionDocument.SocketRegionEvent;

type SettingData = Setting.InitializedData;

type TableResultData = TableResult.InitializedData;

type TileRestrictionsData = TileDocument.InitializedData["restrictions"];

type TileOcclusionData = TileDocument.InitializedData["occlusion"];

type TileVideoData = TileDocument.InitializedData["video"];

type TileData = TileDocument.InitializedData;

type TokenOcclusionData = TokenDocument.InitializedData["occludable"];

type TokenRingData = TokenDocument.InitializedData["ring"];

type TokenData = TokenDocument.InitializedData;

type PrototypeTokenData = unknown;

type TokenSightData = TokenDocument.InitializedData["sight"];

type TokenDetectionMode = TokenDocument.DetectionModeData;

type TokenBarData = TokenDocument.InitializedData["bar1"];

type TokenPosition = TokenDocument.Position;

type TokenDimensions = TokenDocument.Dimensions;

type TokenHexagonalOffsetsData = TokenDocument.HexagonalOffsetsData;

type TokenHexagonalShapeData = unknown;

type UserData = User.InitializedData;

type WallData = WallDocument.InitializedData;

type WallThresholdData = WallDocument.ThresholdData;
