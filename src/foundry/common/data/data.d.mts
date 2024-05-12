import type { DataModel } from "../abstract/module.d.mts";
import type { fields } from "./module.d.mts";

export class LightData extends DataModel {}

export class ShapeData extends DataModel {}

export class TextureData extends fields.SchemaField {}

export class PrototypeToken extends DataModel {}

export class TombstoneData extends DataModel {}
