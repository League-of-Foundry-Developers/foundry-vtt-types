import { expectError, expectType } from 'tsd';

expectError(new Tabs());
expectError(new Tabs({}));
expectType<Tabs>(new Tabs({ navSelector: '.tabs' }));
const tabs = new Tabs({
  navSelector: '.tabs',
  contentSelector: '.content',
  initial: 'tab1',
  callback: (event: MouseEvent | null, tabs: Tabs, active: string): void => {
    console.log(active);
  }
});

expectType<string | undefined>(tabs.active);
expectType<((event: MouseEvent | null, tabs: Tabs, tabName: string) => unknown) | null | undefined>(tabs.callback);

tabs.bind(new HTMLDivElement());
tabs.activate('tab1');
tabs.activate('tab1', {});
tabs.activate('tab1', { triggerCallback: true });

expectType<typeof Tabs>(TabsV2);
