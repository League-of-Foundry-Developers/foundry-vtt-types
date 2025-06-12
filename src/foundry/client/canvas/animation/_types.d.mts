import type { CanvasAnimation } from "./_module.mjs";

/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

export {};

type CanvasAnimationAttribute = CanvasAnimation.Attribute;

type CanvasAnimationEasingFunction = CanvasAnimation.EasingFunction;

type CanvasAnimationOptions = CanvasAnimation.AnimateOptions;

type CanvasAnimationData = CanvasAnimation.AnimationData;
