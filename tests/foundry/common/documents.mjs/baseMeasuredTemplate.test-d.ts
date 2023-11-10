import { expectTypeOf } from "vitest";

const template = new foundry.documents.BaseMeasuredTemplate();
expectTypeOf(template.data._id).toEqualTypeOf<string | null>();
expectTypeOf(template.data.t).toEqualTypeOf<"circle" | "cone" | "rect" | "ray">();
expectTypeOf(template.parent).toEqualTypeOf<Scene | null>();
