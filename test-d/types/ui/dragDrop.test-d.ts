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
