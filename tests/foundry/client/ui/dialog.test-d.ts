import { expectTypeOf } from "vitest";

const title = "title";
const content = "content";
const label = "label";
const icon = "<i class='fas fa-bug-slash'>";

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return true;
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return false;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: {},
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<HTMLElement>();
      return true;
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<HTMLElement>();
      return false;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<HTMLElement>();
    },
    options: { jQuery: false },
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return true;
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return false;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "foo";
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return 0;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
  }),
).toEqualTypeOf<Promise<string | number | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return 0;
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "foo";
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
  }),
).toEqualTypeOf<Promise<string | number | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "foo";
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "bar";
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
  }),
).toEqualTypeOf<Promise<string | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    rejectClose: true,
  }),
).toEqualTypeOf<Promise<true | false>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    rejectClose: false,
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return true;
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return false;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: {},
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "foo";
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return 0;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: {},
  }),
).toEqualTypeOf<Promise<string | number | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return 0;
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "foo";
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: {},
  }),
).toEqualTypeOf<Promise<string | number | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "foo";
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "bar";
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: {},
  }),
).toEqualTypeOf<Promise<string | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    rejectClose: true,
    options: {},
  }),
).toEqualTypeOf<Promise<true | false>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    rejectClose: false,
    options: {},
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: {},
  }),
).toEqualTypeOf<Promise<true | false | null>>();

const optionsWithJQueryUnknown = {
  jQuery: Math.random() > 0.5,
};

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return true;
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return false;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return "foo";
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return 0;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<string | number | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return 0;
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return "foo";
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<string | number | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    yes: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return "foo";
    },
    no: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return "bar";
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<string | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    rejectClose: true,
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<true | false>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    rejectClose: false,
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.confirm({
    title: title,
    content: content,
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<true | false | null>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return 0;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: { jQuery: true },
  }),
).toEqualTypeOf<Promise<number>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<HTMLElement>();
      return 0;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<HTMLElement>();
    },
    options: { jQuery: false },
  }),
).toEqualTypeOf<Promise<number>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return 0;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: {},
  }),
).toEqualTypeOf<Promise<number>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "string";
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
    },
    options: {},
  }),
).toEqualTypeOf<Promise<string>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return 0;
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<number>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return "string";
    },
    render: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
    },
    options: optionsWithJQueryUnknown,
  }),
).toEqualTypeOf<Promise<string>>();

// everything without "rejectClose" is tested above
// now we need to test an explicitly given "rejectClose"

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "string";
    },
    rejectClose: false,
  }),
).toEqualTypeOf<Promise<string | null>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "string";
    },
    options: { jQuery: true },
    rejectClose: false,
  }),
).toEqualTypeOf<Promise<string | null>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<HTMLElement>();
      return "string";
    },
    options: { jQuery: false },
    rejectClose: false,
  }),
).toEqualTypeOf<Promise<string | null>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return "string";
    },
    options: optionsWithJQueryUnknown,
    rejectClose: false,
  }),
).toEqualTypeOf<Promise<string | null>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "string";
    },
    rejectClose: true,
  }),
).toEqualTypeOf<Promise<string>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery>();
      return "string";
    },
    options: { jQuery: true },
    rejectClose: true,
  }),
).toEqualTypeOf<Promise<string>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<HTMLElement>();
      return "string";
    },
    options: { jQuery: false },
    rejectClose: true,
  }),
).toEqualTypeOf<Promise<string>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: (html) => {
      expectTypeOf(html).toEqualTypeOf<JQuery | HTMLElement>();
      return "string";
    },
    options: optionsWithJQueryUnknown,
    rejectClose: true,
  }),
).toEqualTypeOf<Promise<string>>();

expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: () => {
      return "string";
    },
    rejectClose: true,
  }),
).toEqualTypeOf<Promise<string>>();
expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: () => {
      return "string";
    },
    rejectClose: false,
  }),
).toEqualTypeOf<Promise<string | null>>();
expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: () => {
      return "string";
    },
    rejectClose: true,
  }),
).toEqualTypeOf<Promise<string>>();
expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: () => {
      return "string";
    },
    rejectClose: false,
  }),
).toEqualTypeOf<Promise<string | null>>();
expectTypeOf(
  Dialog.prompt({
    title: title,
    content: content,
    label: label,
    callback: () => {
      return "string";
    },
    rejectClose: true,
  }),
).toEqualTypeOf<Promise<string>>();

expectTypeOf(
  Dialog.wait({
    title: title,
    content: content,
    buttons: {
      button: {
        icon: icon,
        label: label,
        callback: (jqOrHtml: JQuery | HTMLElement) => {
          expectTypeOf(jqOrHtml).toEqualTypeOf<JQuery | HTMLElement>();
        },
      },
    },
  }),
).toEqualTypeOf<Promise<unknown>>();

expectTypeOf(
  Dialog.wait(
    {
      title: title,
      content: content,
      buttons: {
        button: {
          icon: icon,
          label: label,
          callback: (jq) => {
            expectTypeOf(jq).toEqualTypeOf<JQuery>();
          },
        },
      },
    },
    {
      jQuery: true,
    },
  ),
).toEqualTypeOf<Promise<unknown>>();

expectTypeOf(
  Dialog.wait(
    {
      title: title,
      content: content,
      buttons: {
        button: {
          icon: icon,
          label: label,
          callback: (html) => {
            expectTypeOf(html).toEqualTypeOf<HTMLElement>();
          },
        },
      },
    },
    {
      jQuery: false,
    },
  ),
).toEqualTypeOf<Promise<unknown>>();
