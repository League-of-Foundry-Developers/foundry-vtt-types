// This is a regression test for the error:
// "'Item' is referenced directly or indirectly in its own type annotation."
// See https://gist.github.com/LukeAbby/f9561689e5cad8a4b1e9cb92a8c63982 for more information.

export {};

declare class CustomItem extends Item {}

declare global {
  interface DocumentClassConfig {
    Item: typeof CustomItem;
  }
}
