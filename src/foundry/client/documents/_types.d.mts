export {};

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.
/* eslint-disable @typescript-eslint/no-unused-vars */

type ActiveEffectData = ActiveEffect.CreateData;
type EffectDurationData = ActiveEffect.DurationData;
type EffectChangeData = ActiveEffect.ChangeData;
type ActorData = Actor.CreateData;
type ActorDeltaData = ActorDelta.CreateData;
type AdventureData = Adventure.CreateData;
type AmbientLightData = AmbientLightDocument.CreateData;
type AmbientSoundData = AmbientSoundDocument.CreateData;
type AmbientSoundEffect = AmbientSoundDocument.Effect;
type CardData = Card.CreateData;
type CardFaceData = Card.FaceData;
type CardsData = Cards.CreateData;
type ChatMessageData = ChatMessage.CreateData;
type ChatSpeakerData = ChatMessage.SpeakerData;
type CombatData = Combat.CreateData;
type CombatantData = Combatant.CreateData;
type CombatantGroupData = unknown;
type DrawingData = DrawingDocument.CreateData;
type FogExplorationData = FogExploration.CreateData;
type FolderData = Folder.CreateData;
type ItemData = Item.CreateData;
type JournalEntryData = JournalEntry.CreateData;
type JournalEntryCategoryData = unknown;
type JournalEntryPageImageData = unknown;
type JournalEntryPageTextData = unknown;
type JournalEntryPageVideoData = unknown;
type JournalEntryPageTitleData = unknown;
type JournalEntryPageData = JournalEntryPage.CreateData;
type MacroData = Macro.CreateData;
type MeasuredTemplateData = MeasuredTemplateDocument.CreateData;
type NoteData = NoteDocument.CreateData;
type PlaylistData = Playlist.CreateData;
type PlaylistSoundData = PlaylistSound.CreateData;
type RollTableData = RollTable.CreateData;
type SceneData = Scene.CreateData;
type GridData = unknown; // Scene.GridSchema?
type EnvironmentData = unknown;
type _GlobalLightData = unknown;
type GlobalLightData = unknown;
type SceneEnvironmentData = Scene.EnvironmentData;
type RegionData = RegionDocument.CreateData;
type RegionBehaviorData = RegionBehavior.CreateData;
type RegionSocketEvent = RegionDocument.SocketRegionEvent;
type SettingData = Setting.CreateData;
type TableResultData = TableResult.CreateData;
type TileRestrictionsData = unknown;
type TileOcclusionData = unknown;
type TileVideoData = unknown;
type TileData = TileDocument.CreateData;
type TokenOcclusionData = unknown;
type TokenRingData = unknown;
type TokenData = TokenDocument.CreateData;
type PrototypeTokenData = unknown;
type TokenSightData = unknown;
type TokenDetectionMode = TokenDocument.DetectionModeData;
type TokenBarData = unknown;
type TokenPosition = unknown;
type TokenDimensions = unknown;
type TokenHexagonalOffsetsData = unknown;
type TokenHexagonalShapeData = unknown;
type UserData = User.CreateData;
type WallData = WallDocument.CreateData;
type WallThresholdData = WallDocument.ThresholdData;
