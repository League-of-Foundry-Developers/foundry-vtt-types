import fs from "fs/promises";

// Will not throw an error if the folder already exists because `recursive: true`.
await fs.mkdir("tests/node_modules/@types/fvtt-types", { recursive: true });

try {
  await fs.symlink("tests/node_modules/@types/fvtt-types", "../../../", "dir");
} catch (e) {
  if (e.code === "EEXIST") {
    console.error(e);
  }
}
