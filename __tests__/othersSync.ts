// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { ErrorOnRead } from '../mock/errorOnRead';
import { ErrorOnInit } from '../mock/errorOnInit';
import { createStorage } from '../src/index';
import { ErrorOnWrite } from '../mock/errorOnWrite';

it('Sync: error on init', () => {
  const storage = createStorage({
    use: new ErrorOnInit(), // error
    asyncMode: false,
  });

  expect.assertions(1);
  try {
    storage.value = 42;
  } catch (e) {
    expect((e as Error).message).toMatch('Error on init');
  }
});

it('Sync: error on read', () => {
  const storage = createStorage({
    use: new ErrorOnRead(),
    asyncMode: false,
  });

  expect.assertions(1);
  try {
    // @ts-expect-error: 'a' is declared but its value is never read.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const a = storage.value;
  } catch (e) {
    expect((e as Error).message).toMatch('Error on read');
  }
});

it('Sync: error on write', () => {
  const storage = createStorage({
    use: new ErrorOnWrite(),
    asyncMode: false,
  });

  expect.assertions(1);
  try {
    storage.value = 42;
  } catch (e) {
    expect((e as Error).message).toMatch('Error on write');
  }
});
