// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

/* eslint-disable
    class-methods-use-this,
    @typescript-eslint/no-unused-vars
*/

import { MockInterface, wait } from './mockInterface';
import { type StorageInterface, type Setup } from '../src/StorageInterface';

export class ErrorOnInit extends MockInterface {
  initSync<T extends StorageInterface>(setup: Setup<T>): Error | undefined {
    return Error('Error on init');
  }

  async initAsync<T extends StorageInterface>(
    setup: Setup<T>
  ): Promise<Error | undefined> {
    return wait({
      reject: { data: Error('Error on init') },
    }) as Promise<Error | undefined>;
  }
}
