/**
 * @module httpu-core
 * This module provides the HttpuCore class for handling HTTPU requests.
 */

import dgram from 'node:dgram';

/**
 * HttpuCore class for handling HTTPU requests.
 */
export default class HttpuCore {
  /** @readonly */
  readonly method: string;
  /** @readonly @private */
  readonly #url: URL;
  /** @type {string | undefined} */
  body: string | undefined;

  /** @readonly */
  readonly headers: Headers;

  /**
   * Creates an instance of HttpuCore.
   * @param {string | URL} url - The URL for the request.
   * @param {string} [method="NOTIFY"] - The HTTP method for the request.
   * @throws {Error} If the URL is invalid.
   */
  constructor(url: string | URL, method: string = "NOTIFY") {
    this.#url = new URL(url);
    if (this.#url.protocol !== this._defaultProtocol
      || this.#url.username !== ""
      || this.#url.password !== ""
      || this.#url.search !== ""
      || this.#url.hash !== ""
    ) {
      throw new Error("Invalid URL");
    }

    this.method = method;

    this.headers = new Headers({
      "Host": this.#url.hostname
    });
  }

  /**
   * Gets the default path.
   * @protected
   * @returns {string} The default path.
   */
  protected get _defaultPath(): string {
    return '/';
  }

  /**
   * Gets the default protocol.
   * @protected
   * @returns {string} The default protocol.
   */
  protected get _defaultProtocol(): string {
    return 'httpu:';
  }
}