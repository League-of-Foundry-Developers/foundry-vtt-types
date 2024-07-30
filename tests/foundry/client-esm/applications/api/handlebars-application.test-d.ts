const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

// Regression test for "Class static side 'typeof EnabledCompendiumsSettings' incorrectly extends base class static side 'typeof HandlebarsApplication & typeof ApplicationV2'."
// Reported by @denwav, see https://discord.com/channels/732325252788387980/803646399014109205/1259600593714937978
export class EnabledCompendiumsSettings extends HandlebarsApplicationMixin(ApplicationV2) {}
