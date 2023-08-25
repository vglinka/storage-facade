/* eslint-disable
    @typescript-eslint/no-unused-vars,
    class-methods-use-this,
*/

import { StorageInterface, type Setup, defaultStorageName } from 'storage-facade';

// Helper interface and functions needed to simulate the delay
interface DelaySetup {
  resolve?: { data: unknown };
  reject?: { data: unknown };
  action?: () => void;
  delay?: number;
}

// Use to simulate random delay
const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Simulate delay
const wait = async (setup: DelaySetup): Promise<unknown> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const bothSet = setup.resolve !== undefined && setup.reject !== undefined;
      const bothNotSet = setup.resolve === undefined && setup.reject === undefined;
      if (bothSet || bothNotSet) throw Error(`'wait({...})': Use 'resolve' OR 'reject'!`);
      setup.action?.();
      if (setup.resolve !== undefined) resolve(setup.resolve.data);
      if (setup.reject !== undefined) reject(setup.reject.data);
    }, setup.delay ?? randomInRange(10, 100));
  });
};

/*

These `Setup` definitions have been copied here for clarity.
These are the settings that the user passes to `createStorage(setup: Setup<T>)`.

These settings will also be passed to the `initAsync/initSync`
methods of this interface (MockInterface).

  interface Setup<T extends StorageInterface> {
    use: T;
    name?: string;
    asyncMode?: boolean;
    [prop: string]: unknown;
  }

  In this particular case `T=MockInterface`.

*/

// Here is the implementation
export class MockInterface extends StorageInterface {
  // This will be used in error messages
  interfaceName = 'MockInterface';

  // We will set the real name in `initAsync/initSync`
  // using a user-provided or default name
  storageName = '';

  // Since it's just a mock, we'll just store the data in a `Map`
  storage = new Map<string, unknown>();

  // Async
  async initAsync<T extends StorageInterface>(
    setup: Setup<T>
  ): Promise<Error | undefined> {
    return wait({
      resolve: { data: undefined },
      action: () => {
        this.storageName = setup.name ?? defaultStorageName;
      },
    }) as Promise<Error | undefined>;
  }

  async getItemAsync(key: string): Promise<Error | unknown> {
    return wait({
      resolve: { data: structuredClone(this.storage.get(key)) },
    });
  }

  async setItemAsync(key: string, value: unknown): Promise<Error | undefined> {
    return wait({
      resolve: { data: undefined },
      action: () => {
        this.storage.set(key, structuredClone(value));
      },
    }) as Promise<Error | undefined>;
  }

  async removeItemAsync(key: string): Promise<Error | undefined> {
    return wait({
      resolve: { data: undefined },
      action: () => {
        this.storage.delete(key);
      },
    }) as Promise<Error | undefined>;
  }

  async clearAsync(): Promise<Error | undefined> {
    return wait({
      resolve: { data: undefined },
      action: () => {
        this.storage.clear();
      },
    }) as Promise<Error | undefined>;
  }

  async sizeAsync(): Promise<Error | number> {
    return wait({
      resolve: { data: this.storage.size },
    }) as Promise<number>;
  }

  async keyAsync(index: number): Promise<Error | string | undefined> {
    return wait({
      resolve: { data: Array.from(this.storage)[index][0] },
    }) as Promise<Error | string | undefined>;
  }

  // Sync
  initSync<T extends StorageInterface>(setup: Setup<T>): Error | undefined {
    this.storageName = setup.name ?? defaultStorageName;
    return undefined;
  }

  getItemSync(key: string): unknown {
    return structuredClone(this.storage.get(key));
  }

  setItemSync(key: string, value: unknown): void {
    this.storage.set(key, structuredClone(value));
  }

  removeItemSync(key: string): void {
    this.storage.delete(key);
  }

  clearSync(): void {
    this.storage.clear();
  }

  sizeSync(): number {
    return this.storage.size;
  }

  keySync(index: number): string {
    return Array.from(this.storage)[index][0];
  }
}
