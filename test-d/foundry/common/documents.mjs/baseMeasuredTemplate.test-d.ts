import { expectType } from "tsd";

const template = new foundry.documents.BaseMeasuredTemplate();
expectType<string | null>(template.data._id);
expectType<"circle" | "cone" | "rect" | "ray">(template.data.t);
expectType<Scene | null>(template.parent);
