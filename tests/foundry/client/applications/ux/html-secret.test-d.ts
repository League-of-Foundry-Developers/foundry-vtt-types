import { test } from "vitest";

import HTMLSecret = foundry.applications.ux.HTMLSecret;

export {};

declare const actor: Actor.Implementation;

declare const element: HTMLElement;

test("foundry/client/applications/ux/html-secret", () => {
  function contentCallback(_s: HTMLElement): string {
    return "foo";
  }

  async function updateCallback(_s: HTMLElement, _c: string): Promise<Actor.Implementation> {
    return actor;
  }

  const secret = new HTMLSecret({
    parentSelector: "",
    callbacks: {
      content: contentCallback,
      update: updateCallback,
    },
  });

  secret.bind(element);
});
