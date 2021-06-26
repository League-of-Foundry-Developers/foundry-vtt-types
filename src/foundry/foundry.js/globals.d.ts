/**
 * A "secret" global to help debug attributes of the currently controlled Token.
 * This is only for debugging, and may be removed in the future, so it's not safe to use.
 */
declare let _token: InstanceType<CONFIG['Token']['objectClass']> | null;
