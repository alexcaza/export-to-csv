/* tslint:disable:no-unused-variable */

import { TestBed, async } from '@angular/core/testing';
import { ExportToCsv } from './export-to-csv';

describe('Component: Angular2Csv', () => {
    it('should create an file with name My_Report.csv', () => {
        let data = [
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

        let component = new ExportToCsv(data, 'My Report');
        expect(component).toBeTruthy();
    });
});