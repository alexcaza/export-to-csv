import { ExportToCsv, Options } from './export-to-csv';

const mockData = [
    {
        name: "Test 1",
        age: 13,
        average: 8.2,
        approved: true,
        description: "Test 1 description"
    },
    {
        name: 'Test 2',
        age: 11,
        average: 8.2,
        approved: true,
        description: "Test 2 description"
    },
    {
        name: 'Test 4',
        age: 10,
        average: 8.2,
        approved: true,
        description: "Test 3 description"
    },
];

describe('ExportToCsv', () => {
    it('should create a comma seperated string', () => {
        const options: Options = {
            title: "Test Csv",
            useBom: true,
            useKeysAsHeaders: true,
        }

        const exportToCsvInstance = new ExportToCsv(options);
        const string = exportToCsvInstance.generateCsv(mockData, true);
        expect(string).toBeTruthy(typeof string === 'string');
    });

    it('should use keys of first object in collection as headers', () => {
        const options: Options = {
            title: "Test Csv",
            useBom: true,
            useKeysAsHeaders: true,
        };

        const exportToCsvInstance = new ExportToCsv(options);
        const string = exportToCsvInstance.generateCsv(mockData, true);

        const firstLine = string.split('\n')[0];
        const keys = firstLine.split(',').map((s: string) => s.trim());

        const mockDataKeys = Object.keys(mockData[0]);
        expect(keys).toEqual(mockDataKeys);
    });

    // it('should properly overwrite default options through contructor', () => {
    //     const exportToCsvInstance = new ExportToCsv();
    //     const defaults = { ...exportToCsvInstance.options };
    // });

    it('should initiate download through spawned browser', () => {
        if (!window) {
            pending('it should only initiate download when run in browser context');
        }
        const options: Options = {
            title: "Test Csv",
            useBom: true,
            useKeysAsHeaders: true
        }

        const exportToCsvInstance = new ExportToCsv(options);
        exportToCsvInstance.generateCsv(mockData);

    });
});

describe('ExportToCsv As A Text File', () => {
    it('should create a comma seperated string', () => {
        const options: Options = {
            title: "Test Csv 1",
            useTextFile: true,
            useBom: true,
            useKeysAsHeaders: true,
        };

        const exportToCsvInstance = new ExportToCsv(options);
        const string = exportToCsvInstance.generateCsv(mockData, true);
        expect(string).toBeTruthy(typeof string === 'string');
    });

    it('should use keys of first object in collection as headers', () => {
        const options: Options = {
            filename: "Test Csv 2",
            useTextFile: true,
            useBom: true,
            useKeysAsHeaders: true,
        };

        const exportToCsvInstance = new ExportToCsv(options);
        const string = exportToCsvInstance.generateCsv(mockData, true);

        const firstLine = string.split('\n')[0];
        const keys = firstLine.split(',').map((s: string) => s.trim());

        const mockDataKeys = Object.keys(mockData[0]);
        expect(keys).toEqual(mockDataKeys);
    });

    it('should initiate download through spawned browser', () => {
        if (!window) {
            pending('it should only initiate download when run in browser context');
        }
        const options: Options = {
            filename: "Test Csv 3",
            useTextFile: true,
            useBom: true,
            useKeysAsHeaders: true
        };

        const exportToCsvInstance = new ExportToCsv(options);
        exportToCsvInstance.generateCsv(mockData);

    });
});