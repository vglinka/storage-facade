// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { Base } from './Base';
import { type StorageFacade } from './StorageFacade';
import { StorageInterface, type Setup, Ok } from './StorageInterface';
import { createStorage } from './createStorage';

export * from './const';
export { createStorage, type StorageFacade, Base, StorageInterface, type Setup, Ok };
