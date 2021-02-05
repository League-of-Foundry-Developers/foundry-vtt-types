import '../../types/index';
import { expectType, expectError } from 'tsd';

const dragSelector = '.foo';
const dropSelector = '#bar';

const withSelectors = new DragDrop({
  dragSelector: dragSelector,
  dropSelector: dropSelector,
  permissions: {
    foo: (selector) => {
      expectType<typeof dragSelector | typeof dropSelector>(selector);
      return true;
    }
  }
});
withSelectors.can('', dragSelector);
withSelectors.can('', dropSelector);
expectError(withSelectors.can('', 'baz'));

new DragDrop({
  permissions: {
    foo: (selector) => {
      expectType<null>(selector);
      return true;
    }
  }
});

const withSomeCallbacks = new DragDrop({
  callbacks: {
    numberCallback: () => 0,
    stringCallback: () => 'baz'
  } as Record<string, (event: DragEvent) => number | string>
});
expectType<number>(withSomeCallbacks.callback(new DragEvent(''), 'numberCallback'));
expectType<string>(withSomeCallbacks.callback(new DragEvent(''), 'stringCallback'));
expectType<void>(withSomeCallbacks.callback(new DragEvent(''), ''));

const withSomePermissions = new DragDrop({
  permissions: {
    truePermission: () => true,
    falsePermission: () => false
  }
});
expectType<true>(withSomePermissions.can('truePermission', null));
expectType<false>(withSomePermissions.can('falsePermission', null));
expectType<true>(withSomePermissions.can('nonExistantPermission', null));
