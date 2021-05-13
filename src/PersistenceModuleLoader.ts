import knex from "knex";
import { ModuleConfig, ModuleLoader, Context } from '@chillapi/api';
import { PersistenceModuleConfig } from "./PersistenceModuleConfig";

export class PersistenceModuleLoader implements ModuleLoader {

    async loadModule(context: Context, config: ModuleConfig): Promise<void> {
        context.setComponent(config.id || 'persistence', knex(config as PersistenceModuleConfig));
        return Promise.resolve();
    }
}