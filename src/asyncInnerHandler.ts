// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

/* eslint-disable no-param-reassign */

import { type StorageInterface } from './StorageInterface';
import { type Base } from './Base';

export const asyncInnerHandler: Record<string, unknown> = {
  async set<T extends StorageInterface>(
    targetObj: Base<T>,
    propName: string,
    value: unknown
  ) {
    if (!targetObj.initialized) {
      await targetObj.init;
      targetObj.initialized = true;
    }

    // Write 'value' to the storage
    const promise = targetObj.storageInterface.setItemAsync(propName, value);
    // and promise with result to the Map
    targetObj.operationResults.set(propName, promise);

    return true;
  },

  async get<T extends StorageInterface>(
    targetObj: Base<T>,
    propName: string
  ): Promise<unknown> {
    if (!targetObj.initialized) {
      await targetObj.init;
      targetObj.initialized = true;
    }

    if (targetObj.operationResults.has(propName)) {
      const promise = targetObj.operationResults.get(propName);
      targetObj.operationResults.delete(propName);
      return promise;
    }

    // load from the storage
    let value = await targetObj.storageInterface.getItemAsync(propName);

    // if no value, then load default value
    if (value === undefined) value = targetObj.default[propName];

    return value;
  },

  deleteProperty<T extends StorageInterface>(targetObj: Base<T>, propName: string) {
    const promise = targetObj.storageInterface.removeItemAsync(propName);
    targetObj.operationResults.set(propName, promise);
    return true;
  },

  getPrototypeOf<T extends StorageInterface>(targetObj: Base<T>) {
    return targetObj;
  },
};
