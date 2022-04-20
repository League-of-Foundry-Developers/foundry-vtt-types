import { expectType } from 'tsd';

const journalSheet = new JournalSheet(new JournalEntry({ name: 'Some Journal Entry' }));
expectType<JournalEntry>(journalSheet.object);
expectType<JournalSheetOptions>((await journalSheet.getData()).options);
expectType<JournalSheet>(journalSheet.render(true, { sheetMode: 'image' }));
