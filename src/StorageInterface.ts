// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

/* eslint-disable
    @typescript-eslint/no-unused-vars,
    max-classes-per-file
*/

export interface Setup<T extends StorageInterface> {
  use: T;
  name?: string;
  asyncMode?: boolean;
  [prop: string]: unknown;
}

/**
 * This is necessary so that the user receives a type error
 * when trying to use the value of the result of the operation,
 * which he forgot "await"
 *
 * storage.value = 42;
 *
 * await storage.value; // The user may have forgotten this line
 *
 * In this case, the user will later receive not the value, but the result of the operation.
 */
export class Ok {
  msg = 'storage-fasade: result of the operation: OK' as const;
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
  async initAsync<T extends StorageInterface>(setup: Setup<T>): Promise<Error | Ok> {
    return Promise.reject(this.notImplementedError('initAsync'));
  }

  async getItemAsync(key: string): Promise<Error | unknown> {
    throw this.notImplementedError('getItemAsync');
  }

  async setItemAsync(key: string, value: unknown): Promise<Error | Ok> {
    throw this.notImplementedError('setItemAsync');
  }

  async removeItemAsync(key: string): Promise<Error | Ok> {
    throw this.notImplementedError('removeItemAsync');
  }

  async clearAsync(): Promise<Error | Ok> {
    throw this.notImplementedError('clearAsync');
  }

  async sizeAsync(): Promise<Error | number> {
    throw this.notImplementedError('sizeAsync');
  }

  async keyAsync(index: number): Promise<Error | string | undefined> {
    throw this.notImplementedError('keyAsync');
  }

  // Sync
  initSync<T extends StorageInterface>(setup: Setup<T>): Error | Ok {
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
