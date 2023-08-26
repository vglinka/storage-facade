// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { type StorageInterface, type Setup, type Ok } from './StorageInterface';
import { defaultAsyncMode } from './const';

export class Base<T extends StorageInterface> {
  storageInterface: T;

  asyncMode: boolean;

  init: Promise<Error | Ok> | (Error | Ok);

  default: Record<string, unknown>;

  // Optimization
  initialized = false;

  operationResults = new Map<string, Promise<unknown>>();

  [prop: string]: unknown;

  constructor(setup: Setup<T>) {
    this.asyncMode = setup.asyncMode ?? defaultAsyncMode;
    this.storageInterface = setup.use;
    this.default = Object.create(null) as Record<string, unknown>;

    if (this.asyncMode) {
      this.init = this.storageInterface.initAsync(setup);
    } else {
      this.init = this.storageInterface.initSync(setup);
    }
  }
}
