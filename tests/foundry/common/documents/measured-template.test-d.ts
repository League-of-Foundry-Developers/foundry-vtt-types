import { expectTypeOf } from "vitest";

const template = new foundry.documents.BaseMeasuredTemplate();
expectTypeOf(template._id).toEqualTypeOf<string | null>();
expectTypeOf(template.t).toEqualTypeOf<foundry.CONST.MEASURED_TEMPLATE_TYPES>();
expectTypeOf(template.parent).toEqualTypeOf<Scene | null>();
