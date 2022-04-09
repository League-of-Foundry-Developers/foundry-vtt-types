import { expectType } from 'tsd';

expectType<NotesLayer | undefined>(NotesLayer.instance);
expectType<typeof Note>(NotesLayer.layerOptions.objectClass);

const layer = new NotesLayer();
expectType<typeof Note>(layer.options.objectClass);
expectType<NotesLayer.LayerOptions>(layer.options);
expectType<'notes'>(layer.options.name);
