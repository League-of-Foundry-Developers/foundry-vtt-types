import { expectType } from 'tsd';
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
