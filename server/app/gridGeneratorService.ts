import { injectable } from "inversify";
import { Router, Request, Response } from "express";
import { GridCreator } from "./crossword-game/gridCreator";
import { WordPlacer } from "./crossword-game/wordPlacer";

const BLACK_CELLS: number = 45;

@injectable()
export class GridGeneratorService {

    public get routes(): Router {
        const router: Router = Router();
        const difficulty: string = "easy";
        let creator: GridCreator;
        let placer: WordPlacer;

        router.get("/service/gridgenerator/:difficulty",
                   async (req: Request, res: Response) => {
                        creator = new GridCreator();
                        placer = new WordPlacer(creator.create(BLACK_CELLS), creator.grid);
                        await placer.placeWords(difficulty, res)
                            .catch(() => {
                                res.send("sorry");
                            });
            });

        return router;
    }
}
