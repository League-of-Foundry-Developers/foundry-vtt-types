import { expectType } from 'tsd';

expectType<Application.Options>(Application.defaultOptions);

const app = new Application();
expectType<string>(app.id);
expectType<JQuery>(app.element);
expectType<number>(app.appId);
expectType<boolean>(app.popOut);
expectType<string>(app.template);
expectType<string>(app.title);
expectType<boolean>(app.rendered);

expectType<void>(app.bringToTop());
expectType<object | Promise<object>>(app.getData());
expectType<Application.Options>(app.options);
expectType<Promise<void>>(app.close({ force: false }));
expectType<Promise<void>>(app.close());
expectType<unknown>(app.render());
expectType<unknown>(app.render(true));
