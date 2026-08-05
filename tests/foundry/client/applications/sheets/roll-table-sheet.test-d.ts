import { expectTypeOf } from "vitest";

import ApplicationV2 = foundry.applications.api.ApplicationV2;
import DocumentSheetV2 = foundry.applications.api.DocumentSheetV2;
import RollTableSheet = foundry.applications.sheets.RollTableSheet;

declare const doc: RollTable.Implementation;
const tableSheet = new RollTableSheet({ document: doc });

expectTypeOf(tableSheet.document).toEqualTypeOf<RollTable.Implementation>();
expectTypeOf(tableSheet.mode).toEqualTypeOf<RollTableSheet.Mode>();
expectTypeOf(tableSheet.isEditMode).toBeBoolean();
tableSheet.mode = "edit";

expectTypeOf(RollTableSheet.DEFAULT_OPTIONS).toEqualTypeOf<DocumentSheetV2.DefaultOptions>();
expectTypeOf(RollTableSheet.MODE_PARTS).toEqualTypeOf<Record<RollTableSheet.Mode, string[]>>();
expectTypeOf(RollTableSheet.TABS).toEqualTypeOf<Record<string, ApplicationV2.TabsConfiguration>>();

declare const context: RollTableSheet.RenderContext;
expectTypeOf(context.results).toEqualTypeOf<RollTableSheet.ResultContext[] | undefined>();
expectTypeOf(context.descriptionHTML).toEqualTypeOf<string | undefined>();
expectTypeOf(context.formula).toEqualTypeOf<string | undefined>();
expectTypeOf(context.buttons).toEqualTypeOf<ApplicationV2.FormFooterButton[] | undefined>();

declare const result: RollTableSheet.ResultContext;
expectTypeOf(result.range).toEqualTypeOf<[low: number, high: number] | number | string>();
expectTypeOf(result.documentLink).toEqualTypeOf<string | undefined>();

class CustomRollTableSheet extends RollTableSheet {
  protected override _prepareResult(result: TableResult.Implementation): Promise<RollTableSheet.ResultContext> {
    return super._prepareResult(result);
  }

  protected override _sortResults(a: TableResult.Implementation, b: TableResult.Implementation): number {
    return super._sortResults(a, b);
  }

  protected override _animateRoll(results: TableResult.Implementation[]): Promise<void> {
    return super._animateRoll(results);
  }

  protected override _flashResult(item: HTMLElement): Promise<void> {
    return super._flashResult(item);
  }
}

expectTypeOf(CustomRollTableSheet).toExtend<RollTableSheet.AnyConstructor>();
