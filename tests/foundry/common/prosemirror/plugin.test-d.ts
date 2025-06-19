/* eslint-disable import-x/extensions */
import { expectTypeOf } from "vitest";
import { Schema } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import ProseMirrorPlugin from "../../../../src/foundry/common/prosemirror/plugin.mjs";
import type { AnyObject } from "#utils";

declare const schema: foundry.prosemirror.Schema;

declare class MyPlugin extends ProseMirrorPlugin {
  static override build(schema: Schema, options: AnyObject): Plugin;
}

const plugin = new MyPlugin(schema);

expectTypeOf(plugin.schema).toEqualTypeOf<Schema>();

expectTypeOf(MyPlugin.build(schema, {})).toEqualTypeOf<Plugin>();
