// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

/* eslint-disable prettier/prettier */

import { type Ok } from './StorageInterface';
import {
  type clearMethod,
  type sizeMethod,
  type keyMethod,
  type iterAsyncMethod,
  type iterSyncMethod,
  type addDefaultMethod,
  type getDefaultMethod,
  type setDefaultMethod,
  type clearDefaultMethod,
  type deleteStorageMethod,
} from './const';

export interface StorageFacade {
  [key: string]: unknown;
  // Storage methods
  [clearMethod]: () => Promise<Error | Ok> | unknown;
  [sizeMethod]: () => Promise<Error | number> | number;
  [keyMethod]: (index: number) => Promise<Error | string | undefined> | string | undefined;
  [iterAsyncMethod]: () => Promise<Array<Promise<[string, unknown]>>>;
  [iterSyncMethod]: () => Array<[string, unknown]>;
  [deleteStorageMethod]: () => Promise<Error | Ok> | unknown;
  // '...Default' methods
  [addDefaultMethod]: (obj: Record<string, unknown>) => void;
  [getDefaultMethod]: () => Record<string, unknown>;
  [setDefaultMethod]: (obj: Record<string, unknown>) => void;
  [clearDefaultMethod]: () => void;
}
