// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { asyncInnerHandler } from './asyncInnerHandler';
import { syncInnerHandler } from './syncInnerHandler';
import { asyncMethods } from './asyncMethods';
import { syncMethods } from './syncMethods';
import { type StorageFacade } from './StorageFacade';
import { type Setup, type StorageInterface } from './StorageInterface';
import { Base } from './Base';
import { asyncOuterHandler } from './asyncOuterHandler';
import { syncOuterHandler } from './syncOuterHandler';

/*

  How it work:

  createStorage(Setup<T>) ->

    OuterProxy (
    |  <Object.create (
    |  |  <InnerProxy (
    |  |  |  <Base(Setup<T>)>
    |  |  |  +
    |  |  |  innerHandler>) // get/set/delete/getPrototypeOf
    |  |
    |  |  +
    |  |  methods>) // clear(), size(), addDefault(), etc...
    |
    |  +
    |  outerHandler) // delegate 'delete'

*/

export const createStorage = <T extends StorageInterface>(
  setup: Setup<T>
): StorageFacade => {
  const storageInterface = setup.use;
  const defaultAsyncMode = storageInterface.defaultAsyncMode();
  const asyncMode = setup.asyncMode ?? defaultAsyncMode;

  const innerHandler = asyncMode ? asyncInnerHandler : syncInnerHandler;
  const innerProxy = new Proxy(new Base(setup), innerHandler);

  const methods = asyncMode ? asyncMethods(innerProxy) : syncMethods(innerProxy);
  const storage = Object.create(innerProxy, methods) as StorageFacade;

  const outerHandler = asyncMode ? asyncOuterHandler : syncOuterHandler;
  const outerProxy = new Proxy(storage, outerHandler);

  return outerProxy;
};
