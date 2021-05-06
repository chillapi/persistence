import { DelegateConfig } from "@chillapi/api";

export interface PersistenceDelegateConfig extends DelegateConfig {
    query: string;
    params?: string[];
    returnType: 'set' | 'row' | 'scalar' | 'none'
    setVariable?: string;
}