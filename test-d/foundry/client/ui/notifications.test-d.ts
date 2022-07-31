import { expectError, expectType } from 'tsd';

const notifcations = new Notifications();
expectType<
  Array<{
    message: string;
    type: 'info' | 'warning' | 'error';
    timestamp: number;
    console: boolean;
    permanent: boolean;
  }>
>(notifcations.queue);
expectType<JQuery[]>(notifcations.active);

expectType<void>(notifcations.notify('Hello world'));
expectType<void>(notifcations.notify('Hello world', 'info'));
expectType<void>(notifcations.notify('Hello world', 'warning'));
expectType<void>(notifcations.notify('Hello world', 'error'));
expectError(notifcations.notify('Hello world', 'success'));
expectType<void>(notifcations.notify('Hello world', 'error', { localize: true }));
expectType<void>(notifcations.notify('Hello world', 'error', { permanent: true }));
expectType<void>(notifcations.notify('Hello world', 'error', { console: false }));

expectType<void>(notifcations.info('Hello world'));
expectType<void>(notifcations.info('Hello world', { localize: true }));
expectType<void>(notifcations.info('Hello world', { permanent: true }));
expectType<void>(notifcations.info('Hello world', { console: false }));

expectType<void>(notifcations.warn('Hello world'));
expectType<void>(notifcations.warn('Hello world', { localize: true }));
expectType<void>(notifcations.warn('Hello world', { permanent: true }));
expectType<void>(notifcations.warn('Hello world', { console: false }));

expectType<void>(notifcations.error('Hello world'));
expectType<void>(notifcations.error('Hello world', { localize: true }));
expectType<void>(notifcations.error('Hello world', { permanent: true }));
expectType<void>(notifcations.error('Hello world', { console: false }));
