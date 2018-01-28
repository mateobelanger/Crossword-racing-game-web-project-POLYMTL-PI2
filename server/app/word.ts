

export class Word {

    name : String;
    isCommon : boolean;
    definitions : String[];
    //length : number;
    //indexOfDefinition : number;

    constructor (name : String, frequency : String, definitions : String[]){

        this.name = name;
        this.isCommon = Number(frequency.toString().substring(2)) > 10 ;
        this.definitions = definitions;

    }



}