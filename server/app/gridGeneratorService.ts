import { injectable } from "inversify";
import { Router, Request, Response } from "express";
import { GridGenerator } from "./crossword-game/gridGenerator";
import { GridEntry } from "./crossword-game/GridEntry";

@injectable()
export class GridGeneratorService {

    public get routes(): Router {
        let generator: GridGenerator;
        let filledWords: GridEntry[];
        const router: Router = Router();

        router.get("/service/gridgenerator/:difficulty",
                   (req: Request, res: Response) => {
                        generator = new GridGenerator();
                        filledWords = [];
                        generator.placeWords(generator.generate(4, req.params.difficulty), filledWords, req.params.difficulty, res)
                            .catch(() =>{ console.log("fail");});
            });

        return router;

    }
}