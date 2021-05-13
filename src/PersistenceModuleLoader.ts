import knex from "knex";
import { ModuleConfig, ModuleLoader } from '@chillapi/api';
import { PersistenceModuleConfig } from "./PersistenceModuleConfig";

export class PersistenceModuleLoader implements ModuleLoader {

    async loadModule(config: ModuleConfig): Promise<any> {
        return Promise.resolve(knex(config as PersistenceModuleConfig));
    }
}