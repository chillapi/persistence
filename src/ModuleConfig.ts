import knex, { Knex } from "knex";

export class ModuleConfig{

    private _db:Knex;

    constructor(private config: Knex.Config){
        this._db = knex(this.config);
    }

    get db():Knex{
        return this._db;
    }
}