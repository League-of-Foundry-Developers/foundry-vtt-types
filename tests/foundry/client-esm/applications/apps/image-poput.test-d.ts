import { expectTypeOf } from "vitest";

// @ts-expect-error `src` is required
new foundry.applications.apps.ImagePopout();

const ip = new foundry.applications.apps.ImagePopout({ src: "some/file/path" });
expectTypeOf(ip.options.src).toBeString();
