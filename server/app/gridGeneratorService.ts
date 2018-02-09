import { injectable} from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { GridGenerator } from "./crossword-game/grid-generator";
import { GridEntry } from "./crossword-game/word";

@injectable()
export class GridGeneratorService {

    public constructor() {}

    public get routes(): Router {
        const generator: GridGenerator = new GridGenerator();
        const router: Router = Router();
        const filledWords: GridEntry[] = [];

        router.get("/service/gridGenerator/:difficulty",
            (req: Request, res: Response, next: NextFunction) => {
                generator.placeWords(generator.generate(0, "easy"), filledWords, req.params.difficulty, "", res);
            });

        return router;

    }
}