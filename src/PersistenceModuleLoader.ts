import knex from "knex";
import { ModuleConfig, ModuleLoader } from '@chillapi/api';
import { PersistenceModuleConfig } from "./PersistenceModuleConfig";
import { Context } from "@chillapi/api/src/chill-api/Context";

export class PersistenceModuleLoader implements ModuleLoader {

    loadModule(context: Context, config: ModuleConfig) {
        context.setComponent(config.id || 'persistence', knex(config as PersistenceModuleConfig));
    }
}