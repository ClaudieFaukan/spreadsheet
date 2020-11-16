import { writeFileSync} from 'fs'
import { join } from 'path';

import { spreadsheetBuild, Sheet, ObjectSheets } from '../src/build';


describe('spreadsheetBuild', () => {

    interface Car {
        brand: string;
        model: string;
        hp: number;
    }

    interface Computer {
        brand: string;
        model: string;
        cpuCount: number;
    }

    const carSheet: Sheet<Car> = {
        name: 'Voitures',
        data: [{
            brand: 'Peugeot',
            model: '406',
            hp: 136
        }]
    };

    const computerSheet: Sheet<Computer> = {
        name: 'Ordinateurs',
        data: [{
            brand: 'HP',
            model: 'X785',
            cpuCount: 16
        }]
    };

    function write(path: string, content: Buffer) {

        writeFileSync(join(__dirname, path), content);
    }

    it('spreadsheetBuild with sheets and object data', () => {

        const sheets: [Sheet<Car>, Sheet<Computer>] = [carSheet, computerSheet];

        const buffer = spreadsheetBuild(sheets);

        write('multi-sheets.xlsx', buffer);
    });

    it('spreadsheetBuild with sheets and array data', () => {

        const sheets: [Sheet<Car>, Sheet<Computer>] = [carSheet, computerSheet];

        const buffer = spreadsheetBuild({
            name: 'Voitures',
            cols: ['brand', 'model', 'hp'],
            data: [
                ['Peugeot', 406, '136'],
                ['Peugeot', 406, '136'],
                ['Peugeot', 406, '136']
            ]
        });

        write('one-array-sheet.xlsx', buffer);
    });

    it('spreadsheetBuild with sheets and ods format', () => {

        const sheets: ObjectSheets<[Car, Computer]> = [carSheet, computerSheet];

        const buffer = spreadsheetBuild(sheets, {
            format: 'ods'
        });

        write('one-sheet.ods', buffer);
    });

    it('spreadsheetBuild with sheets and csv format', () => {

        const buffer = spreadsheetBuild(carSheet, {
            format: 'csv'
        });

        write('one-sheet.csv', buffer);
    });
});