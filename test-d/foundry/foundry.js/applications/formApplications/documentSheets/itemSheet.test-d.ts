import { expectType } from 'tsd';

const itemSheet = new ItemSheet();
expectType<Item>(itemSheet.object);
expectType<Item>(itemSheet.item);
expectType<Item>((await itemSheet.getData()).item);
expectType<DocumentSheet.Options>((await itemSheet.getData()).options);
