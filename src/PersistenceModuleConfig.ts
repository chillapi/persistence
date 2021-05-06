import { Knex } from "knex";
import { ModuleConfig } from '@chillapi/api';

export interface PersistenceModuleConfig extends ModuleConfig, Knex.Config {


}