import HTMLSecret = foundry.applications.ux.HTMLSecret;

export {};

declare const actor: Actor.Implementation;

declare const element: HTMLElement;

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
