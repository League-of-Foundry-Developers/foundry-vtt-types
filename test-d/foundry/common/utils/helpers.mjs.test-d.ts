import { expectAssignable, expectType } from 'tsd';
import '../../../index';

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

// deepClone

expectType<string>(foundry.utils.deepClone('abc' as string));
expectType<'abc'>(foundry.utils.deepClone('abc'));
expectType<number>(foundry.utils.deepClone(1 as number));
expectType<1>(foundry.utils.deepClone(1));
expectType<bigint>(foundry.utils.deepClone(1n as bigint));
expectType<1n>(foundry.utils.deepClone(1n));
expectType<true>(foundry.utils.deepClone(true));
expectType<boolean>(foundry.utils.deepClone(true as boolean));
expectType<symbol>(foundry.utils.deepClone(Symbol('customSymbol')));
expectType<undefined>(foundry.utils.deepClone(undefined));
expectType<null>(foundry.utils.deepClone(null));
expectType<Array<string>>(foundry.utils.deepClone(['a', 'b']));
expectType<Array<string>>(foundry.utils.deepClone(['a', 'b']));
expectType<{ a: string; b: number }>(foundry.utils.deepClone({ a: 'foo', b: 42 }));
expectType<Date>(foundry.utils.deepClone(new Date()));
expectType<typeof complexObject>(foundry.utils.deepClone(complexObject));

// duplicate

expectType<string>(foundry.utils.duplicate(''));

expectType<number>(foundry.utils.duplicate(0));

expectType<0 | 1>(foundry.utils.duplicate<0 | 1>(0));

expectType<'foo' | 'bar'>(foundry.utils.duplicate<'foo' | 'bar'>('foo'));

expectType<number>(foundry.utils.duplicate<number>(0));

/* `NaN` will actually be converted to `null` but for ease of use, this is ignored. */
expectType<number>(foundry.utils.duplicate<number>(NaN));

expectType<boolean>(foundry.utils.duplicate(((): boolean => false)()));

expectType<null>(foundry.utils.duplicate(null));

expectType<never>(foundry.utils.duplicate(undefined));

expectType<never>(foundry.utils.duplicate(() => 0));

expectType<never>(foundry.utils.duplicate(Symbol('')));

expectType<false>(foundry.utils.duplicate(false));

expectType<string | boolean>(foundry.utils.duplicate(((): string | boolean => '')()));

expectType<string | number>(foundry.utils.duplicate(((): string | number => '')()));

expectType<string | null>(foundry.utils.duplicate(((): string | null => '')()));

expectType<string>(foundry.utils.duplicate(((): string | undefined => '')()));

expectType<string>(foundry.utils.duplicate(((): string | Function => '')()));

expectType<string>(foundry.utils.duplicate(((): string | symbol => '')()));

expectType<Array<string>>(foundry.utils.duplicate(['']));

expectType<Array<number>>(foundry.utils.duplicate([0]));

expectType<Array<boolean>>(foundry.utils.duplicate([false, true]));

expectType<Array<null>>(foundry.utils.duplicate([null]));

expectType<Array<null>>(foundry.utils.duplicate([undefined]));

expectType<Array<null>>(foundry.utils.duplicate([() => 0]));

expectType<Array<null>>(foundry.utils.duplicate([Symbol('')]));

expectType<Array<false>>(foundry.utils.duplicate([false]));

expectType<Array<string | boolean>>(foundry.utils.duplicate(['', false, true]));

expectType<Array<string | number>>(foundry.utils.duplicate(['', 0]));

expectType<Array<string | null>>(foundry.utils.duplicate(['', null]));

expectType<Array<string | null>>(foundry.utils.duplicate(['', undefined]));

expectType<Array<string | null>>(foundry.utils.duplicate(['', () => 0]));

expectType<Array<string | null>>(foundry.utils.duplicate(['', Symbol('')]));

expectType<Array<'a' | 'b'>>(foundry.utils.duplicate([((): 'a' | 'b' => 'a')()]));

expectType<Array<Array<boolean>>>(foundry.utils.duplicate([[false, true]]));

expectType<Array<{ a: string }>>(foundry.utils.duplicate([{ a: '' }]));

expectType<{ a: string }>(foundry.utils.duplicate({ a: '' }));

expectType<{ a: number }>(foundry.utils.duplicate({ a: 0 }));

expectType<{ a: boolean }>(foundry.utils.duplicate({ a: ((): boolean => false)() }));

expectType<{ a: null }>(foundry.utils.duplicate({ a: null }));

expectType<{}>(foundry.utils.duplicate({ a: undefined }));

expectType<{}>(foundry.utils.duplicate({ a: () => 0 }));

expectType<{}>(foundry.utils.duplicate({ a: Symbol('') }));

expectType<{ a: string | boolean }>(foundry.utils.duplicate({ a: ((): string | boolean => '')() }));

expectType<{ a: string | number }>(foundry.utils.duplicate({ a: ((): string | number => '')() }));

