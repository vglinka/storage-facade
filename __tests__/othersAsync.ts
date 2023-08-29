// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { ErrorOnInit } from '../mock/errorOnInit';
import { createStorage } from '../src/index';
import { ErrorOnRead } from '../mock/errorOnRead';
import { ErrorOnWrite } from '../mock/errorOnWrite';

it('Async: error on init', async () => {
  const storage = createStorage({
    use: new ErrorOnInit(), // error
  });

  expect.assertions(1);
  try {
    await storage.value;
  } catch (e) {
    expect((e as Error).message).toMatch('Error on init');
  }
});

it('Async: error on read', async () => {
  const storage = createStorage({
    use: new ErrorOnRead(),
  });

  expect.assertions(1);
  try {
    await storage.value;
  } catch (e) {
    expect((e as Error).message).toMatch('Error on read');
  }
});

it('Async: error on write', async () => {
  const storage = createStorage({
    use: new ErrorOnWrite(),
  });

  expect.assertions(1);
  try {
    storage.value = 42;
    await storage.value;
  } catch (e) {
    expect((e as Error).message).toMatch('Error on write');
  }
});
