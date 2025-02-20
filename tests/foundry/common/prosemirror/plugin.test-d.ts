/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import { Schema } from "prosemirror-model";
import ProseMirrorPlugin from "../../../../src/foundry/common/prosemirror/plugin.mjs";

declare const schema: foundry.prosemirror.Schema;

declare const plugin: ProseMirrorPlugin;

expectTypeOf(plugin.schema).toEqualTypeOf<Schema>();

expectTypeOf(ProseMirrorPlugin.build(schema, {})).toEqualTypeOf<foundry.prosemirror.Plugin>();
