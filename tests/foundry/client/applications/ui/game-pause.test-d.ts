import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

import GamePause = foundry.applications.ui.GamePause;

const gamePause = new GamePause({});

expectTypeOf(GamePause.DEFAULT_OPTIONS).toEqualTypeOf<
  DeepPartial<foundry.applications.api.ApplicationV2.Configuration> & object
>();
declare const context: GamePause.RenderContext;
expectTypeOf(context.cssClass).toEqualTypeOf<string>();
expectTypeOf(context.icon).toEqualTypeOf<string>();
expectTypeOf(context.text).toEqualTypeOf<string>();
expectTypeOf(context.spin).toEqualTypeOf<boolean>();

declare const html: GamePause.RenderHTMLReturn;
expectTypeOf(html).toEqualTypeOf<[HTMLImageElement, HTMLElement]>();

// `_renderHTML` builds the pair directly rather than a template, so the tuple is the contract
// `_replaceHTML` consumes.
declare const element: HTMLElement;
expectTypeOf(gamePause["_prepareContext"]({ isFirstRender: true })).toEqualTypeOf<Promise<GamePause.RenderContext>>();
expectTypeOf(gamePause["_renderHTML"](context, {})).toEqualTypeOf<Promise<GamePause.RenderHTMLReturn>>();
expectTypeOf(gamePause["_replaceHTML"](html, element, {})).toEqualTypeOf<void>();
