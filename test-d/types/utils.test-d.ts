import '../../index';
import { expectType } from 'tsd';

expectType<string>(duplicate(''));

expectType<number | null>(duplicate(0));

expectType<number>(duplicate<number, 'lenient'>(0));

/* by explicitly specifying `'lenient'`, we tell the compiler to use number. It will accept it, even if at runtime there
   are numbers which are converted to `null` */
expectType<number>(duplicate<number, 'lenient'>(NaN));

expectType<boolean>(duplicate(((): boolean => false)()));

expectType<null>(duplicate(null));

expectType<never>(duplicate(undefined));

expectType<never>(duplicate(() => 0));

expectType<never>(duplicate(Symbol('')));

expectType<false>(duplicate(false));

expectType<string | boolean>(duplicate(((): string | boolean => '')()));

expectType<string | number | null>(duplicate(((): string | number => '')()));

expectType<string | number>(duplicate<string | number, 'lenient'>(((): string | number => '')()));

expectType<string | null>(duplicate(((): string | null => '')()));

expectType<string>(duplicate(((): string | undefined => '')()));

expectType<string>(duplicate(((): string | Function => '')()));

expectType<string>(duplicate(((): string | symbol => '')()));

expectType<Array<string>>(duplicate(['']));

expectType<Array<number | null>>(duplicate([0]));

expectType<Array<number>>(
  duplicate<Array<number>, 'lenient'>([0])
);

expectType<Array<boolean>>(duplicate([false, true]));

expectType<Array<null>>(duplicate([null]));

expectType<Array<null>>(duplicate([undefined]));

expectType<Array<null>>(duplicate([() => 0]));

expectType<Array<null>>(duplicate([Symbol('')]));

expectType<Array<false>>(duplicate([false]));

expectType<Array<string | boolean>>(duplicate(['', false, true]));

expectType<Array<string | number | null>>(duplicate(['', 0]));

expectType<Array<string | number>>(
  duplicate<Array<string | number>, 'lenient'>(['', 0])
);

expectType<Array<string | null>>(duplicate(['', null]));

expectType<Array<string | null>>(duplicate(['', undefined]));

expectType<Array<string | null>>(duplicate(['', () => 0]));

expectType<Array<string | null>>(duplicate(['', Symbol('')]));

expectType<Array<'a' | 'b'>>(duplicate([((): 'a' | 'b' => 'a')()]));

expectType<Array<Array<boolean>>>(duplicate([[false, true]]));

expectType<Array<{ a: string }>>(duplicate([{ a: '' }]));

expectType<{ a: string }>(duplicate({ a: '' }));

expectType<{ a: number | null }>(duplicate({ a: 0 }));

expectType<{ a: number }>(
  duplicate<{ a: number }, 'lenient'>({ a: 0 })
);

expectType<{ a: boolean }>(duplicate({ a: ((): boolean => false)() }));

expectType<{ a: null }>(duplicate({ a: null }));

expectType<{}>(duplicate({ a: undefined }));

expectType<{}>(duplicate({ a: () => 0 }));

expectType<{}>(duplicate({ a: Symbol('') }));

expectType<{ a: string | boolean }>(duplicate({ a: ((): string | boolean => '')() }));

expectType<{ a: string | number | null }>(duplicate({ a: ((): string | number => '')() }));

expectType<{ a: string | number }>(
  duplicate<{ a: string | number }, 'lenient'>({ a: ((): string | number => '')() })
);

expectType<{ a: string | null }>(duplicate({ a: ((): string | null => '')() }));

expectType<{ a?: string }>(duplicate({ a: ((): string | undefined => '')() }));

expectType<{ a?: string }>(duplicate({ a: ((): string | Function => '')() }));

expectType<{ a?: string }>(duplicate({ a: ((): string | symbol => '')() }));

expectType<{ a: Array<string> }>(duplicate({ a: [''] }));

expectType<{ a: { b: string } }>(duplicate({ a: { b: '' } }));

expectType<{ a: false }>(duplicate({ a: false }));

expectType<{ a: 'a' | 'b' }>(duplicate({ a: ((): 'a' | 'b' => 'a')() }));

expectType<string>(duplicate({ a: 0, b: '', c: false, toJSON: (): string => '' }));

expectType<{ foo: string; bar: boolean }>(
  duplicate({ a: 0, b: '', c: false, toJSON: () => ({ foo: '', bar: ((): boolean => false)() }) })
);

expectType<{ foo: string; bar: boolean }>(
  duplicate({ a: 0, b: '', c: false, toJSON: () => ({ foo: '', bar: ((): boolean => false)(), toJSON: () => '' }) })
);

expectType<{ foo: string; bar: false }>(
  duplicate({ a: 0, b: '', c: false, toJSON: () => ({ foo: '', bar: { baz: '', toJSON: () => false } }) })
);

const complexObject = {
  a: '',
  b: 0,
  toJSON: () => [
    false,
    undefined,
    {
      c: undefined,
      d: ((): boolean | symbol => false)(),
      e: [true],
      f: { g: 0, h: ((): number | undefined => 0)() }
    }
  ]
};

expectType<
  Array<
    | boolean
    | null
    | {
        d?: boolean;
        e: Array<boolean>;
        f: { g: number | null; h?: number | null };
      }
  >
>(duplicate(complexObject));

expectType<
  Array<
    | boolean
    | null
    | {
        d?: boolean;
        e: Array<boolean>;
        f: { g: number; h?: number };
      }
  >
>(duplicate<typeof complexObject, 'lenient'>(complexObject));

type SomeItemData = Item.Data<{}>;
class SomeItem extends Item<SomeItemData> {}
const someItem = new SomeItem();
const someItemData = duplicate<SomeItem, 'lenient'>(someItem);
SomeItem.create<SomeItem>(someItemData);

type SomeActorData = Actor.Data<{}, SomeItemData>;
class SomeActor extends Actor<SomeActorData, SomeItem> {}
const someActor = new SomeActor();
const someActorData = duplicate<SomeActor, 'lenient'>(someActor);
SomeActor.create<SomeActor>(someActorData);
