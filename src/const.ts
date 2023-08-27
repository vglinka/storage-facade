// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

export const defaultStorageName = 'storage';
export const defaultAsyncMode = true;

// Storage method names
export const openMethod = 'open';
export const clearMethod = 'clear';
export const sizeMethod = 'size';
export const keyMethod = 'key';
export const iterAsyncMethod = 'getEntries';
export const iterSyncMethod = 'entries';
export const deleteStorageMethod = 'delete';

// '...Default' method names
export const addDefaultMethod = 'addDefault';
export const setDefaultMethod = 'setDefault';
export const getDefaultMethod = 'getDefault';
export const clearDefaultMethod = 'clearDefault';

export const bannedKeys: Record<string, string> = {
  [openMethod]: openMethod,
  [clearMethod]: clearMethod,
  [sizeMethod]: sizeMethod,
  [keyMethod]: keyMethod,
  [iterAsyncMethod]: iterAsyncMethod,
  [iterSyncMethod]: iterSyncMethod,
  [addDefaultMethod]: addDefaultMethod,
  [setDefaultMethod]: setDefaultMethod,
  [getDefaultMethod]: getDefaultMethod,
  [clearDefaultMethod]: clearDefaultMethod,
  [deleteStorageMethod]: deleteStorageMethod,
};

export const keyIsNotBanned = (key: string): boolean => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (!bannedKeys[key]) return true;
  return false;
};
