/* eslint-disable @typescript-eslint/no-unused-vars */

// After seeing that none of these types add anything or are even exported a
// very reasonable question may be: Why on earth does this file exist?
//
// Well this is the file in which Foundry defines these types. We don't house
// them here because it has poor discoverability. It's also just nice to
// have as reference to keep us synced with the latest version of Foundry.

export {};

type RenderFlag = foundry.canvas.interaction.RenderFlag.Any;

type PingData = User.PingData;

type PingOptions = foundry.canvas.interaction.Ping.ConstructorOptions;

type PulsePingOptions = foundry.canvas.interaction.PulsePing.ConstructorOptions;
