import { expectError, expectType } from 'tsd';
import '../../index';

const clientSettings = new ClientSettings([]);

declare global {
  // eslint-disable-next-line
  namespace ClientSettings {
    interface Values {
      'foo.bar': boolean;
    }
  }
}

expectError(
  clientSettings.register('foo', 'bar', {
    scope: 'world',
    type: String
  })
);
expectError(clientSettings.set('foo', 'bar', 'true'));

clientSettings.register('foo', 'bar', {
  scope: 'world',
  type: Boolean,
  config: true,
  default: true
});
clientSettings.set('foo', 'bar', false);
expectType<boolean>(clientSettings.get('foo', 'bar'));

expectType<unknown>(clientSettings.get('foo', 'baz'));

// core settings

expectType<{ resource: string; skipDefeated: boolean }>(clientSettings.get('core', 'combatTrackerConfig'));
expectType<Partial<Record<string, CompendiumCollection.Configuration>>>(
  clientSettings.get('core', 'compendiumConfiguration')
);
expectType<foundry.CONST.DiceRollMode>(clientSettings.get('core', 'rollMode'));
