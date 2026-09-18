import { test } from "vitest";

export {};

declare const element: HTMLElement;

test("foundry/client/applications/ux/drag-drop", () => {
  const dragDrop = new foundry.applications.ux.DragDrop({});

  dragDrop.bind(element);
});
