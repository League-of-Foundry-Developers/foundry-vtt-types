import type BaseActiveEffect from "./active-effect.d.mts";
import type BaseCard from "./card.d.mts";
import type BaseCards from "./cards.d.mts";
import type BaseChatMessage from "./chat-message.d.mts";
import type BaseCombat from "./combat.d.mts";
import type BaseCombatant from "./combatant.d.mts";
import type BaseDrawing from "./drawing.d.mts";
import type BaseFogExploration from "./fog-exploration.d.mts";
import type BaseFolder from "./folder.d.mts";
import type BaseItem from "./item.d.mts";
import type BaseJournalEntryPage from "./journal-entry-page.d.mts";
import type BaseJournalEntry from "./journal-entry.d.mts";
import type BaseMacro from "./macro.d.mts";
import type BaseMeasuredTemplate from "./measured-template.d.mts";
import type BaseNote from "./note.d.mts";
import type BasePlaylistSound from "./playlist-sound.d.mts";
import type BasePlaylist from "./playlist.d.mts";
import type BaseRegionBehavior from "./region-behavior.d.mts";
import type BaseRegion from "./region.d.mts";
import type BaseRollTable from "./roll-table.d.mts";
import type BaseScene from "./scene.d.mts";
import type BaseSetting from "./setting.d.mts";
import type BaseTableResult from "./table-result.d.mts";
import type BaseTile from "./tile.d.mts";
import type BaseToken from "./token.d.mts";
import type BaseUser from "./user.d.mts";
import type BaseWall from "./wall.d.mts";

export type ActiveEffectData = BaseActiveEffect.Properties;

export type EffectDurationData = BaseActiveEffect.Properties["duration"];

// TODO(LukeAbby): This understandably adds a circular loop because `DataField` depends on `EffectChangeData`.
// export type EffectChangeData = BaseActiveEffect.Properties["changes"][number];

// TODO(LukeAbby): Audit. This is used both as an assignment, constructor, and initialized type.
// It's likely this isn't really supposed to be used in fvtt-types.
/**
 * @deprecated {@link ActiveEffect.EffectChangeData | `ActiveEffect.EffectChangeData`}
 */
export type EffectChangeData = ActiveEffect.EffectChangeData;
export interface AmbientSoundEffect {
  type: string;
  intensity: number;
} // TODO: Audit and maybe move when BaseAmbientSound's schema is updated.

export type CardData = BaseCard.Properties;

export type CardFaceData = BaseCard.Properties["faces"][number];

export type CardsData = BaseCards.Properties;

export type ChatMessageData = BaseChatMessage.Properties;

export type ChatSpeakerData = BaseChatMessage.Properties["speaker"];

export type CombatData = BaseCombat.Properties;

export type CombatantData = BaseCombatant.Properties;

export type DrawingData = BaseDrawing.Properties;

export type FogExplorationData = BaseFogExploration.Properties;

export type FolderData = BaseFolder.Properties;

export type ItemData = BaseItem.Properties;

export type JournalEntryData = BaseJournalEntry.Properties;

export type JournalEntryPageImageData = BaseJournalEntryPage.Properties["image"];

export type JournalEntryPageTextData = BaseJournalEntryPage.Properties["text"];

export type JournalEntryPageVideoData = BaseJournalEntryPage.Properties["video"];

export type JournalEntryPageTitleData = BaseJournalEntryPage.Properties["title"];

export type JournalEntryPageData = BaseJournalEntryPage.Properties;

export type MacroData = BaseMacro.Properties;

export type MeasuredTemplateData = BaseMeasuredTemplate.Properties;

export type NoteData = BaseNote.Properties;

export type PlaylistData = BasePlaylist.Properties;

export type PlaylistSoundData = BasePlaylistSound.Properties;

export type RollTableData = BaseRollTable.Properties;

export type SceneData = BaseScene.Properties;

export type GridData = BaseScene.Properties["grid"];

// TODO: Remove when BaseScene's schema is updated.
// @ts-expect-error This still has to be typed
export type EnvironmentData = BaseScene.Properties["environment"]["base"];

export interface _GlobalLightData {
  enabled: number; // TODO: Report as a likely error.
  bright: boolean;
}

// TODO: Remove when BaseScene's schema is updated.
// @ts-expect-error This still has to be typed
export type GlobalLightData = BaseScene.Properties["environment"]["globalLight"];

// TODO: Remove when BaseScene's schema is updated.
// @ts-expect-error This still has to be typed
export type SceneEnvironmentData = BaseScene.Properties["environment"];

export type RegionData = BaseRegion.Properties;

export type RegionBehaviorData = BaseRegionBehavior.Properties;

export type SettingData = BaseSetting.Properties;

export type TableResultData = BaseTableResult.Properties;

export type TileOcclusionData = BaseTile.Properties["occlusion"];

export type TileVideoData = BaseTile.Properties["video"];

export type TileData = BaseTile.Properties;

export type TokenData = BaseToken.Properties;

export type TokenSightData = BaseToken.Properties["sight"];

export type TokenDetectionMode = BaseToken.Properties["detectionModes"][number];

export type TokenBarData = BaseToken.Properties["bar1"];

export type UserData = BaseUser.Properties;

export type WallData = BaseWall.Properties;

export type WallThresholdData = BaseWall.Properties["threshold"];
