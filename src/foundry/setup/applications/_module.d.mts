// In Foundry itself this file contains re-exports of these other modules.
// Therefore it has a runtime effect and uses `.mjs` instead of `.d.mts`.
// While `.mts` could work, to avoid `import-x/no-unresolved` from erroring `.mjs` is used.

export { default as EULA } from "./eula.mjs";
export { default as JoinGameForm } from "./join-game-form.mjs";
export { default as SetupAuthenticationForm } from "./setup-authentication-form.mjs";
export { default as SetupMenu } from "./setup-menu.mjs";
export { default as SetupPackages } from "./setup-packages.mjs";
export { default as ShuttingDown } from "./shutting-down.mjs";
export { default as UserManagement } from "./user-management.mjs";
