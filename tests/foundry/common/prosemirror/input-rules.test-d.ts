import type { InputRule } from "prosemirror-inputrules";
import { expectTypeOf } from "vitest";

import ProseMirrorInputRules = foundry.prosemirror.ProseMirrorInputRules;

declare const schema: foundry.prosemirror.Schema;

expectTypeOf(ProseMirrorInputRules.build(schema)).toEqualTypeOf<foundry.prosemirror.Plugin>();
expectTypeOf(ProseMirrorInputRules.build(schema, { minHeadingLevel: 2 })).toEqualTypeOf<foundry.prosemirror.Plugin>();
expectTypeOf(
  ProseMirrorInputRules.build(schema, { minHeadingLevel: undefined }),
).toEqualTypeOf<foundry.prosemirror.Plugin>();

const inputRules = new ProseMirrorInputRules(schema);

expectTypeOf(inputRules.buildRules()).toEqualTypeOf<InputRule[]>();
