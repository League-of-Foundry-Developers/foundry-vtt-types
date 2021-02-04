import '../../index';
import { expectType } from 'tsd';

const title = 'title';
const content = 'content';
const label = 'label';

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<JQuery>(html);
      return true;
    },
    no: (html) => {
      expectType<JQuery>(html);
      return false;
    },
    render: (html) => {
      expectType<JQuery>(html);
    },
    options: { jQuery: true }
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return true;
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return false;
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: { jQuery: false }
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return true;
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return false;
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    }
  })
);

expectType<Promise<string | number | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return 'foo';
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return 0;
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    }
  })
);

expectType<Promise<string | number | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return 0;
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return 'foo';
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    }
  })
);

expectType<Promise<string | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return 'foo';
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return 'bar';
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    }
  })
);

expectType<Promise<true | false>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    rejectClose: true
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    rejectClose: false
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<HTMLElement>(html);
    }
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return true;
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return false;
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: {}
  })
);

expectType<Promise<string | number | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return 'foo';
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return 0;
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: {}
  })
);

expectType<Promise<string | number | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return 0;
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return 'foo';
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: {}
  })
);

expectType<Promise<string | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<HTMLElement>(html);
      return 'foo';
    },
    no: (html) => {
      expectType<HTMLElement>(html);
      return 'bar';
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: {}
  })
);

expectType<Promise<true | false>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    rejectClose: true,
    options: {}
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    rejectClose: false,
    options: {}
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: {}
  })
);

const optionsWithJQueryUnknown = ((): Partial<Dialog.Options> => ({}))();

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return true;
    },
    no: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return false;
    },
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    options: optionsWithJQueryUnknown
  })
);

expectType<Promise<string | number | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return 'foo';
    },
    no: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return 0;
    },
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    options: optionsWithJQueryUnknown
  })
);

expectType<Promise<string | number | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return 0;
    },
    no: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return 'foo';
    },
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    options: optionsWithJQueryUnknown
  })
);

expectType<Promise<string | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return 'foo';
    },
    no: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return 'bar';
    },
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    options: optionsWithJQueryUnknown
  })
);

expectType<Promise<true | false>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    rejectClose: true,
    options: optionsWithJQueryUnknown
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    rejectClose: false,
    options: optionsWithJQueryUnknown
  })
);

expectType<Promise<true | false | null>>(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    options: optionsWithJQueryUnknown
  })
);

expectType<Promise<number>>(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectType<JQuery>(html);
      return 0;
    },
    render: (html) => {
      expectType<JQuery>(html);
    },
    options: { jQuery: true }
  })
);

expectType<Promise<number>>(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectType<HTMLElement>(html);
      return 0;
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: { jQuery: false }
  })
);

expectType<Promise<number>>(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectType<HTMLElement>(html);
      return 0;
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: {}
  })
);

expectType<Promise<string>>(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectType<HTMLElement>(html);
      return 'string';
    },
    render: (html) => {
      expectType<HTMLElement>(html);
    },
    options: {}
  })
);

expectType<Promise<number>>(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return 0;
    },
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    options: optionsWithJQueryUnknown
  })
);

expectType<Promise<string>>(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectType<JQuery | HTMLElement>(html);
      return 'string';
    },
    render: (html) => {
      expectType<JQuery | HTMLElement>(html);
    },
    options: optionsWithJQueryUnknown
  })
);
