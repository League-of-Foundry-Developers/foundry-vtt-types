import { expectTypeOf, test } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import BaseSheet = foundry.applications.sheets.BaseSheet;
import CardConfig = foundry.applications.sheets.CardConfig;
import CombatantConfig = foundry.applications.sheets.CombatantConfig;
import MacroConfig = foundry.applications.sheets.MacroConfig;
import MeasuredTemplateConfig = foundry.applications.sheets.MeasuredTemplateConfig;
import PlaylistConfig = foundry.applications.sheets.PlaylistConfig;
import PlaylistSoundConfig = foundry.applications.sheets.PlaylistSoundConfig;
import TableResultConfig = foundry.applications.sheets.TableResultConfig;

// BaseSheet
declare const anyDoc: foundry.abstract.Document.Any;
declare const baseSheetContext: BaseSheet.RenderContext<foundry.abstract.Document.Any>;
declare const cardContext: CardConfig.RenderContext;

// CombatantConfig
declare const combatant: Combatant.Implementation;
declare const combatantContext: CombatantConfig.RenderContext;

// MacroConfig
declare const macroContext: MacroConfig.RenderContext;
declare const macroRenderOptions: MacroConfig.RenderOptions;

// MeasuredTemplateConfig
declare const templateContext: MeasuredTemplateConfig.RenderContext;

// PlaylistConfig
declare const playlistContext: PlaylistConfig.RenderContext;

// PlaylistSoundConfig
declare const sound: PlaylistSound.Implementation;
declare const soundContext: PlaylistSoundConfig.RenderContext;
declare const resultUpdate: TableResult.UpdateData;
declare const resultContext: TableResultConfig.RenderContext;

test("foundry/client/applications/sheets/misc-sheets", () => {
  expectTypeOf(new BaseSheet({ document: anyDoc }).document).toEqualTypeOf<foundry.abstract.Document.Any>();
  expectTypeOf(baseSheetContext.descriptionHTML).toEqualTypeOf<string | undefined>();
  expectTypeOf(baseSheetContext.hasNothing).toBeBoolean();

  // CardConfig
  expectTypeOf(CardConfig.TYPES).toEqualTypeOf<Record<string, string>>();
  expectTypeOf(cardContext.faceFields).toEqualTypeOf<Card.FaceSchema | undefined>();
  expectTypeOf(cardContext.tabClasses).toEqualTypeOf<string | undefined>();
  expectTypeOf(new CombatantConfig({ document: combatant }).title).toBeString();
  expectTypeOf(combatantContext.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[]>();
  expectTypeOf(macroContext.typeChoices).toEqualTypeOf<Record<CONST.MACRO_TYPES, string>>();
  expectTypeOf(macroContext.editorLang).toEqualTypeOf<"javascript" | "html">();
  expectTypeOf(macroRenderOptions.hotbarSlot).toEqualTypeOf<number | undefined>();
  expectTypeOf(templateContext.templateTypes).toEqualTypeOf<MeasuredTemplateConfig.TemplateTypes>();
  expectTypeOf(templateContext.units).toEqualTypeOf<MeasuredTemplateConfig.Units>();
  expectTypeOf(templateContext.userColor).toEqualTypeOf<Color>();
  expectTypeOf(playlistContext.modes).toEqualTypeOf<Record<CONST.PLAYLIST_MODES, string>>();
  expectTypeOf(playlistContext.sortModes).toEqualTypeOf<Record<CONST.PLAYLIST_SORT_MODES, string>>();
  expectTypeOf(playlistContext.channels).toEqualTypeOf<Record<keyof typeof CONST.AUDIO_CHANNELS, string>>();
  expectTypeOf(new PlaylistSoundConfig({ document: sound }).document).toEqualTypeOf<PlaylistSound.Implementation>();
  expectTypeOf(soundContext.lvolume).toBeNumber();
  expectTypeOf(soundContext.defaultChannel).toBeString();

  // TableResultConfig
  expectTypeOf(TableResultConfig.RESULT_TYPES).toEqualTypeOf<TableResultConfig.ResultTypeChoice[]>();
  expectTypeOf(TableResultConfig.prepareResultUpdateData(resultUpdate)).toEqualTypeOf<void>();
  expectTypeOf(resultContext.types).toEqualTypeOf<TableResultConfig.ResultTypeChoice[]>();
  expectTypeOf(resultContext.resultDocument).toEqualTypeOf<foundry.abstract.Document.Any | null>();

  expectTypeOf(MeasuredTemplateConfig.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
});
