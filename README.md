# export-to-csv | Export to CSV Mini Library
Based off of [this library](https://github.com/javiertelioz/angular2-csv) by Javier Telio

> Helper library to quickly and easily create a CSV file in browser or Node
> 

## Installation

```javascript
yarn add export-to-csv
// npm install --save export-to-csv
```

## Usage
```javascript

import { ExportToCsv } from 'export-to-csv';

var data = [
  {
    name: 'Test 1',
    age: 13,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
  {
    name: 'Test 2',
    age: 11,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
  {
    name: 'Test 4',
    age: 10,
    average: 8.2,
    approved: true,
    description: "using 'Content here, content here' "
  },
];

  const options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalSeparator: '.',
    showLabels: true, 
    showTitle: true,
    title: 'My Awesome CSV',
    useTextFile: false,
    useBom: true,
    useKeysAsHeaders: true,
    // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
  };

const csvExporter = new ExportToCsv(options);

csvExporter.generateCsv(data);

```

## API


| Option        | Default           | Description  |
| :------------- |:-------------:| -----|
| **fieldSeparator**      | , | Defines the field separator character |
| **filename**      | 'generated' | Sets the name of the downloaded file. ".csv" will be appended to the value provided. |
| **quoteStrings**      | "      | If provided, will use this characters to "escape" fields, otherwise will use double quotes as deafult |
| **decimalSeparator** | .      | Defines the decimal separator character (default is .). If set to "locale", it uses the [language sensitive representation of the number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).|
| **showLabels** | false      | If true, the first row will be the `headers` option or object keys if `useKeysAsHeaders` is present|
| **showTitle** | false      | Includes the title as the first line in the generated file   |
| **title** | 'My Generated Report' | This string will be used as the report title |
| **useBom** | true      | If true, adds a BOM character at the start of the CSV to improve file compatibility |
| **useTextFile** | false      | If true, returns a `.txt` file instead of `.csv` |
| **useKeysAsHeaders** | false      | If true, this will use the keys of the first object in the collection as the column headers|
| **headers** | []      | Expects an array of strings, which if supplied, will be used as the column headers|


# Thanks!

|        Credits and Original Authors        |
| :------------- |
| **[javiertelioz](https://github.com/javiertelioz)** |
| **[sn123](https://github.com/sn123)** |
| **[arf1980](https://github.com/arf1980)** |
