import { readdir, readFile, writeFile, rm } from 'fs/promises';
import path from 'path';

const SQL_UP_PATTERN = /^(?<root>.*)\.up\.sql$/;
const KNEX_PATTERN = /^.*\.knex\.ts$/;

export async function generateKnexMigrationFiles(migrationPath: string): Promise<void> {
    try {
        const files = await readdir(migrationPath);
        for(let file of files){
            const match = file.match(SQL_UP_PATTERN);
            if(match && match.groups && match.groups.root){
                const root = match.groups.root;
                const upSQLContent = await readFile(path.join(migrationPath,file));
                const downSQLContent = await readFile(path.join(migrationPath,`${root}.down.sql`));
                const tsContent = `
                import { Knex } from 'knex';

                export async function up(knex: Knex): Promise<any> {
                    return knex.raw(\`
                        ${upSQLContent}
                    \`);
                }

                export async function down(knex: Knex): Promise<any> {
                    return knex.raw(\`
                    ${downSQLContent}
                    \`);
                }              
                `;
                await writeFile(path.join(migrationPath,`${root}.knex.ts`),tsContent);
            }
        }
    } catch (err) {
        return Promise.reject(err);
    }
    return Promise.resolve();
}

export async function removeKnexMigrationFiles(migrationPath:string):Promise<void>{
    const files = await readdir(migrationPath);
    for(let file of files){
        const match = file.match(KNEX_PATTERN);
        if(match){
            await rm(path.join(migrationPath,file));
        }
    }
}