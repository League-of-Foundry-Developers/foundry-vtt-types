import type ApplicationV2 from "./api/application.d.mts";

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. The names Foundry has chosen
// also overlaps with other existing names. For example `ApplicationConfiguration`
// is also a class in `src/foundry/common/config.d.mts`. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

type ApplicationConfiguration = ApplicationV2.Configuration;

type ApplicationFormConfiguration = ApplicationV2.FormConfiguration;

type ApplicationHeaderControlsEntry = ApplicationV2.HeaderControlsEntry;

type ApplicationConstructorParams = ApplicationV2.ConstructorParams;

type ApplicationRenderOptions = ApplicationV2.RenderOptions;

type ApplicationWindowRenderOptions = ApplicationV2.WindowRenderOptions;

type ApplicationClosingOptions = ApplicationV2.ClosingOptions;

type ApplicationClickAction = ApplicationV2.ClickAction;

type ApplicationFormSubmission = ApplicationV2.FormSubmission;

type ApplicationTab = ApplicationV2.Tab;

type FormNode = ApplicationV2.FormNode;

type FormFooterButton = ApplicationV2.FormFooterButton;
