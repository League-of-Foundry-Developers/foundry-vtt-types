import type { InputRule } from "prosemirror-inputrules";
import { expectTypeOf } from "vitest";

declare const schema: foundry.prosemirror.Schema;

const inputRules = new foundry.prosemirror.ProseMirrorInputRules(schema);

expectTypeOf(inputRules.buildRules()).toEqualTypeOf<InputRule[]>();

expectTypeOf(foundry.prosemirror.ProseMirrorInputRules.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
