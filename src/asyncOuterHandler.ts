// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { type StorageFacade } from './StorageFacade';

export const asyncOuterHandler = {
  deleteProperty(targetObj: StorageFacade, propName: string): boolean {
    const obj = Object.getPrototypeOf(targetObj) as Record<string | symbol, unknown>;
    // delegate to inner proxy
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete obj[propName];
    return true;
  },
};
