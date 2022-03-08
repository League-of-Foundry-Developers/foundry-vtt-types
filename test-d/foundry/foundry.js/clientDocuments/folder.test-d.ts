import { expectType } from 'tsd';

expectType<Folder | undefined | null>(await Folder.createDialog());
