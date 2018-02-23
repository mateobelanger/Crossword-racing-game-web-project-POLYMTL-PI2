import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import { Routes } from "./routes";
import { LexicalService } from "./lexicalService/lexicalService";
import { DatamuseWordFinder } from "./LexicalService/datamuseWordFinder";

import { GridGeneratorService } from "./gridGeneratorService";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.LexicalService).to(LexicalService);

container.bind(Types.Index).to(Index);
container.bind(Types.DatamuseWordFinder).to(DatamuseWordFinder);
container.bind(Types.GridGeneratorService).to(GridGeneratorService);

export { container };
