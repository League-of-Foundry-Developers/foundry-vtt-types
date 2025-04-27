/**
 * @remarks TODO: Stub
 */
declare class AVSettings {
  constructor();
}

declare namespace AVSettings {
  interface Data {
    /**
     * Whether this user has muted themselves.
     * @remarks non-nullish due to use of `in`
     */
    muted?: boolean;

    /**
     * Whether this user has hidden their video.
     * @remarks non-nullish due to use of `in`
     */
    hidden?: boolean;

    /**
     * Whether the user is broadcasting audio.
     * @remarks non-nullish due to use of `in`
     */
    speaking?: boolean;
  }
}

export default AVSettings;
