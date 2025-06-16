import { assertType, expectTypeOf, test } from "vitest";

import DocumentSheet = foundry.appv1.api.DocumentSheet;
import FormApplication = foundry.appv1.api.FormApplication;

const doc = new AmbientLightDocument.implementation();
const sheet = new (class extends DocumentSheet<
  AmbientLightDocument.Implementation,
  DocumentSheet.Options<AmbientLightDocument.Implementation>
> {})(doc);

assertType<FormApplication<AmbientLightDocument.Implementation, DocumentSheet.Options>>(sheet);
expectTypeOf(sheet.isEditable).toEqualTypeOf<boolean>();
expectTypeOf(sheet.document).toEqualTypeOf<AmbientLightDocument.Implementation>();

// Reported by @123499 on Discord, see https://discord.com/channels/732325252788387980/803646399014109205/1376768447630934056
test("mergeObject regression test", () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  class SkillEditSheet extends DocumentSheet {
    static override get defaultOptions() {
      const options = super.defaultOptions;

      // Test that `viewPermission` isn't mangled.
      return foundry.utils.mergeObject(options, {
        classes: ["sr5", "sheet", "skill-edit-window"], // Test that `readonly` is stripped.
        height: "auto",
      });
    }
  }
});
