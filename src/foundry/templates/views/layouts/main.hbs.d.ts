declare global {
  const SIGNED_EULA: boolean;

  const ROUTE_PREFIX: string;

  const MESSAGES:
    | { type: Notifications.Notification['type']; message: string; options: Notifications.NotifyOptions }[]
    | null;
}

export {};
