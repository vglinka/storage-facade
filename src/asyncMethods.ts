// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { type Base } from './Base';
import { type StorageInterface } from './StorageInterface';
import {
  openMethod,
  clearMethod,
  sizeMethod,
  keyMethod,
  iterAsyncMethod,
  addDefaultMethod,
  getDefaultMethod,
  setDefaultMethod,
  clearDefaultMethod,
} from './const';

export const asyncMethods = <T extends StorageInterface>(
  self: Base<T>
): PropertyDescriptorMap & ThisType<unknown> => {
  return {
    // Storage
    [openMethod]: {
      configurable: false,
      get(): () => Promise<unknown> {
        return async () => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          return base.init;
        };
      },
    },

    [clearMethod]: {
      configurable: false,
      get(): () => Promise<unknown> {
        return async () => {
          const { storageInterface } = Object.getPrototypeOf(self) as Base<T>;
          return storageInterface.clearAsync();
        };
      },
    },

    [sizeMethod]: {
      configurable: false,
      get(): () => Promise<number | Error> {
        return async () => {
          const { storageInterface } = Object.getPrototypeOf(self) as Base<T>;
          return storageInterface.sizeAsync();
        };
      },
    },

    [keyMethod]: {
      configurable: false,
      get(): (index: number) => Promise<string | Error> {
        return async (index: number) => {
          const { storageInterface } = Object.getPrototypeOf(self) as Base<T>;
          return storageInterface.keyAsync(index);
        };
      },
    },

    [iterAsyncMethod]: {
      configurable: false,
      get(): () => Promise<Array<Promise<[string, unknown]>>> {
        return async () => {
          const { storageInterface } = Object.getPrototypeOf(self) as Base<T>;
          const size = await storageInterface.sizeAsync();
          return Array(size)
            .fill(undefined)
            .map(async (_, index) => {
              const key = await storageInterface.keyAsync(index);
              const value = await storageInterface.getItemAsync(key);
              return [key, value];
            }) as Array<Promise<[string, unknown]>>;
        };
      },
    },

    // Default
    [addDefaultMethod]: {
      configurable: false,
      get(): (obj: Record<string, unknown>) => void {
        return (obj: Record<string, unknown>) => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          base.default = { ...base.default, ...structuredClone(obj) };
        };
      },
    },

    [getDefaultMethod]: {
      configurable: false,
      get(): () => Record<string, unknown> {
        return () => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          return structuredClone(base.default);
        };
      },
    },

    [setDefaultMethod]: {
      configurable: false,
      get(): (obj: Record<string, unknown>) => void {
        return (obj: Record<string, unknown>) => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          base.default = structuredClone(obj);
        };
      },
    },

    [clearDefaultMethod]: {
      configurable: false,
      get(): () => void {
        return () => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          base.default = Object.create(null) as Record<string, unknown>;
        };
      },
    },
  };
};
