// @ts-check

import fs from "fs/promises";

// Will not throw an error if the folder already exists because `recursive: true`.
await fs.mkdir("tests/node_modules/@types/fvtt-types", { recursive: true });

try {
  await fs.symlink("tests/node_modules/@types/fvtt-types", "../../../", "dir");
} catch (e) {
  if (e.code === "EEXIST") {
    // @types/node aren't installed and so `console` is not defined.
    // Installing such a large package just for lightweight install script seems silly though.
    // eslint-disable-next-line no-undef
    console.error(e);
  }
}
