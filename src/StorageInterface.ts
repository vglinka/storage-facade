// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

/* eslint-disable @typescript-eslint/no-unused-vars */

export interface Setup<T extends StorageInterface> {
  use: T;
  name?: string;
  asyncMode?: boolean;
  [prop: string]: unknown;
}

export abstract class StorageInterface {
  abstract interfaceName: string;

  abstract storageName: string;

  interfaceError(problem: string): Error {
    const msg = `storage-facade: StorageInterface '${this.interfaceName}': ${problem}`;
    return new Error(msg);
  }

  notImplementedError(methodName: string): Error {
    return this.interfaceError(`'${methodName}' is not implemented!`);
  }

  // Async
  async initAsync<T extends StorageInterface>(
    setup: Setup<T>
  ): Promise<Error | undefined> {
    return Promise.reject(this.notImplementedError('initAsync'));
  }

  async getItemAsync(key: string): Promise<Error | unknown> {
    throw this.notImplementedError('getItemAsync');
  }

  async setItemAsync(key: string, value: unknown): Promise<Error | undefined> {
    throw this.notImplementedError('setItemAsync');
  }

  async removeItemAsync(key: string): Promise<Error | undefined> {
    throw this.notImplementedError('removeItemAsync');
  }

  async clearAsync(): Promise<Error | undefined> {
    throw this.notImplementedError('clearAsync');
  }

  async sizeAsync(): Promise<Error | number> {
    throw this.notImplementedError('sizeAsync');
  }

  async keyAsync(index: number): Promise<Error | string | undefined> {
    throw this.notImplementedError('keyAsync');
  }

  // Sync
  initSync<T extends StorageInterface>(setup: Setup<T>): Error | undefined {
    return this.notImplementedError('initSync');
  }

  getItemSync(key: string): unknown {
    throw this.notImplementedError('getItemSync');
  }

  setItemSync(key: string, value: unknown): void {
    throw this.notImplementedError('setItemSync');
  }

  removeItemSync(key: string): void {
    throw this.notImplementedError('removeItemSync');
  }

  clearSync(): void {
    throw this.notImplementedError('clearSync');
  }

  sizeSync(): number {
    throw this.notImplementedError('sizeSync');
  }

  keySync(index: number): string {
    throw this.notImplementedError('keySync');
  }
}
