export {};

declare module "fvtt-types/configuration" {
  namespace Hooks {
    interface HookConfig {
      fooBar: (baz: string, bar: number) => boolean;
    }
  }
}
