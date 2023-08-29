// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

/* eslint-disable
    class-methods-use-this,
    @typescript-eslint/no-unused-vars,
    import/no-extraneous-dependencies,
*/

import { MockInterface } from 'storage-facade-mockinterface';
import { type StorageInterface, type Setup, type Ok } from '../src/StorageInterface';

export class ErrorOnInit extends MockInterface {
  initSync<T extends StorageInterface>(setup: Setup<T>): Error | Ok {
    return Error('Error on init');
  }

  async initAsync<T extends StorageInterface>(setup: Setup<T>): Promise<Error | Ok> {
    return this.wait({
      reject: { data: Error('Error on init') },
    }) as Promise<Error | Ok>;
  }
}
