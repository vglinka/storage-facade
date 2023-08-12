// Copyright (c) 2023-present Vadim Glinka
//
// Licensed under the Apache License, Version 2.0 <LICENSE-APACHE or
// http://www.apache.org/licenses/LICENSE-2.0> or the MIT license
// <LICENSE-MIT or http://opensource.org/licenses/MIT>, at your
// option.

import { ErrorOnRead } from '../mock/errorOnRead';
import { ErrorOnInit } from '../mock/errorOnInit';
import { MockInterface, getMockStorage } from '../mock/mockInterface';
import { createStorage } from '../src/index';
import { ErrorOnWrite } from '../mock/errorOnWrite';

it('Sync: read/write', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.value = { c: [40, 42] };
  expect(storage.value).toEqual({ c: [40, 42] });

  expect(getMockStorage(storage).get('value')).toEqual({ c: [40, 42] });
});

it('Sync: addDefault', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 9 });
  storage.addDefault({ value: 1, value2: 2 });
  expect(storage.value).toEqual(1);
  expect(storage.value2).toEqual(2);

  storage.value = 42;
  expect(storage.value).toEqual(42);

  storage.value = undefined;
  expect(storage.value).toEqual(1);

  storage.value = null;
  expect(storage.value).toEqual(null);
});

it('Sync: getDefault', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 2, other: 7 });

  expect(storage.getDefault()).toEqual({ value: 2, other: 7 });
});

it('Sync: setDefault', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 2, other: 7 });

  // Replace 'default'
  storage.setDefault({ value: 42 });

  expect(storage.value).toEqual(42);
  expect(storage.other).toEqual(undefined);
});

it('Sync: clearDefault', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 2, other: 7 });

  storage.clearDefault();

  expect(storage.value).toEqual(undefined);
  expect(storage.other).toEqual(undefined);
});

it('Sync: delete key', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 2 });
  storage.value = 4;
  delete storage.value;

  expect(storage.value).toEqual(2);
  expect(getMockStorage(storage).get('value')).toEqual(undefined);

  storage.newKey = 3;
  delete storage.newKey;
  delete storage.newKey;

  expect(storage.newKey).toEqual(undefined);
  expect(getMockStorage(storage).get('newKey')).toEqual(undefined);
});

it('Sync: clear storage', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 2 });
  storage.value = 4;

  expect(getMockStorage(storage).get('value')).toEqual(4);

  storage.clear();
  storage.clearDefault();

  expect(storage.value).toEqual(undefined);

  expect(getMockStorage(storage).get('value')).toEqual(undefined);
});

it('Sync: size', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 2 });
  storage.value = 4;
  storage.other = 3;

  expect(getMockStorage(storage).size).toEqual(2);
  expect(storage.size()).toEqual(2);
});

it('Sync: key', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 2 });
  storage.value = 4;

  expect(Array.from(getMockStorage(storage))[0][0]).toEqual('value');
  expect(storage.key(0)).toEqual('value');
});

it('Sync: iter', () => {
  const storage = createStorage({
    use: new MockInterface(),
    asyncMode: false,
  });

  storage.addDefault({ value: 2 });
  storage.value = 4;
  storage.other = 5;

  const array = storage //
    .entries()
    .map(([key, value]) => {
      return [key, value];
    });

  expect(array).toEqual([
    ['value', 4],
    ['other', 5],
  ]);
});

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
