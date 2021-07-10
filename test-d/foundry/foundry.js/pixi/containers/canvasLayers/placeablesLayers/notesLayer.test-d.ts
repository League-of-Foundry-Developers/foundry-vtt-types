import { expectType } from 'tsd';

expectType<'Note'>(NotesLayer.documentName);
expectType<NotesLayer | undefined>(NotesLayer.instance);
expectType<NotesLayer.LayerOptions>(NotesLayer.layerOptions);
expectType<'notes'>(NotesLayer.layerOptions.name);
expectType<ConstructorOf<Note>>(NotesLayer.layerOptions.objectClass);

expectType<'notesDisplayToggle'>(NotesLayer.TOGGLE_SETTING);

expectType<void>(NotesLayer.registerSettings());

const layer = new NotesLayer();
expectType<ConstructorOf<Note>>(layer.options.objectClass);
expectType<NotesLayer.LayerOptions>(layer.options);
expectType<'notes'>(layer.options.name);

expectType<NotesLayer>(layer.activate());

expectType<NotesLayer>(layer.deactivate());
