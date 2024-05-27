import { expectTypeOf } from "vitest";

const template = new foundry.documents.BaseMeasuredTemplate();
expectTypeOf(template._id).toEqualTypeOf<string | null>();
expectTypeOf(template.t).toEqualTypeOf<"circle" | "cone" | "rect" | "ray">();
expectTypeOf(template.parent).toEqualTypeOf<Scene | null>();
