// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { type Base } from './Base';
import { type StorageInterface } from './StorageInterface';
import {
  clearMethod,
  sizeMethod,
  keyMethod,
  iterSyncMethod,
  addDefaultMethod,
  getDefaultMethod,
  setDefaultMethod,
  clearDefaultMethod,
  deleteStorageMethod,
} from './const';

export const syncMethods = <T extends StorageInterface>(
  self: Base<T>
): PropertyDescriptorMap & ThisType<unknown> => {
  return {
    // Storage
    [clearMethod]: {
      configurable: false,
      get(): () => void {
        return () => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          if (!base.initialized) {
            if (base.init instanceof Error) throw base.init;
            else base.initialized = true;
          }

          const { storageInterface } = base;
          storageInterface.clearSync();
        };
      },
    },

    [sizeMethod]: {
      configurable: false,
      get(): () => number {
        return () => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          if (!base.initialized) {
            if (base.init instanceof Error) throw base.init;
            else base.initialized = true;
          }

          const { storageInterface } = base;
          return storageInterface.sizeSync();
        };
      },
    },

    [keyMethod]: {
      configurable: false,
      get(): (index: number) => string | undefined {
        return (index: number) => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          if (!base.initialized) {
            if (base.init instanceof Error) throw base.init;
            else base.initialized = true;
          }

          const { storageInterface } = base;
          return storageInterface.keySync(index);
        };
      },
    },

    [iterSyncMethod]: {
      configurable: false,
      get(): () => Array<[string, unknown]> {
        return () => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          if (!base.initialized) {
            if (base.init instanceof Error) throw base.init;
            else base.initialized = true;
          }

          const { storageInterface } = base;
          const size = storageInterface.sizeSync();
          const result: Array<[string, unknown]> = [];
          if (size === 0) return result;
          let currentIndex = 0;
          let key: string | undefined;
          let value;
          while (currentIndex < size) {
            key = storageInterface.keySync(currentIndex);
            if (key !== undefined) {
              value = storageInterface.getItemSync(key);
              result.push([key, value] as [string, unknown]);
            }
            currentIndex += 1;
          }
          return result;
        };
      },
    },

    [deleteStorageMethod]: {
      configurable: false,
      get(): () => void {
        return () => {
          const base = Object.getPrototypeOf(self) as Base<T>;
          if (!base.initialized) {
            if (base.init instanceof Error) throw base.init;
            else base.initialized = true;
          }

          const { storageInterface } = base;
          storageInterface.deleteStorageSync();
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
