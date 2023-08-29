// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

/* eslint-disable no-param-reassign */

import { type StorageInterface } from './StorageInterface';
import { type Base } from './Base';

export const syncInnerHandler: Record<string, unknown> = {
  set<T extends StorageInterface>(targetObj: Base<T>, propName: string, value: unknown) {
    if (!targetObj.initialized) {
      if (targetObj.init instanceof Error) throw targetObj.init;
      else targetObj.initialized = true;
    }

    // Write to the storage
    targetObj.storageInterface.setItemSync(propName, value);

    return true;
  },

  get<T extends StorageInterface>(targetObj: Base<T>, propName: string): unknown {
    if (!targetObj.initialized) {
      if (targetObj.init instanceof Error) throw targetObj.init;
      else targetObj.initialized = true;
    }

    // load from the storage
    let value = targetObj.storageInterface.getItemSync(propName);

    // if no value, then load default value
    if (value === undefined) value = targetObj.default[propName];
    return value;
  },

  deleteProperty<T extends StorageInterface>(targetObj: Base<T>, propName: string) {
    if (!targetObj.initialized) {
      if (targetObj.init instanceof Error) throw targetObj.init;
      else targetObj.initialized = true;
    }

    targetObj.storageInterface.removeItemSync(propName);
    return true;
  },

  getPrototypeOf<T extends StorageInterface>(targetObj: Base<T>) {
    return targetObj;
  },
};
