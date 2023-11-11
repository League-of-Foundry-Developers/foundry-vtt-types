import { expectTypeOf } from "vitest";

// @ts-expect-error - A SearchFilter requires data.
new SearchFilter();

// @ts-expect-error - A SearchFilter requires an `inputSelector` and a `contentSelector`.
new SearchFilter({});

expectTypeOf(
  new SearchFilter({
    inputSelector: "input",
    contentSelector: ".my-class",
    callback: (event: KeyboardEvent, query: string, rgx: RegExp, content: string): void => {
      rgx.exec(content);
    },
  }),
).toEqualTypeOf<SearchFilter>();

const filter = new SearchFilter({
  inputSelector: "input",
  contentSelector: ".my-class",
  callback: (event: KeyboardEvent, query: string, rgx: RegExp, content: string): void => {
    rgx.exec(content);
  },
  initial: "Type here",
  delay: 100,
});

expectTypeOf(filter.query).toEqualTypeOf<string>();
expectTypeOf(filter.callback).toEqualTypeOf<
  (event: KeyboardEvent, query: string, rgx: RegExp, content: string) => void
>();
expectTypeOf(filter.rgx).toEqualTypeOf<RegExp | undefined>();
expectTypeOf(filter.bind(new HTMLDivElement())).toEqualTypeOf<void>();
expectTypeOf(filter.filter(new KeyboardEvent("keyup"), "Typed")).toEqualTypeOf<void>();

expectTypeOf(SearchFilter.cleanQuery(" my-query")).toEqualTypeOf<string>();
