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

expectTypeOf(notifications.notify("Hello world")).toEqualTypeOf<number>();
expectTypeOf(notifications.notify("Hello world", "info")).toEqualTypeOf<number>();
expectTypeOf(notifications.notify("Hello world", "warning")).toEqualTypeOf<number>();
expectTypeOf(notifications.notify("Hello world", "error")).toEqualTypeOf<number>();

// @ts-expect-error - "success" is not a valid notification type.
notifications.notify("Hello world", "success");

expectTypeOf(notifications.notify("Hello world", "error", { localize: true })).toEqualTypeOf<number>();
expectTypeOf(notifications.notify("Hello world", "error", { permanent: true })).toEqualTypeOf<number>();
expectTypeOf(notifications.notify("Hello world", "error", { console: false })).toEqualTypeOf<number>();

expectTypeOf(notifications.info("Hello world")).toEqualTypeOf<number>();
expectTypeOf(notifications.info("Hello world", { localize: true })).toEqualTypeOf<number>();
expectTypeOf(notifications.info("Hello world", { permanent: true })).toEqualTypeOf<number>();
expectTypeOf(notifications.info("Hello world", { console: false })).toEqualTypeOf<number>();

expectTypeOf(notifications.warn("Hello world")).toEqualTypeOf<number>();
expectTypeOf(notifications.warn("Hello world", { localize: true })).toEqualTypeOf<number>();
expectTypeOf(notifications.warn("Hello world", { permanent: true })).toEqualTypeOf<number>();
expectTypeOf(notifications.warn("Hello world", { console: false })).toEqualTypeOf<number>();

expectTypeOf(notifications.error("Hello world")).toEqualTypeOf<number>();
expectTypeOf(notifications.error("Hello world", { localize: true })).toEqualTypeOf<number>();
expectTypeOf(notifications.error("Hello world", { permanent: true })).toEqualTypeOf<number>();
expectTypeOf(notifications.error("Hello world", { console: false })).toEqualTypeOf<number>();
