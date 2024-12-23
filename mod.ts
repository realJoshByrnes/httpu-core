import dgram from 'node:dgram';

export default class HttpuCore {
  readonly method: string;
  readonly #url: URL;
  body: string | undefined;

  readonly headers: Headers;

  constructor(url: string | URL, method: string = "NOTIFY") {
    this.#url = new URL(url);
    if (this.#url.protocol !== "httpu:"
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

  protected get _defaultPath(): string {
    return '/';
  }

  send() {
    const port = (this.#url.port !== "") ? +this.#url.port : 1900;
    const client = dgram.createSocket('udp4');
    client.bind(0, () => {
      client.setBroadcast(true);
      client.send(this.toString(), port, this.#url.hostname, (err) => {
        if (err) {
          console.error(err);
        }
        client.close();
      });
    });
  }

  toString(): string {
    const pathname = (this.#url.pathname !== "") ? this.#url.pathname : this._defaultPath;
    const headers = [...this.headers.entries()].map(([key, value]) => `${key.toUpperCase()}: ${value}`).join('\r\n');
    const body = (typeof this.body !== 'undefined') ? this.body : '';
    return `${this.method} ${pathname} HTTP/1.1\r\n${headers}\r\n${body}`;
  }
}
