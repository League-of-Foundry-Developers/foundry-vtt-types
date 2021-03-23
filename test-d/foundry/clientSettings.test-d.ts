import { expectError, expectType } from 'tsd';
import '../../index';

const clientSettings = new ClientSettings([]);

const combatSetting: Combat.PartialConfigSetting = {
  name: 'Combat Tracker Configuration',
  scope: 'world',
  config: false,
  default: {},
  type: Object,
  onChange: () => {
    return;
  }
};
clientSettings.register('core', Combat.CONFIG_SETTING, combatSetting);
clientSettings.set('core', Combat.CONFIG_SETTING, {});
clientSettings.set('core', Combat.CONFIG_SETTING, { resource: 'foo', skipDefeated: false });
expectType<Combat.ConfigValue>(clientSettings.get('core', 'combatTrackerConfig'));

declare global {
  namespace ClientSettings { // eslint-disable-line
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
