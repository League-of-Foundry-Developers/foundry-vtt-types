import type { Identity } from "#utils";

// TODO: whole class
declare class DoorMesh extends PrimarySpriteMesh {}

declare namespace DoorMesh {
  interface Any extends AnyDoorMesh {}
  interface AnyConstructor extends Identity<typeof AnyDoorMesh> {}
}

export default DoorMesh;

declare abstract class AnyDoorMesh {
  constructor(...args: never);
}
