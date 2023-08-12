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

export class ErrorOnRead extends MockInterface {
  async getItemAsync(key: string): Promise<unknown> {
    return wait({
      reject: { data: Error('Error on read') },
    }) as Promise<Error | undefined>;
  }

  getItemSync(key: string): unknown {
    throw Error('Error on read');
  }
}
