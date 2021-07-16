import { expectType } from 'tsd';
import '../../index';
import { PromisedReturnType, PromisedType } from '../../src/types/helperTypes';

type NumberPromise = Promise<number>;
const promisedTypeOfNumProm: PromisedType<NumberPromise> = 0;
expectType<number>(promisedTypeOfNumProm);

const promisedTypeOfNumber: PromisedType<number> = 0;
expectType<number>(promisedTypeOfNumber);

const returnsAPromiseOfNumber = async (): NumberPromise => 0;
const promisedReturnType1: PromisedReturnType<typeof returnsAPromiseOfNumber> = 0;
expectType<number>(promisedReturnType1);

const returnsANumber = () => 5;
const promisedReturnType2: PromisedReturnType<typeof returnsANumber> = 0;
expectType<number>(promisedReturnType2);
