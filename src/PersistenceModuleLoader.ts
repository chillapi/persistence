import knex from "knex";
import { ModuleConfig, ModuleLoader } from '@chillapi/api';
import { PersistenceModuleConfig } from "./PersistenceModuleConfig";

export class PersistenceModuleLoader implements ModuleLoader {

    loadModule(context: any, config: ModuleConfig) {
        context[config.id||'persistence'] = knex(config as PersistenceModuleConfig);
    }
}