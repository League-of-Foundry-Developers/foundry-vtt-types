import type { Identity } from "fvtt-types/utils";

declare global {
  namespace AudioNode {
    interface Any extends AnyAudioNode {}
    interface AnyConstructor extends Identity<typeof AnyAudioNode> {}
  }
}

declare abstract class AnyAudioNode extends AudioNode {
  constructor(...args: never);
}
