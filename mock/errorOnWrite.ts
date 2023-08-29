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

import { type Ok } from 'src/StorageInterface';
import { MockInterface } from './index';

export class ErrorOnWrite extends MockInterface {
  async setItemAsync(key: string, value: unknown): Promise<Error | Ok> {
    return this.wait({
      reject: { data: Error('Error on write') },
    }) as Promise<Error | Ok>;
  }

  setItemSync(key: string, value: unknown): void {
    throw Error('Error on write');
  }
}
