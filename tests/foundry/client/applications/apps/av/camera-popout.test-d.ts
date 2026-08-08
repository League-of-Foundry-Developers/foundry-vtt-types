import { expectTypeOf } from "vitest";

import CameraPopout = foundry.applications.apps.av.CameraPopout;

declare const user: User.Stored;

const cameraPopout = new CameraPopout({ user });

// @ts-expect-error - `user` is required.
new CameraPopout({});

expectTypeOf(CameraPopout.DEFAULT_OPTIONS).toEqualTypeOf<CameraPopout.DefaultOptions>();
expectTypeOf(cameraPopout.user).toEqualTypeOf<User.Stored>();
expectTypeOf(cameraPopout.options.user).toEqualTypeOf<User.Stored>();

// The popout's context is the dock's per-user context plus the base render context.
declare const context: CameraPopout.RenderContext;
expectTypeOf(context.rootId).toBeString();
expectTypeOf(context.user).toEqualTypeOf<User.Stored>();
expectTypeOf(context.controls).toEqualTypeOf<Record<string, foundry.applications.apps.av.CameraViews.ControlContext>>();
