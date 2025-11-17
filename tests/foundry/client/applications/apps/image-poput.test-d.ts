import { describe, expectTypeOf, test } from "vitest";

import ImagePopout = foundry.applications.apps.ImagePopout;

describe("ImagePopout Tests", () => {
  test("Construction", () => {
    // @ts-expect-error a `src` must be passed somehow
    new ImagePopout();

    // Passing `src` as the first argument is deprecated since v13, until v15
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    new ImagePopout("path/to/img.png");

    new ImagePopout({ src: "path/to/img.png" });
    new ImagePopout({
      src: "path/to/img.png",
      caption: "A Caption",
      uuid: "JournalEntry.ID.JournalEntryPage.ID",
      showTitle: true,
    });
    new ImagePopout({
      src: "path/to/img.png",
      caption: "A Caption",
      uuid: null,
      showTitle: undefined,
    });
  });

  const ip = new ImagePopout({
    src: "path/to/img.png",
    caption: "A Caption",
    uuid: "JournalEntry.ID.JournalEntryPage.ID",
    showTitle: true,
  });

  test("Configuration", () => {
    expectTypeOf(ip.options.src).toBeString();

    // should be just `string` with better DEFAULT_OPTIONS handling
    expectTypeOf(ip.options.caption).toEqualTypeOf<string | undefined>();

    // should just be `string | null` with better DEFAULT_OPTIONS handling
    expectTypeOf(ip.options.uuid).toEqualTypeOf<string | null | undefined>();

    expectTypeOf(ip.options.showTitle).toEqualTypeOf<boolean | undefined>();
  });

  test("Sharing", () => {
    expectTypeOf(ip.shareImage()).toBeVoid();
    expectTypeOf(ip.shareImage({})).toBeVoid();
    expectTypeOf(
      ip.shareImage({
        image: "path/to/different/image.webp",
        title: "A Title",
        showTitle: true,
        caption: "A Different Caption",
        uuid: null,
        users: ["UserID1", "UserID2"],
      }),
    ).toBeVoid();
    expectTypeOf(
      ip.shareImage({
        image: undefined,
        title: undefined,
        showTitle: undefined,
        caption: undefined,
        users: undefined,
        uuid: undefined,
      }),
    ).toBeVoid();

    // @ts-expect-error The static method doesn't have access to a predefined `src` from instance construction, so an `image` must be passed
    // Also, due to how the parameters are defined, not passing a title overrides the default AppV2 title of `""` with `undefined`, which errors
    ImagePopout._handleShareImage();

    expectTypeOf(
      ImagePopout._handleShareImage({ image: "path/to/image.jpeg", title: "A Title" }),
    ).toEqualTypeOf<ImagePopout.Any>();
    expectTypeOf(
      ImagePopout._handleShareImage({
        image: "path/to/image.jpeg",
        title: "A Title",
        showTitle: true,
        caption: "foo",
        uuid: "JournalEntry.ID.JournalEntryPage.ID",
      }),
    ).toEqualTypeOf<ImagePopout.Any>();
  });
});
