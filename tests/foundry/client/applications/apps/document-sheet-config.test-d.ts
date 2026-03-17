import { afterAll, describe, test } from "vitest";
import { cleanupDocuments } from "#testUtils";
import * as itemHelpers from "#tests/client/documents/item.test-d.ts";

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
const docsToCleanUp = new Set<foundry.documents.abstract.ClientDocumentMixin.AnyMixed>();

describe("DocumentSheetConfig Tests", async () => {
  const item = await Item.implementation.create(itemHelpers.minimalCreateData);
  if (!item) throw new Error("Could not create Item in test");
  docsToCleanUp.add(item);

  test("Construction", () => {
    const app = new DocumentSheetConfig();
  });

  afterAll(async () => {
    await cleanupDocuments(docsToCleanUp);
  });
});
