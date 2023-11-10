import { expectTypeOf } from "vitest";

const notifications = new Notifications();
expectTypeOf(notifications.queue).toEqualTypeOf<
  Array<{
    message: string;
    type: "info" | "warning" | "error";
    timestamp: number;
    console: boolean;
    permanent: boolean;
  }>
>();
expectTypeOf(notifications.active).toEqualTypeOf<JQuery[]>();

expectTypeOf(notifications.notify("Hello world")).toEqualTypeOf<void>();
expectTypeOf(notifications.notify("Hello world", "info")).toEqualTypeOf<void>();
expectTypeOf(notifications.notify("Hello world", "warning")).toEqualTypeOf<void>();
expectTypeOf(notifications.notify("Hello world", "error")).toEqualTypeOf<void>();

// @ts-expect-error - "success" is not a valid notification type.
notifications.notify("Hello world", "success");

expectTypeOf(notifications.notify("Hello world", "error", { localize: true })).toEqualTypeOf<void>();
expectTypeOf(notifications.notify("Hello world", "error", { permanent: true })).toEqualTypeOf<void>();
expectTypeOf(notifications.notify("Hello world", "error", { console: false })).toEqualTypeOf<void>();

expectTypeOf(notifications.info("Hello world")).toEqualTypeOf<void>();
expectTypeOf(notifications.info("Hello world", { localize: true })).toEqualTypeOf<void>();
expectTypeOf(notifications.info("Hello world", { permanent: true })).toEqualTypeOf<void>();
expectTypeOf(notifications.info("Hello world", { console: false })).toEqualTypeOf<void>();

expectTypeOf(notifications.warn("Hello world")).toEqualTypeOf<void>();
expectTypeOf(notifications.warn("Hello world", { localize: true })).toEqualTypeOf<void>();
expectTypeOf(notifications.warn("Hello world", { permanent: true })).toEqualTypeOf<void>();
expectTypeOf(notifications.warn("Hello world", { console: false })).toEqualTypeOf<void>();

expectTypeOf(notifications.error("Hello world")).toEqualTypeOf<void>();
expectTypeOf(notifications.error("Hello world", { localize: true })).toEqualTypeOf<void>();
expectTypeOf(notifications.error("Hello world", { permanent: true })).toEqualTypeOf<void>();
expectTypeOf(notifications.error("Hello world", { console: false })).toEqualTypeOf<void>();
