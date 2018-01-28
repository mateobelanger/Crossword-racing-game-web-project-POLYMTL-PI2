

export class Word {

    name : String;
    isCommon : boolean;
    definitions : String[];
    //length : number;
    //indexOfDefinition : number;

    constructor (name : String, frequency : number, definitions : String[]){

        this.name = name;
        this.isCommon = frequency < 10 ;
        this.definitions = definitions;

    }



}