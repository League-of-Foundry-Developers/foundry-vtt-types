declare module 'mini-signals' {
  namespace MiniSignal {
    interface MiniSignalBinding {
      detach(): boolean;
    }
  }

  class MiniSignal {
    constructor();
    handlers(exists?: boolean): MiniSignal.MiniSignalBinding[] | boolean;
    has(node: MiniSignal.MiniSignalBinding): boolean;
    dispatch(...args: any[]): boolean;
    add(fn: Function, thisArg?: any): MiniSignal.MiniSignalBinding;
    once(fn: Function, thisArg?: any): MiniSignal.MiniSignalBinding;
    detach(node: MiniSignal.MiniSignalBinding): MiniSignal;
    detachAll(): MiniSignal;
  }
}
