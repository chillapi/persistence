import { Delegate } from '@chillapi/api';
import { Knex } from 'knex';
import { PersistenceDelegateConfig } from './PersistenceDelegateConfig';
import { get } from 'lodash';

export class PersistenceDelegate implements Delegate {

    constructor(private config: PersistenceDelegateConfig) {
    }

    async process(context: any, delegateParams: any): Promise<void> {
        const queryParams = this.config.params ?
            this.config.params.map(param => get(delegateParams,param)) : [];
        try {
            const queryResult: any[] = await (context.persistence as Knex).raw(this.config.query, queryParams);
            let result;
            switch (this.config.returnType) {
                case 'row':
                    if (queryResult.length !== 1) {
                        return Promise.reject("Expected single row result");
                    }
                    result = queryResult[0];
                    break;
                case 'scalar':
                    if (queryResult.length !== 1) {
                        return Promise.reject("Expected scalar result, multiple rows returned");
                    }
                    const row = queryResult[0];
                    if (Object.keys(row).length !== 1) {
                        return Promise.reject("Expected scalar result, multiple columns returned");
                    }
                    result = Object.values(row)[0];
                case 'set':
                default:
                    result = queryResult;
            }
            if (this.config.setVariable) {
                delegateParams[this.config.setVariable] = result;
            } else {
                console.warn("Query returned result that was not assigned to a variable");
            }
            Promise.resolve();
        } catch (err) {
            return Promise.reject(err);
        }
    }

}