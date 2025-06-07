export {};

declare global {
  namespace Hooks {
    interface ErrorCallbackParameters {
      "MyClass#myMethod": [location: "MyClass#myMethod", err: Error, data: { foo: number }];
    }
  }
}
