import { injectable } from "inversify";
import { Router, Request, Response } from "express";
import { GridCreator } from "./crossword-game/gridCreator";
import { WordPlacer } from "./crossword-game/wordPlacer";

@injectable()
export class GridGeneratorService {

    public get routes(): Router {
        let creator: GridCreator;
        const router: Router = Router();
        const difficulty: string = "easy";

        router.get("/service/gridgenerator/:difficulty",
                   async (req: Request, res: Response) => {
                        creator = new GridCreator();
                        const placer: WordPlacer = new WordPlacer(creator.create(1), creator.grid);
                        await placer.placeWords(difficulty, res);
            });

        return router;

    }
}
