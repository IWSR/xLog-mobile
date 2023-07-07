const fs = require("fs");
const { join } = require("path");

const dotenv = require("dotenv");

const { version } = require("../package.json");

function checkFileExists(path) {
  if (fs.existsSync(join(__dirname, "..", path))) {
    return path;
  }

  return undefined;
}

function setAppConfigEnv() {
  const ENV = process.env.NODE_ENV ?? "production";
  const IS_EAS_CI = process.env.EAS_BUILD === "true";

  if (IS_EAS_CI) {
    dotenv.config({ path: process.env.ENV_FILE_COMMON });
    dotenv.config({ path: process.env[`ENV_FILE_${ENV.toUpperCase()}`] });
  }
  else {
    dotenv.config({ path: ".env.common" });
    dotenv.config({ path: `.env.${ENV}` });
  }

  console.log("ENV:", ENV);

  const SCHEME = process.env.APP_SCHEME;
  const HOST = process.env.APP_HOST ?? "xlog.app";

  const envConfig = {
    development: {
      name: "xLog-dev",
      host: HOST,
      scheme: `${SCHEME}.development`,
      icon: "./assets/icon.development.png",
      androidGoogleServicesFile: IS_EAS_CI
        ? process.env.ANDROID_GOOGLE_SERVICES_DEVELOPMENT
        : checkFileExists("./google-services.development.json"),
      iosGoogleServicesFile: IS_EAS_CI
        ? process.env.IOS_GOOGLE_SERVICES_DEVELOPMENT
        : checkFileExists("./GoogleService-Info.development.plist"),
    },
    staging: {
      name: "xLog-preview",
      host: HOST,
      scheme: `${SCHEME}.staging`,
      icon: "./assets/icon.staging.png",
      androidGoogleServicesFile: IS_EAS_CI
        ? process.env.ANDROID_GOOGLE_SERVICES_STAGING
        : checkFileExists("./google-services.staging.json"),
      iosGoogleServicesFile: IS_EAS_CI
        ? process.env.IOS_GOOGLE_SERVICES_STAGING
        : checkFileExists("./GoogleService-Info.staging.plist"),
    },
    production: {
      name: "xLog",
      host: HOST,
      scheme: SCHEME,
      icon: "./assets/icon.png",
      androidGoogleServicesFile: IS_EAS_CI
        ? process.env.ANDROID_GOOGLE_SERVICES_PRODUCTION
        : checkFileExists("./google-services.production.json"),
      iosGoogleServicesFile: IS_EAS_CI
        ? process.env.IOS_GOOGLE_SERVICES_PRODUCTION
        : checkFileExists("./GoogleService-Info.production.plist"),
    },
  };

  /**
 * Ignoring patch version
 * @example 1.1.1 -> 1.1.0 / 4.2.1 -> 4.2.0
 * */
  function decrementVersion(version) {
    const parts = version.split(".");
    parts[parts.length - 1] = "0";
    return parts.join(".");
  }

  return {
    version,
    appConfig: envConfig[ENV],
    decreasedVersion: decrementVersion(version),
    environment: ENV,
    IS_DEV: ENV === "development",
    IS_STAGING: ENV === "staging",
    IS_PROD: ENV === "production",
  };
}

module.exports = setAppConfigEnv;
