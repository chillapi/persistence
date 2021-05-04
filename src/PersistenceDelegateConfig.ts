import { DelegateConfig } from "@chillapi/api";
import { Knex } from 'knex';

export interface PersistenceDelegateConfig extends DelegateConfig {
    query: string;
    params?: string[];
    returnType: 'set'|'row'|'scalar'|'none'
    setVariable?: string;
}