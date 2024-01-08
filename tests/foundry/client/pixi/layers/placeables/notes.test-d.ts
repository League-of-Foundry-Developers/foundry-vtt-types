import { expectTypeOf } from "vitest";

expectTypeOf(NotesLayer.instance).toEqualTypeOf<NotesLayer | undefined>();
expectTypeOf(NotesLayer.layerOptions.objectClass).toEqualTypeOf<typeof Note>();

const layer = new NotesLayer();
expectTypeOf(layer.options.objectClass).toEqualTypeOf<typeof Note>();
expectTypeOf(layer.options).toEqualTypeOf<NotesLayer.LayerOptions>();
expectTypeOf(layer.options.name).toEqualTypeOf<"notes">();
