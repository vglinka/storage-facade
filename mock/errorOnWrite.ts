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

export class ErrorOnWrite extends MockInterface {
  async setItemAsync(key: string, value: unknown): Promise<undefined> {
    return wait({
      reject: { data: Error('Error on write') },
    }) as Promise<undefined>;
  }

  setItemSync(key: string, value: unknown): void {
    throw Error('Error on write');
  }
}