expectType<{ a: string | null }>(foundry.utils.duplicate({ a: ((): string | null => '')() }));

expectType<{ a?: string }>(foundry.utils.duplicate({ a: ((): string | undefined => '')() }));

expectType<{ a?: string }>(foundry.utils.duplicate({ a: ((): string | Function => '')() }));

expectType<{ a?: string }>(foundry.utils.duplicate({ a: ((): string | symbol => '')() }));

expectType<{ a: Array<string> }>(foundry.utils.duplicate({ a: [''] }));

expectType<{ a: { b: string } }>(foundry.utils.duplicate({ a: { b: '' } }));

expectType<{ a: false }>(foundry.utils.duplicate({ a: false }));

expectType<{ a: 'a' | 'b' }>(foundry.utils.duplicate({ a: ((): 'a' | 'b' => 'a')() }));

expectType<string>(foundry.utils.duplicate({ a: 0, b: '', c: false, toJSON: (): string => '' }));

expectType<{ foo: string; bar: boolean }>(
  foundry.utils.duplicate({ a: 0, b: '', c: false, toJSON: () => ({ foo: '', bar: ((): boolean => false)() }) })
);

expectType<{ foo: string; bar: boolean }>(
  foundry.utils.duplicate({
    a: 0,
    b: '',
    c: false,
    toJSON: () => ({ foo: '', bar: ((): boolean => false)(), toJSON: () => '' })
  })
);

expectType<{ foo: string; bar: false }>(
  foundry.utils.duplicate({ a: 0, b: '', c: false, toJSON: () => ({ foo: '', bar: { baz: '', toJSON: () => false } }) })
);

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
>(foundry.utils.duplicate(complexObject));

// invertObject
expectType<{ readonly 1: 'a'; readonly foo: 'b' }>(foundry.utils.invertObject({ a: 1, b: 'foo' } as const));

// mergeObject: expectAssignable is used here because of https://github.com/SamVerschueren/tsd/issues/67
// mergeObject (1): tests from the docs
expectAssignable<{ k1: string }>(foundry.utils.mergeObject({ k1: 'v1' }, { k2: 'v2' }, { insertKeys: false }));
expectAssignable<{ k1: string; k2: string }>(
  foundry.utils.mergeObject({ k1: 'v1' }, { k2: 'v2' }, { insertKeys: true })
);
expectAssignable<{ k1: { i1: string } }>(
  foundry.utils.mergeObject({ k1: { i1: 'v1' } }, { k1: { i2: 'v2' } }, { insertValues: false })
);
expectAssignable<{ k1: { i1: string; i2: string } }>(
  foundry.utils.mergeObject({ k1: { i1: 'v1' } }, { k1: { i2: 'v2' } }, { insertValues: true })
);

expectAssignable<{ k1: string }>(foundry.utils.mergeObject({ k1: 'v1' }, { k1: 'v2' }, { overwrite: true }));
expectAssignable<{ k1: string }>(foundry.utils.mergeObject({ k1: 'v1' }, { k1: 'v2' }, { overwrite: false }));

expectAssignable<{ k1: { i2: string } }>(
  foundry.utils.mergeObject({ k1: { i1: 'v1' } }, { k1: { i2: 'v2' } }, { recursive: false })
);
expectAssignable<{ k1: { i1: string; i2: string } }>(
  foundry.utils.mergeObject({ k1: { i1: 'v1' } }, { k1: { i2: 'v2' } }, { recursive: true })
);
expectAssignable<{ k2: string }>(foundry.utils.mergeObject({ k1: 'v1', k2: 'v2' }, { '-=k1': null }));

// mergeObject (2): more simple tests

expectAssignable<{ k1: string }>(foundry.utils.mergeObject({ k1: '' }, { k1: '' }));
expectAssignable<{ k1: string }>(foundry.utils.mergeObject({ k1: '' }, { k1: '' }, {}));
expectAssignable<{ k1: string }>(foundry.utils.mergeObject({ k1: '' }, { k1: '' }, { insertKeys: false }));
expectAssignable<{ k1: string }>(foundry.utils.mergeObject({ k1: '' }, { k1: '' }, { insertKeys: true }));

expectAssignable<{ k1: string; k2: string }>(foundry.utils.mergeObject({ k1: '' }, { k2: '' }));
expectAssignable<{ k1: string; k2: string }>(foundry.utils.mergeObject({ k1: '' }, { k2: '' }, {}));
expectAssignable<{ k1: string }>(foundry.utils.mergeObject({ k1: '' }, { k2: '' }, { insertKeys: false }));
expectAssignable<{ k1: string; k2: string }>(foundry.utils.mergeObject({ k1: '' }, { k2: '' }, { insertKeys: true }));

expectAssignable<{ k1: number; k2: string }>(foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }));
expectAssignable<{ k1: number; k2: string }>(foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, {}));
expectAssignable<{ k1: number }>(foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { insertKeys: false }));
expectAssignable<{ k1: number; k2: string }>(
  foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { insertKeys: true })
);

