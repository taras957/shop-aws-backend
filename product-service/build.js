const fs = require("fs");
const path = require("path");
const util = require("util");

const copyFile = util.promisify(fs.copyFile);

const rootFolder = "./";
const distFolder = "./dist/";
const configFile = "serverless.yml";

async function copyConfigFile() {
  const sourcePath = path.join(rootFolder, configFile);
  const destinationPath = path.join(distFolder, configFile);

  try {
    const sourceFileExists = await fs.promises
      .access(sourcePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (sourceFileExists) {
      await copyFile(sourcePath, destinationPath);

      console.log(`Copied ${configFile} to ${distFolder}`);
    } else {
      console.error(`${configFile} not found in the root folder.`);
    }
  } catch (error) {
    console.error(`Error copying ${configFile}: ${error.message}`);
  }
}

copyConfigFile();
