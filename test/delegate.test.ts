import { readdir, readFile } from 'fs/promises';
import path from 'path';
import knex, { Knex } from 'knex';
import { describe, expect, test } from '@jest/globals'
import yaml from 'js-yaml';
import fs from 'fs';

import { PersistenceDelegateConfig } from '../src/PersistenceDelegateConfig';
import { PersistenceDelegate } from '../src/PersistenceDelegate';
import { generateKnexMigrationFiles, removeKnexMigrationFiles } from '../src/KnexHelper';

const persistenceOptions = {
    client: "sqlite3",
    connection: {
        filename: "./testdb.sqlite"
    },
    useNullAsDefault: true,
    migrations: {
        directory: path.join(__dirname, "migrations")
    },
    seeds: {
        directory: path.join(__dirname, "seeds")
    }
};

async function setup(persistence: Knex): Promise<void> {
    console.log("Setting up migrations...");
    try {
        await generateKnexMigrationFiles(persistenceOptions.migrations.directory);
        console.log("Migration file written");
        console.log("Applying migrations...");
        await persistence.migrate.latest({ directory: persistenceOptions.migrations.directory });
        console.log("Migrations applied successfully");
        return Promise.resolve();
    } catch (err) {
        console.error(err);
        return Promise.reject(err);
    }
}

async function teardown(persistence: Knex): Promise<void> {
    try {
        console.log("Tearing down migrations...");
        await removeKnexMigrationFiles(persistenceOptions.migrations.directory);
        console.log("migration files removed");
        persistence.destroy();
        return Promise.resolve();
    } catch (err) {
        console.error(err);
        return Promise.reject(err);
    }
}

describe('Run test cases', () => {
    const files: string[] = fs.readdirSync(path.join(__dirname, 'cases'));
    const persistence = knex(persistenceOptions);

    beforeAll(() => {
        return setup(persistence);
    });

    afterAll(() => {
        return teardown(persistence);
    });

    beforeEach(() => {
        return persistence.seed.run({ directory: persistenceOptions.seeds.directory });
    })

    test.each(files)(`Use case execution -- %s`, async (useCasePath) => {
        expect.assertions(1);
        const configContent = await readFile(path.join(__dirname, 'cases', useCasePath), 'utf8');
        const useCase: any = yaml.load(configContent);
        const queryConfig: PersistenceDelegateConfig = useCase.config;
        const delegate = new PersistenceDelegate(queryConfig);
        const context = {
            getComponent: jest.fn(() => persistence),
            setComponent: jest.fn()
        };
        try {
            await delegate.process(context, useCase.params);
            if (queryConfig.setVariable) {
                expect(useCase.params[queryConfig.setVariable]).toEqual(useCase.result);
            } else {
                expect(useCase.result).toBeFalsy();
            }
        } catch (err) {
            expect(err.toString()).toEqual(useCase.error);
        }
    });
});




