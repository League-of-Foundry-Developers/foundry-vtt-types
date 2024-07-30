// Open question - this is just types?

import type ApplicationV2 from "./api/application.d.mts";

export {};

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names. For example `ApplicationConfiguration`
// is also a class in `src/foundry/common/config.d.mts`. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

interface ApplicationConfiguration extends ApplicationV2.Configuration {}

interface ApplicationFormConfiguration extends ApplicationV2.FormConfiguration {}

interface ApplicationHeaderControlsEntry extends ApplicationV2.HeaderControlsEntry {}

interface ApplicationConstructorParams extends ApplicationV2.ConstructorParams {}

interface ApplicationRenderOptions extends ApplicationV2.RenderOptions {}

interface ApplicationWindowRenderOptions extends ApplicationV2.WindowRenderOptions {}

interface ApplicationClosingOptions extends ApplicationV2.ClosingOptions {}

interface ApplicationClickAction extends ApplicationV2.ClickAction {}

interface ApplicationFormSubmission extends ApplicationV2.FormSubmission {}

interface ApplicationTab extends ApplicationV2.Tab {}

interface FormNode extends ApplicationV2.FormNode {}

interface FormFooterButton extends ApplicationV2.FormFooterButton {}