expectAssignable<never>(foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { enforceTypes: true }));
expectAssignable<{ k1: number; k2: string }>(
  foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { enforceTypes: false })
);
expectAssignable<never>(
  foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { enforceTypes: true, insertKeys: false })
);
expectAssignable<never>(
  foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { enforceTypes: true, insertKeys: true })
);

expectAssignable<{ k1: string; k2: string }>(
  foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { overwrite: false })
);
expectAssignable<{ k1: number; k2: string }>(
  foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { overwrite: true })
);
expectAssignable<{ k1: number; k2: string }>(foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, {}));
expectAssignable<{ k1: string }>(
  foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { overwrite: false, insertKeys: false })
);
expectAssignable<{ k1: string; k2: string }>(
  foundry.utils.mergeObject({ k1: '' }, { k1: 2, k2: '' }, { overwrite: false, insertKeys: true })
);

// mergeObject (3): more complex examples
expectAssignable<{ k1: { i1: string; i2: string }; k2: number; k3: number }>(
  foundry.utils.mergeObject({ k1: { i1: 'foo' }, k2: 2 }, { k1: { i2: 'bar' }, k3: 3 })
);
expectAssignable<{ k1: { i1: string; i2: string; i3: number }; k2: number; k3: number }>(
  foundry.utils.mergeObject({ k1: { i1: 'foo', i3: { j1: 0 } }, k2: 2 }, { k1: { i2: 'bar', i3: 2 }, k3: 3 })
);
expectAssignable<{ k1: { i2: string; i3: number }; k2: number; k3: number }>(
  foundry.utils.mergeObject(
    { k1: { i1: 'foo', i3: { j1: 0 } }, k2: 2 },
    { k1: { i2: 'bar', i3: 2 }, k3: 3 },
    { recursive: false }
  )
);
expectType<{ i2: string; i3: number }>(
  foundry.utils.mergeObject(
    { k1: { i1: 'foo', i3: { j1: 0 } }, k2: 2 },
    { k1: { i2: 'bar', i3: 2 }, k3: 3 },
    { recursive: false }
  ).k1
);
expectAssignable<{
  k1: { i1: string; i2: string; i3: { j1: string; j2: number; j3: string } };
  k2: number;
  k3: number;
}>(
  foundry.utils.mergeObject(
    { k1: { i1: 'foo', i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: 'bar', i3: { j1: '1', j3: '3' } }, k3: 3 }
  )
);
expectAssignable<{ k1: { i1: string; i3: { j1: string; j2: number } }; k2: number; k3: number }>(
  foundry.utils.mergeObject(
    { k1: { i1: 'foo', i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: 'bar', i3: { j1: '1', j3: '3' } }, k3: 3 },
    { insertValues: false }
  )
);
expectAssignable<{ k1: { i2: string; i3: { j1: string; j3: string } }; k2: number; k3: number }>(
  foundry.utils.mergeObject(
    { k1: { i1: 'foo', i3: { j1: 1, j2: 2 } }, k2: 2 },
    { k1: { i2: 'bar', i3: { j1: '1', j3: '3' } }, k3: 3 },
    { recursive: false }
  )
);

// Array merging

expectAssignable<FormApplication.Options>(
  foundry.utils.mergeObject(FormApplication.defaultOptions, {
    classes: ['my', 'custom', 'css']
  })
);
expectAssignable<{ a: number[] }>(foundry.utils.mergeObject({ a: ['foo'] }, { a: [0] }));
expectAssignable<{ a: number[] }>(foundry.utils.mergeObject({ a: ['foo'] }, { a: [0] }, { insertKeys: true }));
expectAssignable<{ a: number[] }>(foundry.utils.mergeObject({ a: ['foo'] }, { a: [0] }, { insertValues: true }));
expectAssignable<{ a: number[] }>(foundry.utils.mergeObject({ a: ['foo'] }, { a: [0] }, { insertKeys: false }));
expectAssignable<{ a: number[] }>(foundry.utils.mergeObject({ a: ['foo'] }, { a: [0] }, { insertValues: false }));
expectAssignable<{ a: number[] }>(foundry.utils.mergeObject({ a: ['foo'] }, { a: [0] }, { enforceTypes: true }));
expectAssignable<never>(foundry.utils.mergeObject({ a: ['foo'] }, { a: { b: 'foo' } }, { enforceTypes: true }));
expectAssignable<{ a: { b: string } }>(
  foundry.utils.mergeObject({ a: ['foo'] }, { a: { b: 'foo' } }, { enforceTypes: false })
);
expectAssignable<never>(foundry.utils.mergeObject({ a: { b: 'foo' } }, { a: ['foo'] }, { enforceTypes: true }));
expectAssignable<{ a: string[] }>(
  foundry.utils.mergeObject({ a: { b: 'foo' } }, { a: ['foo'] }, { enforceTypes: false })
);
