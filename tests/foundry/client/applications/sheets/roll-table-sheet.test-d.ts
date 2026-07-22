import { expectTypeOf } from "vitest";

declare const doc: RollTable.Implementation;
const rollTableSheet = new foundry.applications.sheets.RollTableSheet({ document: doc });

expectTypeOf(rollTableSheet.document).toEqualTypeOf<RollTable.Implementation>();
expectTypeOf(rollTableSheet.mode).toEqualTypeOf<"edit" | "view">();
rollTableSheet.mode = "edit";
expectTypeOf(rollTableSheet.isEditMode).toEqualTypeOf<boolean>();

expectTypeOf(
  foundry.applications.sheets.RollTableSheet.DEFAULT_OPTIONS,
).toEqualTypeOf<foundry.applications.api.DocumentSheetV2.DefaultOptions>();
expectTypeOf(foundry.applications.sheets.RollTableSheet.PARTS).toEqualTypeOf<
  Record<string, foundry.applications.api.HandlebarsApplicationMixin.HandlebarsTemplatePart>
>();
expectTypeOf(foundry.applications.sheets.RollTableSheet.TABS).toEqualTypeOf<
  Record<string, foundry.applications.api.ApplicationV2.TabsConfiguration>
>();
expectTypeOf(foundry.applications.sheets.RollTableSheet.MODE_PARTS).toEqualTypeOf<Record<"edit" | "view", string[]>>();

declare class _TestRollTableSheetSubclass extends foundry.applications.sheets.RollTableSheet {
  protected override _sortResults(resultA: TableResult.Implementation, resultB: TableResult.Implementation): number;
  protected override _onDrop(event: DragEvent): Promise<void>;
}
