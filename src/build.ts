import { Buffer } from 'buffer';
import { utils, WorkSheet, write as writeXls } from 'xlsx';


interface BaseSheet {
    name: string;
}

export interface ObjectSheet<T=any> extends BaseSheet {
    data: T[];
}

export interface ArraySheet extends BaseSheet {
    cols: string[];
    data: (string | Date | boolean | number)[][];
}

export type Sheet<T=any> = ObjectSheet<T> | ArraySheet;

export type ObjectSheets<T=any> = {
    [K in keyof T]: Sheet<T[K]>
}

export interface SpreadsheetBuildOptions {
    format?: 'xls' | 'xlsx' | 'ods';
}

interface SpreadsheetBuildCsvOptions {
    format: 'csv';
}

function sheetIsArraySheet(sheet: Sheet): sheet is ArraySheet {
    return (sheet as ArraySheet).cols !== undefined;
}

/***
 * 
 */
function sheetToWorkSheet(sheet: Sheet): WorkSheet {


    if ( sheetIsArraySheet(sheet) ) {

        sheet.data.unshift(sheet.cols);

        return utils.aoa_to_sheet(sheet.data);
    }

    return utils.json_to_sheet(sheet.data) 
}

export function spreadsheetBuild(sheet: ArraySheet, options: SpreadsheetBuildCsvOptions): Buffer;
export function spreadsheetBuild<TSheetData extends object>(sheet: ObjectSheet<TSheetData>, options: SpreadsheetBuildCsvOptions): Buffer;

export function spreadsheetBuild(sheet: ArraySheet, options?: SpreadsheetBuildOptions): Buffer;
export function spreadsheetBuild<TSheetData extends object[]>(sheets: ObjectSheets<TSheetData> | ArraySheet[], options?: SpreadsheetBuildOptions): Buffer;


/**
 * 
 * Cette fonction vise à génerer un Buffer contenant les données de tableau au format 'xls' | 'xlsx' | 'ods' | 'csv
 * Cas particulier, si le format est csv renvoyer l'erreur "Une seule feuille est supportée pour le format csv" si plusieurs feuille sont présentes
 * Si format csv mettre comme séparateur (FS) , et forcer les guillements autour des valeurs (forceQuotes)
 * 
 * La spécificité du CSV réside dans le fait qu'on l'ouvre souvent dans un tableur mais il ne possède en réalité qu'une seule feuille
 * 
 * Fonctions de la librairie xlsx à utiliser:
 *   - utils.json_to_sheet (converti une collection d'objet en une WorkSheet)
 *   - utils.sheet_to_csv (converti une Worksheet en une chaine de caractère CSV)
 *   - utils.new_book (créer un WorkBook)
 *   - utils.book_append_sheet (Ajoute une WorkSheet à un WorkBook)
 *   - write (Ecrit un WorkBook dans n'importe quel type)
 * 
 * J'ai ajouté la méthode en bas du fichier si tu souhaites de l'aide
 * 
 * Attention Sheet peut en réalité être de type ObjectSheet (une feuille contenant en data que des objets -> un objet par ligne) ou de type ArraySheet (contenant comme data un tableau de tableau -> un tableau par ligne)
 * 
 * @param sheetOrSheets 
 * @param options 
 */
export function spreadsheetBuild(sheetOrSheets: ObjectSheet | ArraySheet | ObjectSheets | ArraySheet[], options?: SpreadsheetBuildOptions | SpreadsheetBuildCsvOptions): Buffer {
    if (!options){
        options = {}
    }
    const format = options.format || "xlsx"
    const sheets = sheetOrSheets instanceof Array ? sheetOrSheets : [sheetOrSheets] as Sheet[];

    if (format === "csv"){
        
        if (sheets.length !==1 ) {
            throw "Une seule feuille est supportée pour le format csv ";
        }
        let ws = sheetToWorkSheet(sheets[0]);
        let strCSV = utils.
    }
}




































































/**
 * 
 * 
 * #La méthode
 * 
 * # 1 - Que sheetOrSheets soit un tableau un objet Sheet, faire en sort que ce ne soit plus qu'un tableau (aide toi de instanceof Array)
 * # 2 - Check de options et mettre de coté le format
 * # 3 - Si format csv, traité la partie csv (si plusieurs feuilles, lever une erreur)
 * # 3.1 - Pour transforme un string en buffer -> Buffer.from(str);
 * # 4 - Si ce n'est pas un csv ce sera forcément un tableur 'xls' | 'xlsx' | 'ods'
 * # 5 - On construit un WorkBook
 * # 6 - On ajoute chaque WorkSheet au WoorkBook avec son nom
 * # 7 - On écrit le WorkBook dans un Buffer
 * # 
 * # Je te conseile de créer une fonction sheetToWorkSheet qui converti notre Sheet en la WorkSheet attendue dans la librairie
 * # Je te conseille également de créer une fonction sheetIsArraySheet chargée de détermine si on a affaire à une ObjectSheet ou une ArraySheet 
 * 
 * 
 *  # Ce type de fonction est bien pratique car il permet de spécifier à Typescript le type parmi plusieurs grâce à la sortie "sheet is ArraySheet"
 * 
    function sheetIsArraySheet(sheet: Sheet<any>): sheet is ArraySheet {
        return (sheet as ArraySheet).cols !== undefined;
    }
 */