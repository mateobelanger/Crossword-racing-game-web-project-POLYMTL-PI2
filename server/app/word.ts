export class Word {

    name : String;
    isCommon : boolean;
    definitions : String[];
    //length : number;
    definitionIndex : number = -1;

    constructor (name : String, frequency : String, definitions : String[]){

        this.name = name;
        this.isCommon = Number(frequency.toString().substring(2)) > 10 ;
        this.definitions = definitions;

    }

    public establishDefinitionIndex( isDifficult : boolean): number {
        
        let isFirstValidDefinition : boolean = true;

        for( let i : number = 0; i < this.definitions.length; i++){
            if( !this.isNounOrVerb(i) || this.currentDefinitionContainsWord(i) )
                continue;
            else{
                if(!isDifficult){
                    this.definitionIndex = i;
                    break;
                } else if( isFirstValidDefinition ){
                    isFirstValidDefinition = false;
                } else {
                    this.definitionIndex = i;
                    break;
                }
            } 
        }

        return this.definitionIndex;
    }

    private isNounOrVerb( definitionIndex : number): boolean {
        return this.definitions[definitionIndex].substr(0, 1) === "n" || this.definitions[definitionIndex].substr(0, 1) === "v";
    }

    private currentDefinitionContainsWord( definitionIndex : number): boolean {
            
        return this.definitions[definitionIndex].includes(this.name.toString());
        
    }
    
    
}