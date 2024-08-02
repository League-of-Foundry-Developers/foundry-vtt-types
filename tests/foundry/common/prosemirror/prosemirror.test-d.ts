import type { Schema } from "prosemirror-model";
import type { EditorState } from "prosemirror-state";
import { expectTypeOf } from "vitest";
import "../../../../src/foundry/common/prosemirror/prosemirror.d.mts";

expectTypeOf(ProseMirror.EditorState).toEqualTypeOf<typeof EditorState>();
expectTypeOf(ProseMirror.Schema).toEqualTypeOf<typeof Schema>();
expectTypeOf(ProseMirror.defaultSchema).toEqualTypeOf<Schema>();
