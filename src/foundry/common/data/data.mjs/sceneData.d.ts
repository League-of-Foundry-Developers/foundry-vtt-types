// TODO: This is just a stub that must be filled with live
import { PropertiesToSource } from '../../../../types/helperTypes';
import { DocumentData } from '../../abstract/module.mjs';
import { BaseScene } from '../../documents.mjs';

interface SceneDataProperties {
  _id: string | null;
}

interface SceneDataConstructorData {
  _id?: string | null;
}

export declare class SceneData extends DocumentData<
  any,
  SceneDataProperties,
  PropertiesToSource<SceneDataProperties>,
  SceneDataConstructorData,
  BaseScene
> {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export declare interface SceneData extends SceneDataProperties {}
