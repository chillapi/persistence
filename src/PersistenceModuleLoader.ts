import knex from "knex";
import { ModuleConfig, ModuleLoader, Context } from '@chillapi/api';
import { PersistenceModuleConfig } from "./PersistenceModuleConfig";

export class PersistenceModuleLoader implements ModuleLoader {

    loadModule(context: Context, config: ModuleConfig) {
        context.setComponent(config.id || 'persistence', knex(config as PersistenceModuleConfig));
    }
}