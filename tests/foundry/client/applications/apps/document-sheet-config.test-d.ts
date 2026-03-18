import { describe, test } from "vitest";

import DocumentSheetConfig = foundry.applications.apps.DocumentSheetConfig;
import ApplicationV2 = foundry.applications.api.ApplicationV2;

const actionFn = function (this: TestDSCExtension, event: PointerEvent, target: HTMLElement) {
  console.warn(this.id, event.altKey, target.tagName);
} satisfies ApplicationV2.ClickAction;

class TestDSCExtension extends DocumentSheetConfig {
  static actionFn = actionFn;

  static override DEFAULT_OPTIONS = {
    actions: {
      actionOne: this.actionFn,
    },
  };
}

describe("DocumentSheetConfig Tests", async () => {
  test("Construction", () => {
    // const app = new DocumentSheetConfig();
  });
});
