export interface Options {
    filename?: string;
    fieldSeparator?: string;
    quoteStrings?: string;
    decimalSeparator?: string;
    showLabels?: boolean;
    showTitle?: boolean;
    title?: string;
    useTextFile?: boolean,
    useBom?: boolean;
    headers?: string[] | MappedHeaders[];
    useKeysAsHeaders?: boolean;
}

export interface MappedHeaders {
    headerName: string;
    objectKey: string
}

export class CsvConfigConsts {

    public static EOL = "\r\n";
    public static BOM = "\ufeff";

    public static DEFAULT_FIELD_SEPARATOR = ',';
    public static DEFAULT_DECIMAL_SEPARATOR = '.';
    public static DEFAULT_QUOTE = '"';
    public static DEFAULT_SHOW_TITLE = false;
    public static DEFAULT_TITLE = 'My Generated Report';
    public static DEFAULT_FILENAME = 'generated';
    public static DEFAULT_SHOW_LABELS = false;
    public static DEFAULT_USE_TEXT_FILE= false;
    public static DEFAULT_USE_BOM = true;
    public static DEFAULT_HEADER: string[] = [];
    public static DEFAULT_KEYS_AS_HEADERS = false;

}

export const ConfigDefaults: Options = {
    filename: CsvConfigConsts.DEFAULT_FILENAME,
    fieldSeparator: CsvConfigConsts.DEFAULT_FIELD_SEPARATOR,
    quoteStrings: CsvConfigConsts.DEFAULT_QUOTE,
    decimalSeparator: CsvConfigConsts.DEFAULT_DECIMAL_SEPARATOR,
    showLabels: CsvConfigConsts.DEFAULT_SHOW_LABELS,
    showTitle: CsvConfigConsts.DEFAULT_SHOW_TITLE,
    title: CsvConfigConsts.DEFAULT_TITLE,
    useTextFile: CsvConfigConsts.DEFAULT_USE_TEXT_FILE,
    useBom: CsvConfigConsts.DEFAULT_USE_BOM,
    headers: CsvConfigConsts.DEFAULT_HEADER,
    useKeysAsHeaders: CsvConfigConsts.DEFAULT_KEYS_AS_HEADERS,
};
export class ExportToCsv {


    private _data: any[];
    private _options: Options;
    private _csv = "";
    private _isMappedHeaders = false;

    get options(): Options {
        return this._options;
    }

    set options(options: Options) {
        this._options = objectAssign({}, ConfigDefaults, options);
    }

