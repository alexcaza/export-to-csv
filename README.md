# export-to-csv | Export to CSV Mini Library

Small, simple and single purpose. Zero dependencies, functionally inspired and fairly well typed.

If you're looking for a fully CSV compliant, consistently maintained, whole-package library, I'd recommend looking elsewhere! (see [alternatives](#alternatives) section below)

If you want a lightweight, stable, easy-to-use basic CSV generation and download library, feel free to install.

## Installation

```javascript
npm install --save export-to-csv
```

## Usage

This library was written with TypeScript in mind, so the examples will be in TS.

You can easily use this library in JavaScript as well. The bundle is using ES6 modules, which all modern browsers support.

You can also look at the [integration tests](integration/index.html) for browser/JS use, and the [unit tests](lib/__specs__) to understand how the library functions.

### In-browser

```typescript
import { mkConfig, generateCsv, download } from "export-to-csv";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const csvConfig = mkConfig({ useKeysAsHeaders: true });

const mockData = [
  {
    name: "Rouky",
    date: "2023-09-01",
    percentage: 0.4,
    quoted: '"Pickles"',
  },
  {
    name: "Keiko",
    date: "2023-09-01",
    percentage: 0.9,
    quoted: '"Cactus"',
  },
];

// Converts your Array<Object> to a CsvOutput string based on the configs
const csv = generateCsv(csvConfig)(mockData);

// Get the button in your HTML
const csvBtn = document.querySelector("#csv");

// Add a click handler that will run the `download` function.
// `download` takes `csvConfig` and the generated `CsvOutput`
// from `generateCsv`.
csvBtn.addEventListener("click", () => download(csvConfig)(csv));
```

### Node.js

```typescript
import { mkConfig, generateCsv, asString } from "./output/index.js";
import { writeFile } from "node:fs";
import { Buffer } from "node:buffer";

// mkConfig merges your options with the defaults
// and returns WithDefaults<ConfigOptions>
const csvConfig = mkConfig({ useKeysAsHeaders: true });

const mockData = [
  {
    name: "Rouky",
    date: "2023-09-01",
    percentage: 0.4,
    quoted: '"Pickles"',
  },
  {
    name: "Keiko",
    date: "2023-09-01",
    percentage: 0.9,
    quoted: '"Cactus"',
  },
];

// Converts your Array<Object> to a CsvOutput string based on the configs
const csv = generateCsv(csvConfig)(mockData);
const filename = `${csvConfig.filename}.csv`;
const csvBuffer = new Uint8Array(Buffer.from(asString(csv)));

// Write the csv file to disk
writeFile(filename, csvBuffer, (err) => {
  if (err) throw err;
  console.log("file saved: ", filename);
});
```

## API

| Option              | Default                          | Type                                                   | Description                                                                                                                                                                                                                                                                                                                              |
| ------------------- | -------------------------------- | ------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fieldSeparator`    | `","`                            | `string`                                               | Defines the field separator character                                                                                                                                                                                                                                                                                                    |
| `filename`          | `"generated"`                    | `string`                                               | Sets the name of the file creates from the `download` function                                                                                                                                                                                                                                                                           |
| `quoteStrings`      | `false`                          | `boolean`                                              | Determines whether or not to quote strings (using `quoteCharacter`'s value). Whether or not this is set, `\r`, `\n`, and `fieldSeparator` will be quoted.                                                                                                                                                                                |
| `quoteCharacter`    | `'"'`                            | `string`                                               | Sets the quote character to use.                                                                                                                                                                                                                                                                                                         |
| `decimalSeparator`  | `"."`                            | `string`                                               | Defines the decimal separator character (default is .). If set to "locale", it uses the [language sensitive representation of the number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).                                                                                       |
| `showTitle`         | `false`                          | `boolean`                                              | Sets whether or not to add the value of `title` to the start of the CSV. (This is not supported by all CSV readers)                                                                                                                                                                                                                      |
| `title`             | `"My Generated Report"`          | `string`                                               | The title to display as the first line of the CSV file. (This **is not** the name of the file [see `filename`])                                                                                                                                                                                                                          |
| `showColumnHeaders` | `true`                           | `boolean`                                              | Determines if columns should have headers. When set to `false`, the first row of the CSV will be data.                                                                                                                                                                                                                                   |
| `columnHeaders`     | `[]`                             | `Array<string \| {key: string, displayLabel: string}>` | **Use this option if column/header order is important!** Determines the headers to use as the first line of the CSV data. If the item is a `string`, it will be used for lookup in your collection AND as the header label. If the item is an object, `key` will be used for lookup and `displayLabel` will be used as the header label. |
| `useKeysAsHeaders`  | `false`                          | `boolean`                                              | If set, the CSV will use the key names in your collection as headers. **Warning: `headers` recommended for large collections. If set, it'll override the `headers` option. Column/header order also not guaranteed. Use `headers` only if order is important!**                                                                          |
| `boolDisplay`       | `{true: "TRUE", false: "FALSE"}` | `{true: string, false: string}`                        | Determines how to display boolean values in the CSV. **This only works for `true` and `false`. `1` and `0` will not be coerced and will display as `1` and `0`.**                                                                                                                                                                        |
| `useBom`            | `true`                           | `boolean`                                              | Adds a [byte order mark](https://en.wikipedia.org/wiki/Byte_order_mark) which is required by Excel to display CSVs, despite is not being necessary with UTF-8 🤷‍♂️                                                                                                                                                                         |
| `useTextFile`       | `false`                          | `boolean`                                              | Will download the file as `text/plain` instead of `text/csv` and use a `.txt` vs `.csv` file-extension.                                                                                                                                                                                                                                  |

# Alternatives

As mentioned above, this library is intentionally small and was designed to solve a very simple need. It **was not** originally designed to be fully CSV compliant, so many things you need _might_ be missing. I'm also not the most active on it (~7 year gap between updates). So, here are some alternatives with more support and that might be more fully featured.

- https://csv.js.org/
- https://www.papaparse.com/

# Thanks!

This library was originally based off of [this library](https://github.com/javiertelioz/angular2-csv) by Javier Telio

| Credits and Original Authors                        |
| :-------------------------------------------------- |
| **[javiertelioz](https://github.com/javiertelioz)** |
| **[sn123](https://github.com/sn123)**               |
| **[arf1980](https://github.com/arf1980)**           |
