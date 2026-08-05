import { expectTypeOf } from "vitest";
import type { AnyObject, DeepPartial } from "fvtt-types/utils";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import PlaceableConfig = foundry.applications.sheets.PlaceableConfig;

declare const doc: TileDocument.Implementation;
const config = new PlaceableConfig<TileDocument.Implementation>({ document: doc });

expectTypeOf(config.document).toEqualTypeOf<TileDocument.Implementation>();
expectTypeOf(config.options.preview).toBeBoolean();

// @ts-expect-error - `document` is required.
new PlaceableConfig<TileDocument.Implementation>({});

expectTypeOf(PlaceableConfig.DEFAULT_OPTIONS).toEqualTypeOf<PlaceableConfig.DefaultOptions>();

declare const context: PlaceableConfig.RenderContext<TileDocument.Implementation>;
expectTypeOf(context.model).toEqualTypeOf<TileDocument.Implementation>();
expectTypeOf(context.gridUnits).toBeString();
expectTypeOf(context.selectableLevels).toEqualTypeOf<PlaceableConfig.LevelChoice[]>();
expectTypeOf(context.inputs).toEqualTypeOf<PlaceableConfig.Inputs>();
expectTypeOf(
  context.inputs.createMultiSelectInput({} as foundry.data.fields.DataField.Any, {
    name: "foo",
    type: "checkboxes",
    options: [],
  }),
).toExtend<foundry.applications.elements.HTMLMultiCheckboxElement>();

class CustomPlaceableConfig extends PlaceableConfig<TileDocument.Implementation> {
  protected override _initializePreview(): Promise<void> {
    return super._initializePreview();
  }

  protected override _createPreview(data?: AnyObject): Promise<TileDocument.Implementation> {
    return super._createPreview(data);
  }

  protected override _destroyPreview(): void {
    super._destroyPreview();
  }

  protected override _previewChanges(changes: DocumentSheetV2.SubmitData<TileDocument.Implementation>): void {
    super._previewChanges(changes);
  }

  protected override _resetPreview(): void {
    super._resetPreview();
  }

  protected override _postRender(
    ctx: DeepPartial<PlaceableConfig.RenderContext<TileDocument.Implementation>>,
    options: DeepPartial<PlaceableConfig.RenderOptions>,
  ): Promise<void> {
    return super._postRender(ctx, options);
  }

  protected override _onChangeForm(formConfig: ApplicationV2.FormConfiguration, event: Event): void {
    super._onChangeForm(formConfig, event);
  }
}

expectTypeOf(CustomPlaceableConfig).toExtend<PlaceableConfig.AnyConstructor>();
