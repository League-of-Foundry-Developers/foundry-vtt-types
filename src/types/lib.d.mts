export {};

declare global {
  namespace AudioNode {
    type Any = AnyAudioNode;
    type AnyConstructor = typeof AnyAudioNode;
  }
}

declare abstract class AnyAudioNode extends AudioNode {
  constructor(arg0: never, ...args: never[]);
}