    constructor(options?: Options) {
        let config = options || {};

        this._options = objectAssign({}, ConfigDefaults, config);

        if (
            this._options.useKeysAsHeaders
            && this._options.headers
            && this._options.headers.length > 0
        ) {
            console.warn('Option to use object keys as headers was set, but headers were still passed!');
        }

    }
    /**
     * Generate and Download Csv
     */
    generateCsv(jsonData: any, shouldReturnCsv: boolean = false): void | any {

        // Make sure to reset csv data on each run
        this._csv = '';

        this._parseData(jsonData);

        if (this._options.useBom) {
            this._csv += CsvConfigConsts.BOM;
        }

        if (this._options.showTitle) {
            this._csv += this._options.title + '\r\n\n';
        }

        this._getHeaders();
        this._getBody();

        if (this._csv == '') {
            console.log("Invalid data");
            return;
        }

        // When the consumer asks for the data, exit the function
        // by returning the CSV data built at this point
        if (shouldReturnCsv) {
            return this._csv;
        }

        // Create CSV blob to download if requesting in the browser and the
        // consumer doesn't set the shouldReturnCsv param
        const FileType = this._options.useTextFile ? 'plain' : 'csv';
        const fileExtension = this._options.useTextFile ? '.txt' : '.csv';
        let blob = new Blob([this._csv], { "type": "text/" + FileType + ";charset=utf8;" });

        if (navigator.msSaveBlob) {
            let filename = this._options.filename.replace(/ /g, "_") + fileExtension;
            navigator.msSaveBlob(blob, filename);
        } else {
            const attachmentType = this._options.useTextFile ? 'text' : 'csv';
            let uri = 'data:attachment/'+ attachmentType +';charset=utf-8,' + encodeURI(this._csv);
            let link = document.createElement("a");
            link.href = URL.createObjectURL(blob);

            link.setAttribute('visibility', 'hidden');
            link.download = this._options.filename.replace(/ /g, "_") + fileExtension;

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }

    /**
     * Create Headers
     */
    private _getHeaders(): void {
        if (!this._options.showLabels && !this._options.useKeysAsHeaders) {
            return;
        }
        const useKeysAsHeaders = this._options.useKeysAsHeaders;
        let headers = useKeysAsHeaders ? Object.keys(this._data[0]) : this._options.headers;

        if (headers.every((h: string|MappedHeaders) => typeof h === 'object')) {
            this._isMappedHeaders = true;
            headers = headers.map((h: MappedHeaders) => h.headerName);
        }

        if (headers.length > 0) {
            let row = "";
            for (let keyPos = 0; keyPos < headers.length; keyPos++) {
                row += headers[keyPos] + this._options.fieldSeparator;
            }

            row = row.slice(0, -1);
            this._csv += row + CsvConfigConsts.EOL;
        }
    }
    /**
     * Create Body
     */
    private _getBody() {
        let keys = Object.keys(this._data[0]);
        if (this._isMappedHeaders) {
            keys = this._options.headers.map((h: MappedHeaders) => h.objectKey);
        }

        for (var i = 0; i < this._data.length; i++) {
            let row = "";
            for (let keyPos = 0; keyPos < keys.length; keyPos++) {
                const key = keys[keyPos];
                row += this._formatData(this._data[i][key]) + this._options.fieldSeparator;
            }

            row = row.slice(0, -1);
            this._csv += row + CsvConfigConsts.EOL;
        }
    }
    /**
     * Format Data
     * @param {any} data
     */
    private _formatData(data: any) {

        if (this._options.decimalSeparator === 'locale' && this._isFloat(data)) {
            return data.toLocaleString();
        }

        if (this._options.decimalSeparator !== '.' && this._isFloat(data)) {
            return data.toString().replace('.', this._options.decimalSeparator);
        }

        if (typeof data === 'string') {
            data = data.replace(/"/g, '""');
            if (this._options.quoteStrings || data.indexOf(',') > -1 || data.indexOf('\n') > -1 || data.indexOf('\r') > -1) {
                data = this._options.quoteStrings + data + this._options.quoteStrings;
            }
            return data;
        }

        if (typeof data === 'boolean') {
            return data ? 'TRUE' : 'FALSE';
        }
        return data;
    }
    /**
     * Check if is Float
     * @param {any} input
     */
    private _isFloat(input: any) {
        return +input === input && (!isFinite(input) || Boolean(input % 1));
    }
    /**
     * Parse the collection given to it
     * 
     * @private
     * @param {*} jsonData 
     * @returns {any[]} 
     * @memberof ExportToCsv
     */
    private _parseData(jsonData: any): any[] {
        this._data = typeof jsonData != 'object' ? JSON.parse(jsonData) : jsonData;

        return this._data;
    }
}

let hasOwnProperty = Object.prototype.hasOwnProperty;
let propIsEnumerable = Object.prototype.propertyIsEnumerable;

/**
 * Convet to Object
 * @param {any} val
 */
function toObject(val: any) {
    if (val === null || val === undefined) {
        throw new TypeError('Object.assign cannot be called with null or undefined');
    }
    return Object(val);
}
/**
 * Assign data  to new Object
 * @param {any}   target
 * @param {any[]} ...source
 */
function objectAssign(target: any, ...source: any[]) {
    let from: any;
    let to = toObject(target);
    let symbols: any;

    for (var s = 1; s < arguments.length; s++) {
        from = Object(arguments[s]);

        for (var key in from) {
            if (hasOwnProperty.call(from, key)) {
                to[key] = from[key];
            }
        }

        if ((<any>Object).getOwnPropertySymbols) {
            symbols = (<any>Object).getOwnPropertySymbols(from);
            for (var i = 0; i < symbols.length; i++) {
                if (propIsEnumerable.call(from, symbols[i])) {
                    to[symbols[i]] = from[symbols[i]];
                }
            }
        }
    }
    return to;
}
