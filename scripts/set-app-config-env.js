const dotenv = require("dotenv");

const { version } = require("../package.json");

function setAppConfigEnv() {
  const ENV = process.env.STAGE ?? "production";
  const IS_EAS_CI = process.env.EAS_BUILD === "true";

  if (IS_EAS_CI) {
    dotenv.config({ path: process.env.ENV_FILE_COMMON });
    dotenv.config({ path: process.env[`ENV_FILE_${ENV.toUpperCase()}`] });
  }
  else {
    dotenv.config({ path: ".env.common" });
    dotenv.config({ path: `.env.${ENV}` });
  }

  const APP_SCHEME = process.env.APP_SCHEME;
  if (!APP_SCHEME) throw new Error("APP_SCHEME is not defined");

  const NAKED_APP_HOST = process.env.NAKED_APP_HOST;
  if (!NAKED_APP_HOST) throw new Error("NAKED_APP_HOST is not defined");

  const APP_HOST = process.env.APP_HOST;
  if (!APP_HOST) throw new Error("APP_HOST is not defined");

  const NAKED_OIA_HOST = process.env.NAKED_OIA_HOST;
  if (!NAKED_OIA_HOST) throw new Error("NAKED_OIA_HOST is not defined");

  const OIA_HOST = process.env.OIA_HOST;
  if (!OIA_HOST) throw new Error("OIA_HOST is not defined");

  const envConfig = {
    development: {
      name: "xLog",
      nakedAppHost: NAKED_APP_HOST,
      appHost: APP_HOST,
      nakedOIAHost: NAKED_OIA_HOST,
      oiaHost: OIA_HOST,
      scheme: `${APP_SCHEME}.development`,
      icon: "./assets/icon.development.png",
      androidGoogleServicesFile: IS_EAS_CI
        ? process.env.ANDROID_GOOGLE_SERVICES_DEVELOPMENT
        : "./google-services.development.json",
      iosGoogleServicesFile: IS_EAS_CI
        ? process.env.IOS_GOOGLE_SERVICES_DEVELOPMENT
        : "./GoogleService-Info.development.plist",
    },
    test: {
      name: "xLog",
      nakedAppHost: NAKED_APP_HOST,
      appHost: APP_HOST,
      nakedOIAHost: NAKED_OIA_HOST,
      oiaHost: OIA_HOST,
      scheme: `${APP_SCHEME}.test`,
      icon: "./assets/icon.test.png",
      androidGoogleServicesFile: IS_EAS_CI
        ? process.env.ANDROID_GOOGLE_SERVICES_TEST
        : "./google-services.test.json",
      iosGoogleServicesFile: IS_EAS_CI
        ? process.env.IOS_GOOGLE_SERVICES_TEST
        : "./GoogleService-Info.test.plist",
    },
    production: {
      name: "xLog",
      nakedAppHost: NAKED_APP_HOST,
      appHost: APP_HOST,
      nakedOIAHost: NAKED_OIA_HOST,
      oiaHost: OIA_HOST,
      scheme: APP_SCHEME,
      icon: "./assets/icon.png",
      androidGoogleServicesFile: IS_EAS_CI
        ? process.env.ANDROID_GOOGLE_SERVICES_PRODUCTION
        : "./google-services.production.json",
      iosGoogleServicesFile: IS_EAS_CI
        ? process.env.IOS_GOOGLE_SERVICES_PRODUCTION
        : "./GoogleService-Info.production.plist",
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

  if (process.env.USING_GOOGLE_SERVICES !== "true") {
    delete envConfig[ENV].androidGoogleServicesFile;
    delete envConfig[ENV].iosGoogleServicesFile;
  }

  return {
    version,
    appConfig: envConfig[ENV],
    decreasedVersion: decrementVersion(version),
    environment: ENV,
    IS_DEV: ENV === "development",
    IS_TEST: ENV === "test",
    IS_PROD: ENV === "production",
  };
}

module.exports = setAppConfigEnv;
