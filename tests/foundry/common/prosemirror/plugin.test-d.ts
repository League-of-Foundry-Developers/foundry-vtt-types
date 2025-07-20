import { expectTypeOf } from "vitest";
import { Schema } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import type { AnyObject } from "#utils";

declare const schema: foundry.prosemirror.Schema;

declare class MyPlugin extends foundry.prosemirror.ProseMirrorPlugin {
  static override build(schema: Schema, options: AnyObject): Plugin;
}

const plugin = new MyPlugin(schema);

expectTypeOf(plugin.schema).toEqualTypeOf<Schema>();

expectTypeOf(MyPlugin.build(schema, {})).toEqualTypeOf<Plugin>();
