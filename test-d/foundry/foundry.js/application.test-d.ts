import { expectType } from 'tsd';

expectType<ApplicationOptions>(Application.defaultOptions);

const app = new (class extends Application {})();
expectType<string>(app.id);
expectType<JQuery>(app.element);
expectType<number>(app.appId);
expectType<boolean>(app.popOut);
expectType<string>(app.template);
expectType<string>(app.title);
expectType<boolean>(app.rendered);

expectType<void>(app.bringToTop());
expectType<object | Promise<object>>(app.getData());
expectType<ApplicationOptions>(app.options);
expectType<Promise<void>>(app.close({ force: false }));
expectType<Promise<void>>(app.close());
expectType<unknown>(app.render());
expectType<unknown>(app.render(true));
