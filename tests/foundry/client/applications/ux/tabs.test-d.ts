import { expectTypeOf } from "vitest";

// @ts-expect-error - Tabs requires data.
new Tabs();

// @ts-expect-error - Tabs requires a navSelector.
new Tabs({});

expectTypeOf(new Tabs({ navSelector: ".tabs" })).toEqualTypeOf<Tabs>();
const tabs = new Tabs({
  navSelector: ".tabs",
  contentSelector: ".content",
  initial: "tab1",
  callback: (event: MouseEvent | null, tabs: Tabs, active: string): void => {
    console.log(active);
  },
});

expectTypeOf(tabs.active).toEqualTypeOf<string | undefined>();
expectTypeOf(tabs.callback).toEqualTypeOf<
  ((event: MouseEvent | null, tabs: Tabs, tabName: string) => unknown) | null | undefined
>();

tabs.bind(new HTMLDivElement());
tabs.activate("tab1");
tabs.activate("tab1", {});
tabs.activate("tab1", { triggerCallback: true });
