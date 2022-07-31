import { expectAssignable } from 'tsd';

// prove that they are global
expectAssignable<Function>(saveDataToFile);
expectAssignable<Function>(readTextFromFile);
