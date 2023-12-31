# 🔥 Storage facade

A TypeScript library providing a lightweight storage facade.

A storage facade provides a single storage API that abstracts
over the actual storage implementation.

Library users can write an implementation of the synchronous
and/or asynchronous storage interface (localStorage / IndexedDB / ...)
extending the `StorageInterface` abstract class.

This library does not contain a specific implementation for any storage,
as it is a facade.

To create a specific implementation of the interface to any storage,
you should implement the methods of the abstract class:

Async methods

  - `initAsync<T extends StorageInterface>(setup: Setup<T>)`
  - `getItemAsync(key: string)`
  - `setItemAsync(key: string, value: unknown)`
  - `removeItemAsync(key: string)`
  - `clearAsync()`
  - `sizeAsync()`
  - `keyAsync(index: number)` - returns the name of the key by its index
  - `deleteStorageAsync()`

And/or Sync methods

  - `initSync<T extends StorageInterface>(setup: Setup<T>)`
  - `getItemSync(key: string)`
  - `setItemSync(key: string, value: unknown)`
  - `removeItemSync(key: string)`
  - `clearSync()`
  - `sizeSync()`
  - `keySync(index: number)` - returns the name of the key by its index
  - `deleteStorageSync()`

Example: [MockInterface](https://github.com/vglinka/storage-facade/blob/main/examples/interface.ts)

Implementing these methods will allow you to save and load values
from storage in a convenient way, shown below.

In addition, iteration over entries is available.

## Libraries using the Storage facade

### IndexedDB

- [storage-facade-indexeddb](https://www.npmjs.com/package/storage-facade-indexeddb) - An simple way to store data in IndexedDB.

### localStorage

- [storage-facade-localstorage](https://www.npmjs.com/package/storage-facade-localstorage) - If you need virtual storages inside `localStorage` that can be cleared without affecting other data stored in `localStorage`. Supports caching.

- [storage-facade-localstoragethin](https://www.npmjs.com/package/storage-facade-localstoragethin) - Just delegation to `localStorage`. Supports caching.

### sessionStorage

- [storage-facade-sessionstorage](https://www.npmjs.com/package/storage-facade-sessionstorage) - If you need virtual storages inside `sessionStorage` that can be cleared without affecting other data stored in `sessionStorage`. Supports caching.


- [storage-facade-sessionstoragethin](https://www.npmjs.com/package/storage-facade-sessionstoragethin) - Just delegation to `sessionStorage`. Supports caching.

### MockInterface

- [storage-facade-mockinterface](https://www.npmjs.com/package/storage-facade-mockinterface) - MockInterface for Storage facade. Allows you to set a random delay in the interval for asynchronous operations. Used for testing.

### MapInterface

- [storage-facade-map](https://www.npmjs.com/package/storage-facade-map) - Just a wrapper for [Map (MDN)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map).

## Installation

```sh
npm install storage-facade@4 storage-facade-mockinterface@4
```

# Usage

## Storage methods

- `.clear()` - removes all key-value pairs from the storage
- `.getEntries()` async only, returns an array of promises to iterate
- `.entries()` sync only, returns an array of key-value pairs
- `.deleteStorage()` - delete storage
- `.size()` - returns the number of key-value pairs
- `.key(index: number)` - returns the name of the key by its index

The `key` and `size` methods can be used to create custom iterators.

## '...Default' methods

The default values are used if the value in the storage is `undefined`.
Default values are not stored in the storage, but in the instance.
Therefore, all these methods are synchronous (no need to use the `await` keyword):

- `.addDefault(obj)` - adds keys and values from the passed object to the list of default values
- `.setDefault(obj)` - replaces the list of default values with the given object
- `.getDefault()` - returns an object containing default values
- `.clearDefault()` - replaces a list of default values with an empty object

## Examples

### Async read/write/delete

```TypeScript
import { createStorage } from 'storage-facade';
import { MockInterface } from 'storage-facade-mockinterface';

(async () => {
  const storage = createStorage({
    use: new MockInterface(), // Here is your interface
    name: 'settings', // Storage name, optional
  });

  // If an error occurs at the initialization stage,
  // it will be thrown at the first attempt
  // to access the storage (read, write, all methods except
  // 'addDefault, setDefault, getDefault, clearDefault')

  // Write
  storage.value = { data: [40, 42] };
  // After the assignment, wait for the write operation to complete
  await storage.value; // Successfully written

  // Read value
  console.log(await storage.value); // { data: [40, 42] }

  // When writing, accesses to first-level keys are intercepted only,
  // so if you need to make changes inside the object,
  // you need to make changes and then assign it to the first level key.
  // Get object
  const updatedValue = (await storage.value) as Record<string, unknown>;
  // Make changes
  updatedValue.data = [10, 45];
  // Update storage
  storage.value = updatedValue;
  await storage.value; // Successfully written

  // Read value
  console.log(
    ((await storage.value) as Record<string, unknown>).data
  ); // [10, 45]

  // OR
  const value = (await storage.value) as Record<string, unknown>;
  console.log(value.data); // [10, 45]

  // Delete value
  delete storage.value;
  await storage.value; // Successfully deleted

  console.log(await storage.value); // undefined

  storage.value = 30;
  await storage.value;

  console.log(await storage.value); // 30

  // Clear storage
  await storage.clear();
  console.log(await storage.value); // undefined

  // Delete storage
  await storage.deleteStorage();
})();
```

### Sync read/write/delete

```TypeScript
import { createStorage } from 'storage-facade';
import { MockInterface } from 'storage-facade-mockinterface';

const storage = createStorage({
  use: new MockInterface(), // Here is your interface
  name: 'settings', // Storage name, optional
  asyncMode: false,
  //         ^^^^^
});

// If an error occurs at the initialization stage,
// it will be thrown at the first attempt
// to access the storage (read, write, all methods except
// 'addDefault, setDefault, getDefault, clearDefault')
try {
  storage.value = { data: [40, 42] };
  console.log(storage.value); // { data: [40, 42] }

  // When writing, accesses to first-level keys are intercepted only,
  // so if you need to make changes inside the object,
  // you need to make changes and then assign it to the first level key.
  // Get object
  const updatedValue = storage.value as Record<string, unknown>;
  // Make changes
  updatedValue.data = [10, 45];
  // Update storage,
  storage.value = updatedValue; // Ok
  console.log((storage.value as Record<string, unknown>).data); // [10, 45]

  delete storage.value;
  console.log(storage.value); // undefined

  storage.value = 30;
  console.log(storage.value); // 30

  storage.clear();
  console.log(storage.value); // undefined

  // Delete storage
  storage.deleteStorage();
} catch (e) {
  console.error((e as Error).message);
}
```

### Async iteration `.getEntries()`

```TypeScript
import { createStorage } from 'storage-facade';
import { MockInterface } from 'storage-facade-mockinterface';

(async () => {
  const storage = createStorage({
    use: new MockInterface(),
  });

  storage.value = 4;
  await storage.value;

  storage.other = 5;
  await storage.other;

  const promisesArray = await storage.getEntries();

  const array = promisesArray.map(async (kv) => {
    const [key, value] = await kv;
    // ... add code here ...
    return [key, value];
  });

  console.log(await Promise.all(array));
  /*
    [
      ['value', 4],
      ['other', 5],
    ]
  */
})();
```

### Sync iteration `.entries()`

```TypeScript
import { createStorage } from 'storage-facade';
import { MockInterface } from 'storage-facade-mockinterface';

const storage = createStorage({
  use: new MockInterface(),
  asyncMode: false,
});

try {
  storage.value = 4;
  storage.other = 5;

  const array = storage
    .entries()
    .map(([key, value]) => {
      // ... add code here ...
      return [key, value];
    });

  console.log(array);
  /*
    [
      ['value', 4],
      ['other', 5],
    ]
  */
} catch (e) {
  console.error((e as Error).message);
}
```

### Async '...Default' methods

```TypeScript
import { createStorage } from 'storage-facade';
import { MockInterface } from 'storage-facade-mockinterface';

(async () => {
  const storage = createStorage({
    use: new MockInterface(),
  });

  console.log(await storage.value) // undefined

  storage.addDefault({ value: 9, other: 3 });
  storage.addDefault({ value: 1, value2: 2 });

  // Since `storage.value = undefined` the default value is used
  console.log(await storage.value);  // 1

  console.log(await storage.value2); // 2
  console.log(await storage.other);  // 3

  storage.value = 42;
  await storage.value;
  // When we set a value other than `undefined`,
  // the default value is no longer used
  console.log(await storage.value); // 42

  storage.value = undefined;
  await storage.value;
  console.log(await storage.value); // 1

  storage.value = null;
  await storage.value;
  console.log(await storage.value); // null

  delete storage.value;
  await storage.value;
  console.log(await storage.value); // 1

  // getDefault
  console.log(storage.getDefault()); // { value: 1, value2: 2, other: 3 }

  // Replace 'default'
  storage.setDefault({ value: 30 });

  console.log(await storage.value); // 30
  console.log(await storage.value2); // undefined

  // clearDefault
  storage.clearDefault();

  console.log(await storage.value); // undefined
  console.log(await storage.value2); // undefined
})();
```

### Sync '...Default' methods

```TypeScript
import { createStorage } from 'storage-facade';
import { MockInterface } from 'storage-facade-mockinterface';

const storage = createStorage({
  use: new MockInterface(),
  asyncMode: false,
});

try {
  console.log(storage.value) // undefined

  storage.addDefault({ value: 9, other: 3 });
  storage.addDefault({ value: 1, value2: 2 });

  // Since `storage.value = undefined` the default value is used
  console.log(storage.value);  // 1

  console.log(storage.value2); // 2
  console.log(storage.other);  // 3

  storage.value = 42;
  // When we set a value other than `undefined`,
  // the default value is no longer used
  console.log(storage.value); // 42

  storage.value = undefined;
  console.log(storage.value); // 1

  storage.value = null;
  console.log(storage.value); // null

  delete storage.value;
  console.log(storage.value); // 1

  // getDefault
  console.log(storage.getDefault()); // { value: 1, value2: 2, other: 3 }

  // Replace 'default'
  storage.setDefault({ value: 30 });

  console.log(storage.value); // 30
  console.log(storage.value2); // undefined

  // clearDefault
  storage.clearDefault();

  console.log(storage.value); // undefined
  console.log(storage.value2); // undefined
} catch (e) {
  console.error((e as Error).message);
}
```

# Limitations

## Use only first level keys when writing

When writing, accesses to first-level keys (like `storage.a =`,
but not `storage.a[0] =` or `storage.a.b =`) are intercepted only,
so if you need to make changes inside the object, you need to make changes
and then assign it to the first level key.

Assigning keys of the second or more levels will not give any effect.

sync:

```TypeScript
  // Read
  console.log((storage.value as Record<string, unknown>).data); // Ok

  // Write
  // Don't do that
  storage.value.data = 42; // no effect
```

Instead, use the following approach:

```TypeScript
  // Read
  console.log((storage.value as Record<string, unknown>).data); // Ok

  // Write
  // Get object
  const updatedValue = storage.value as Record<string, unknown>;
  // Make changes
  updatedValue.data = 42;
  // Update storage
  storage.value = updatedValue; // Ок
```

async:

```TypeScript
  // Read
  console.log(
    ((await storage.value) as Record<string, unknown>).data
  ); // Ok

  // Write
  // Get object
  const updatedValue = (await storage.value) as Record<string, unknown>;
  // Make changes
  updatedValue.data = 42;
  // Update storage
  storage.value = updatedValue;
  await storage.value // Ок
```

## Don't use banned key names

There is a list of key names that cannot be used because they are the same
as built-in method names: [`clear`, `deleteStorage`, `size`, `key`,
`getEntries`, `entries`, `addDefault`, `setDefault`, `getDefault`, `clearDefault`].

Use the `keyIsNotBanned` function to check the key if needed.

```TypeScript
import { createStorage, keyIsNotBanned } from 'storage-facade';
import { MockInterface } from 'storage-facade-mockinterface';

const storage = createStorage({
  use: new MockInterface(),
  asyncMode: false,
});

try {
  const myNewKey = 'newKey';
  if (keyIsNotBanned(myNewKey)) {
    storage[myNewKey] = 42;
  }
} catch (e) {
  console.error((e as Error).message);
}
```

## Keys are `string`

Only values of type `string` can be used as keys.

## Values for `...Default` methods

Values for [`addDefault`, `setDefault`] methods
should be of any [structured-cloneable type (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Structured_clone_algorithm#supported_types).







