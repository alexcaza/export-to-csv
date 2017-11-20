import { ExportToCsv, Options } from './export-to-csv';

const mockData = [
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

describe('ExportToCsv', () => {
    it('should create a comma seperated string', () => {
        const options: Options = {
            title: "Test Csv",
            useBom: true,
            useKeysAsHeaders: true
        }

        const exportToCsvInstance = new ExportToCsv(options);
        const string = exportToCsvInstance.generateCsv(mockData, true);
        expect(string).toBeTruthy(typeof string === 'string');
    });

    it('should download a CSV file', () => {
        const options: Options = {
            title: "Test Csv",
            useBom: true,
            useKeysAsHeaders: true
        }

        const exportToCsvInstance = new ExportToCsv(options);
        exportToCsvInstance.generateCsv(mockData);

    });
});