import { expectTypeOf } from "vitest";

expectTypeOf(foundry.applications.elements.HTMLHueSelectorSlider.tagName).toEqualTypeOf<"hue-slider">();
