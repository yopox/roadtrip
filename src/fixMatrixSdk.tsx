import {Buffer} from "buffer";
import * as process from "process";

/**
 * Fix for matrix-js-sdk dependency.
 * See vite.config.js for the other fixes.
 */
export function applyMatrixSDKPolyfills() {
    (window as any).Buffer = Buffer;
    (window as any).process = process;
}