import { expectTypeOf } from "vitest";
import ProseMirrorDropDown = foundry.prosemirror.ProseMirrorDropDown;

declare const entry: ProseMirrorDropDown.Entry;
const entries = [
  {
    action: "foo",
    title: "title",
    children: [entry],
  },
  entry,
];

expectTypeOf(ProseMirrorDropDown["_renderMenu"](entries)).toBeString();
expectTypeOf(ProseMirrorDropDown["_renderMenuItem"](entry)).toBeString();

new ProseMirrorDropDown("title", entries);
new ProseMirrorDropDown("title", entries, {
  cssClass: "some-class",
  icon: `<i class="fa-solid fa-xmark"></i>`,
  menu: "format",
  weight: 100,
  onAction(event: MouseEvent) {
    console.warn(event);
  },
});
const pmdd = new ProseMirrorDropDown("title", entries, {
  cssClass: undefined,
  icon: undefined,
  menu: undefined,
  onAction: undefined,
  weight: undefined,
});

expectTypeOf(pmdd.title).toBeString();
expectTypeOf(pmdd.items).toEqualTypeOf<ProseMirrorDropDown.Entry[]>();
expectTypeOf(pmdd.menu).toEqualTypeOf<string | undefined>();
expectTypeOf(pmdd.weight).toEqualTypeOf<number | undefined>();

declare const html: HTMLMenuElement;
expectTypeOf(pmdd.activateListeners(html)).toEqualTypeOf<void>();

expectTypeOf(pmdd.render()).toEqualTypeOf<string>();
expectTypeOf(pmdd.forEachItem((entry: ProseMirrorDropDown.Entry) => entry.action.length > 3)).toEqualTypeOf<void>();
expectTypeOf(pmdd.forEachItem(() => {})).toEqualTypeOf<void>();
