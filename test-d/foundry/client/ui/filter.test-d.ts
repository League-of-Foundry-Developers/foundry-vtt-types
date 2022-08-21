import { expectError, expectType } from "tsd";

expectError<SearchFilter>(new SearchFilter());
expectError<SearchFilter>(new SearchFilter({}));
expectType<SearchFilter>(
  new SearchFilter({
    inputSelector: "input",
    contentSelector: ".my-class",
    callback: (event: KeyboardEvent, query: string, rgx: RegExp, content: string): void => {
      rgx.exec(content);
    }
  })
);
const filter = new SearchFilter({
  inputSelector: "input",
  contentSelector: ".my-class",
  callback: (event: KeyboardEvent, query: string, rgx: RegExp, content: string): void => {
    rgx.exec(content);
  },
  initial: "Type here",
  delay: 100
});

expectType<string>(filter.query);
expectType<(event: KeyboardEvent, query: string, rgx: RegExp, content: string) => void>(filter.callback);
expectType<RegExp | undefined>(filter.rgx);
expectType<void>(filter.bind(new HTMLDivElement()));
expectType<void>(filter.filter(new KeyboardEvent("keyup"), "Typed"));

expectType<string>(SearchFilter.cleanQuery(" my-query"));
