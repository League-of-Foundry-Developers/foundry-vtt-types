import { expectType } from 'tsd';
import '../../../index';

const macro = new Macro({ name: 'my macro', scope: 'global', type: 'script' });

// properties and functions added by the concrete `Macro` class
expectType<boolean>(macro.isAuthor);
expectType<(scope?: { actor?: Actor; token?: Token }) => void>(macro.execute);

// properties and functions of `ClientDocumentMixin`
expectType<Record<string, Application>>(macro.apps);
expectType<Collection<Macro>>(macro.collection);
expectType<Folder | null>(macro.folder);
expectType<boolean>(macro.isOwner);

// static properties and functions of `ClientDocumentMixin`
expectType<Promise<Macro | null | undefined>>(Macro.createDialog());

// static properties of `BaseMacro`
expectType<typeof foundry.data.MacroData>(Macro.schema);

// properties of `Document`
expectType<null>(macro.parent);
expectType<string | null>(macro.pack);

// static properties of `Document`
expectType<Promise<StoredDocument<Macro> | undefined>>(Macro.create({ name: 'Some Macro' }));
expectType<Promise<StoredDocument<Macro>[]>>(Macro.createDocuments([]));
expectType<Promise<Macro[]>>(Macro.updateDocuments([]));
expectType<Promise<Macro[]>>(Macro.deleteDocuments([]));
