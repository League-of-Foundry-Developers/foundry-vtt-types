import { expectTypeOf } from "vitest";
import type { DeepPartial } from "fvtt-types/utils";

declare const prototype: foundry.data.PrototypeToken;
const prototypeConfig = new foundry.applications.sheets.PrototypeTokenConfig({ prototype });

expectTypeOf(prototypeConfig.token).toEqualTypeOf<foundry.data.PrototypeToken>();
expectTypeOf(prototypeConfig.actor).toEqualTypeOf<Actor.Implementation | null>();
expectTypeOf(prototypeConfig.isPrototype).toEqualTypeOf<true>();
expectTypeOf(prototypeConfig.isVisible).toEqualTypeOf<boolean>();
expectTypeOf(prototypeConfig.title).toEqualTypeOf<string>();

expectTypeOf(
  foundry.applications.sheets.PrototypeTokenConfig.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.sheets.PrototypeTokenConfig.DefaultOptions>();

declare class _TestPrototypeTokenConfigSubclass extends foundry.applications.sheets.PrototypeTokenConfig {
  protected override _onRender(
    context: DeepPartial<foundry.applications.sheets.PrototypeTokenConfig.RenderContext>,
    options: DeepPartial<foundry.applications.sheets.PrototypeTokenConfig.RenderOptions>,
  ): Promise<void>;
  protected override _onClose(
    options: DeepPartial<foundry.applications.sheets.PrototypeTokenConfig.RenderOptions>,
  ): void;
  protected _previewChanges(changes: foundry.data.PrototypeToken.UpdateData): void;
}
