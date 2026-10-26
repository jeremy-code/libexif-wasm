import { free } from "../internal/stdlib.ts";

class DisposablePtr implements Disposable {
  constructor(public readonly byteOffset: number) {}

  [Symbol.dispose]() {
    free(this.byteOffset);
  }
}

export { DisposablePtr };
