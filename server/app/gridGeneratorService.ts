import { injectable} from "inversify";
import { Router, Request, Response } from "express";
import { GridGenerator } from "./crossword-game/grid-generator";
import { GridEntry } from "../../common/crosswordsInterfaces/word";

@injectable()
export class GridGeneratorService {

    public constructor() {}

    public get routes(): Router {
        const generator: GridGenerator = new GridGenerator();
        const router: Router = Router();
        const filledWords: GridEntry[] = [];

        router.get("/service/gridGenerator/:difficulty",
            (req: Request, res: Response) => {
                generator.placeWords(generator.generate(0, req.params.difficulty), filledWords, req.params.difficulty, "", res);
            });

        return router;

    }
}