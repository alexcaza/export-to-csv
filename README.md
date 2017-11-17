# export-to-csv | Export to CSV Mini Library
Based off of [this library](https://github.com/javiertelioz/angular2-csv) by Javier Telio

> Helper library to quickly and easily create a CSV file in browser or Node
> 

## Installation

For now, the package much be added using github links in your `package.json` file.
An npm package is in the TODOs :)
<!-- ```javascript
npm install --save angular2-csv
``` -->

## Usage
```javascript

import { ExportToCsv } from 'alexcaza/export-to-csv';

var data = [
  {
    name: "Test 1",
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

const exportToCsv = new ExportToCsv({
    // ...options here
} /* , filename */);

```

## API


| Option        | Default           | Description  |
| :------------- |:-------------:| -----|
| **fieldSeparator**      | , | Defines the field separator character |
| **quoteStrings**      | "      | If provided, will use this characters to "escape" fields, otherwise will use double quotes as deafult |
| **decimalseparator** | .      | Defines the decimal separator character (default is .). If set to "locale", it uses the [language sensitive representation of the number](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString).|
| **showLabels** | false      | If provided, would use this attribute to create a header row |
| **showTitle** | false      |   |
| **useBom** | true      | If true, adds a BOM character at the start of the CSV |


**Example**
---

```javascript
  const options = { 
    fieldSeparator: ',',
    quoteStrings: '"',
    decimalseparator: '.',
    showLabels: true, 
    showTitle: true,
    useBom: true
  };

const exportToCsv = ExportToCsv(options);

```

# TODOs
* Update README with full API
* Create and public NPM package

#Credits
---

|                |
| :------------- |
| **[sn123](https://github.com/sn123)** |
| **[arf1980](https://github.com/arf1980)** |
