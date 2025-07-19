import { expectTypeOf } from "vitest";

import Notifications = foundry.applications.ui.Notifications;

const notifications = new foundry.applications.ui.Notifications();

expectTypeOf(notifications.notify("Hello world")).toEqualTypeOf<Readonly<Notifications.Notification<"info">>>();
expectTypeOf(notifications.notify("Hello world", "info")).toEqualTypeOf<Readonly<Notifications.Notification<"info">>>();
expectTypeOf(notifications.notify("Hello world", "warning")).toEqualTypeOf<
  Readonly<Notifications.Notification<"warning">>
>();
expectTypeOf(notifications.notify("Hello world", "error")).toEqualTypeOf<
  Readonly<Notifications.Notification<"error">>
>();

// @ts-expect-error "foobar" is not a valid notification type.
notifications.notify("Hello world", "foobar");

expectTypeOf(notifications.notify("Hello world", "error", { localize: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"error">>
>();
expectTypeOf(notifications.notify("Hello world", "error", { permanent: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"error">>
>();
expectTypeOf(notifications.notify("Hello world", "error", { console: false })).toEqualTypeOf<
  Readonly<Notifications.Notification<"error">>
>();

expectTypeOf(notifications.info("Hello world")).toEqualTypeOf<Readonly<Notifications.Notification<"info">>>();
expectTypeOf(notifications.info("Hello world", { localize: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"info">>
>();
expectTypeOf(notifications.info("Hello world", { permanent: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"info">>
>();
expectTypeOf(notifications.info("Hello world", { console: false })).toEqualTypeOf<
  Readonly<Notifications.Notification<"info">>
>();

expectTypeOf(notifications.warn("Hello world")).toEqualTypeOf<Readonly<Notifications.Notification<"warning">>>();
expectTypeOf(notifications.warn("Hello world", { localize: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"warning">>
>();
expectTypeOf(notifications.warn("Hello world", { permanent: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"warning">>
>();
expectTypeOf(notifications.warn("Hello world", { console: false })).toEqualTypeOf<
  Readonly<Notifications.Notification<"warning">>
>();

expectTypeOf(notifications.error("Hello world")).toEqualTypeOf<Readonly<Notifications.Notification<"error">>>();
expectTypeOf(notifications.error("Hello world", { localize: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"error">>
>();
expectTypeOf(notifications.error("Hello world", { permanent: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"error">>
>();
expectTypeOf(notifications.error("Hello world", { console: false })).toEqualTypeOf<
  Readonly<Notifications.Notification<"error">>
>();

expectTypeOf(notifications.success("Hello world")).toEqualTypeOf<Readonly<Notifications.Notification<"success">>>();
expectTypeOf(notifications.success("Hello world", { localize: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"success">>
>();
expectTypeOf(notifications.success("Hello world", { permanent: true })).toEqualTypeOf<
  Readonly<Notifications.Notification<"success">>
>();
expectTypeOf(notifications.success("Hello world", { console: false })).toEqualTypeOf<
  Readonly<Notifications.Notification<"success">>
>();

const myNotification = notifications.notify("Hello World");

// @ts-expect-error The returned object is meant to be read-only
myNotification.id = 5;

notifications.update(myNotification, { pct: 50 });
notifications.update(myNotification.id, { message: "Living on a Prayer" });

notifications.remove(myNotification);
notifications.remove(myNotification.id);
