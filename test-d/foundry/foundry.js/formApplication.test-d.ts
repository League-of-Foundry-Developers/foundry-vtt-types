import { expectAssignable, expectType } from 'tsd';

const app = new (class extends FormApplication<FormApplication.Options, FormApplication.Data<{ foo: string }>> {
  protected _updateObject(): Promise<unknown> {
    return Promise.resolve(undefined);
  }
})({ foo: 'bar' });

expectAssignable<Application>(app);
expectType<boolean>(app.isEditable);
expectType<{ foo: string }>(app.object);
expectType<FormApplication.Data<{ foo: string }> | Promise<FormApplication.Data<{ foo: string }>>>(app.getData());
