import { expectTypeOf } from "vitest";
import type { AnyObject, DeepPartial } from "fvtt-types/utils";

import ShapeConfig = foundry.applications.apps.ShapeConfig;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

declare const shape: ShapeConfig.Shape;

const config = new ShapeConfig({ shape });

expectTypeOf(config).toEqualTypeOf<ShapeConfig>();
expectTypeOf(config.shape).toEqualTypeOf<ShapeConfig.Shape>();
expectTypeOf(config.document).toEqualTypeOf<foundry.abstract.Document.Any>();
expectTypeOf(config.title).toBeString();

expectTypeOf(ShapeConfig.DEFAULT_OPTIONS).toEqualTypeOf<ShapeConfig.DefaultOptions>();
expectTypeOf(ShapeConfig.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();

expectTypeOf(ShapeConfig._processShapeData(shape, {})).toEqualTypeOf<AnyObject>();

declare const context: ShapeConfig.ShapeContext;
declare const fields: Record<string, foundry.data.fields.DataField.Any>;
expectTypeOf(ShapeConfig._prepareShapeContext(context, shape, fields)).toBeVoid();

declare const input: HTMLInputElement;
declare const grid: ShapeConfig.GridInfo;
expectTypeOf(ShapeConfig._onChangeDimension(input, grid)).toBeVoid();

declare class _TestShapeConfigSubclass extends ShapeConfig {
  protected override _initializeApplicationOptions(
    options: DeepPartial<ShapeConfig.Configuration>,
  ): ShapeConfig.Configuration;
  protected override _configureRenderParts(
    options: ShapeConfig.RenderOptions,
  ): Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>;
  protected override _prepareContext(
    options: DeepPartial<ShapeConfig.RenderOptions> & { isFirstRender: boolean },
  ): Promise<ShapeConfig.RenderContext>;
  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void;
  protected override _processSubmitData(
    event: SubmitEvent,
    form: HTMLFormElement,
    shapeData: AnyObject,
    updateOptions?: unknown,
  ): Promise<void>;
}
