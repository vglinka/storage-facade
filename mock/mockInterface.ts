// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

/* eslint-disable
    @typescript-eslint/no-unused-vars,
    class-methods-use-this,
*/

import { Ok } from '../src/StorageInterface';
import {
  StorageInterface,
  type Setup,
  type StorageFacade,
  type Base,
  defaultStorageName,
} from '../src/index';

interface DelaySetup {
  resolve?: { data: unknown };
  reject?: { data: unknown };
  action?: () => void;
  delay?: number;
}

const randomInRange = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const wait = async (setup: DelaySetup): Promise<unknown> => {
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

export class MockInterface extends StorageInterface {
  interfaceName = 'MockInterface';

  storageName = '';

  storage = new Map<string, unknown>();

  // Async
  async initAsync<T extends StorageInterface>(setup: Setup<T>): Promise<Error | Ok> {
    return wait({
      action: () => {
        this.storageName = setup.name ?? defaultStorageName;
      },
      resolve: { data: new Ok() },
    }) as Promise<Error | Ok>;
  }

  async getItemAsync(key: string): Promise<Error | unknown> {
    return wait({
      resolve: { data: structuredClone(this.storage.get(key)) },
    });
  }

  async setItemAsync(key: string, value: unknown): Promise<Error | Ok> {
    return wait({
      action: () => {
        this.storage.set(key, structuredClone(value));
      },
      resolve: { data: new Ok() },
    }) as Promise<Ok>;
  }

  async removeItemAsync(key: string): Promise<Error | Ok> {
    return wait({
      action: () => {
        this.storage.delete(key);
      },
      resolve: { data: new Ok() },
    }) as Promise<Ok>;
  }

  async clearAsync(): Promise<Error | Ok> {
    return wait({
      action: () => {
        this.storage.clear();
      },
      resolve: { data: new Ok() },
    }) as Promise<Ok>;
  }

  async sizeAsync(): Promise<Error | number> {
    return wait({
      resolve: { data: this.storage.size },
    }) as Promise<number>;
  }

  async keyAsync(index: number): Promise<Error | string | undefined> {
    return wait({
      resolve: { data: Array.from(this.storage)[index]?.[0] },
    }) as Promise<string>;
  }

  async deleteStorageAsync(): Promise<Error | Ok> {
    return wait({
      action: () => {
        // There should be logic for deleting real storage
        this.storage.clear();
        // for tests
        this.storage.set('isDeleted', true);
      },
      resolve: { data: new Ok() },
    }) as Promise<Ok>;
  }

  // Sync
  initSync<T extends StorageInterface>(setup: Setup<T>): Error | Ok {
    this.storageName = setup.name ?? defaultStorageName;
    return new Ok();
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

  deleteStorageSync(): void {
    // There should be logic for deleting real storage
    this.storage.clear();
    // for tests
    this.storage.set('isDeleted', true);
  }
}

// For tests
export const getMockStorage = (storage: StorageFacade): Map<string, unknown> => {
  const base = Object.getPrototypeOf(
    Object.getPrototypeOf(storage)
  ) as Base<MockInterface>;
  return base.storageInterface.storage;
};

export const getBase = (storage: StorageFacade): Base<MockInterface> => {
  const base = Object.getPrototypeOf(
    Object.getPrototypeOf(storage)
  ) as Base<MockInterface>;
  return base;
};
