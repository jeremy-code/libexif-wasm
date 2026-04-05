import { onTestFinished } from "vitest";

const withDisposable = <T extends Disposable>(initializer: T | (() => T)) => {
  const disposable =
    typeof initializer === "function" ? initializer() : initializer;

  onTestFinished(() => disposable[Symbol.dispose]());

  return disposable;
};

export { withDisposable };
