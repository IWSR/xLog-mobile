import "react-native-url-polyfill/auto";
import "intl-pluralrules";
import "text-encoding-polyfill";
import "react-native-get-random-values";
import "@walletconnect/react-native-compat";
import "@ethersproject/shims";
import { Platform } from "react-native";
import { btoa, atob, toByteArray } from "react-native-quick-base64";

// https://github.com/expo/expo/issues/17270#issuecomment-1445149952
// Polyfill for expo-crypto until issue with react-native-get-random-values is solved
// Apply only with Expo SDK >= 48
import { getRandomValues as expoCryptoGetRandomValues } from "expo-crypto";

class Crypto {
  getRandomValues = expoCryptoGetRandomValues;
}

const webCrypto = typeof crypto !== "undefined" ? crypto : new Crypto();

(() => {
  if (typeof crypto === "undefined") {
    Object.defineProperty(window, "crypto", {
      configurable: true,
      enumerable: true,
      get: () => webCrypto,
    });
  }
})();

if (typeof BigInt === "undefined")
  global.BigInt = require("big-integer");

if (typeof __dirname === "undefined")
  global.__dirname = "/";

if (typeof __filename === "undefined")
  global.__filename = "";

if (typeof process === "undefined") {
  global.process = require("process");
}
else {
  const bProcess = require("process");
  for (const p in bProcess) {
    if (!(p in process))
      process[p] = bProcess[p];
  }
}

// https://github.com/GoogleChromeLabs/jsbi/issues/30
global.BigInt.prototype.toJSON = function () { return this.toString(); };

process.browser = false;

if (typeof Buffer === "undefined")
  global.Buffer = require("buffer").Buffer;

// eslint-disable-next-line no-undef
const isDev = typeof __DEV__ === "boolean" && __DEV__;
process.env.STAGE = isDev ? "development" : "production";
if (typeof localStorage !== "undefined")
  localStorage.debug = isDev ? "*" : "";

if (Platform.OS !== "web") {
  global.atob = atob;
  global.btoa = btoa;
  FileReader.prototype.readAsArrayBuffer = function (blob) {
    if (this.readyState === this.LOADING)
      throw new Error("InvalidStateError");

    this._setReadyState(this.LOADING);
    this._result = null;
    this._error = null;
    const fr = new FileReader();
    fr.onloadend = () => {
      this._result = toByteArray(fr.result.split(",").pop().trim());
      this._setReadyState(this.DONE);
    };
    fr.readAsDataURL(blob);
  };
}

// https://github.com/Crossbell-Box/crossbell-universe/blob/cd0cbaa1ed93e8fc8ff214b1af77b162e406ee2b/packages/react-account/src/apis/siwe.ts#L28
// Polyfill for window.location.host/origin
if (typeof window !== "undefined") {
  if (!window.location) {
    window.location = {};
  }
}
