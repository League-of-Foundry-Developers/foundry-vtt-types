import { expectError, expectType } from 'tsd';

declare const doc: NoteDocument;

expectType<'Note'>(Note.embeddedName);

const note = new Note(doc);
expectType<JournalEntry>(note.entry);
expectType<string>(note.text);
expectType<number>(note.size);
expectType<Promise<Note>>(note.draw());

expectType<foundry.documents.Note>(new foundry.documents.Note());

expectType<foundry.documents.Note>(new foundry.documents.Note({}));

expectType<foundry.documents.Note>(
  new foundry.documents.Note({
    _id: undefined,
    entryId: undefined,
    x: undefined,
    y: undefined,
    icon: undefined,
    iconSize: undefined,
    iconTint: undefined,
    text: undefined,
    fontFamily: undefined,
    fontSize: undefined,
    textAnchor: undefined,
    textColor: undefined,
    flags: undefined
  })
);

expectType<foundry.documents.Note>(
  new foundry.documents.Note({
    _id: null,
    entryId: null,
    x: null,
    y: null,
    icon: null,
    iconSize: null,
    iconTint: null,
    text: null,
    fontFamily: null,
    fontSize: null,
    textAnchor: null,
    textColor: null,
    flags: null
  })
);

expectType<foundry.documents.Note>(
  new foundry.documents.Note({
    _id: 'bfeabfiea',
    entryId: 'bebfegibefaei',
    x: 100,
    y: 300,
    icon: 'path/to/some/icon.svg',
    iconSize: 100,
    iconTint: '#FFFFFF',
    text: 'Some text',
    fontFamily: 'Comic Sans',
    fontSize: 50,
    textAnchor: foundry.CONST.TEXT_ANCHOR_POINTS.TOP,
    textColor: '#FF0000',
    flags: {}
  })
);

expectError(new foundry.documents.Note({ textAnchor: 999 }));
