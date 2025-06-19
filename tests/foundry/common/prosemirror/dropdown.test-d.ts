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
  onAction(event: MouseEvent) {
    console.warn(event);
  },
});
const pmdd = new ProseMirrorDropDown("title", entries, {
  cssClass: undefined,
  icon: undefined,
  onAction: undefined,
});

expectTypeOf(pmdd.title).toBeString();
expectTypeOf(pmdd.items).toEqualTypeOf<ProseMirrorDropDown.Entry[]>();

declare const html: HTMLMenuElement;
expectTypeOf(pmdd.activateListeners(html)).toEqualTypeOf<void>();

expectTypeOf(pmdd.render()).toEqualTypeOf<string>();
expectTypeOf(pmdd.forEachItem((entry: ProseMirrorDropDown.Entry) => entry.action.length > 3)).toEqualTypeOf<void>();
