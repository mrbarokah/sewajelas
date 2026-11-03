import { DatabaseSync } from 'node:sqlite';
const sqlite=new DatabaseSync(':memory:');
sqlite.exec('CREATE TABLE studio(user_id TEXT PRIMARY KEY,revision INTEGER NOT NULL DEFAULT 0,state TEXT NOT NULL,updated_at INTEGER NOT NULL);CREATE TABLE credentials(user_id TEXT PRIMARY KEY,cipher TEXT NOT NULL,updated_at INTEGER NOT NULL);CREATE TABLE quotas(id TEXT PRIMARY KEY,count INTEGER NOT NULL DEFAULT 0,input_tokens INTEGER NOT NULL DEFAULT 0,output_tokens INTEGER NOT NULL DEFAULT 0);');
export const env = {
  APP_VAULT_KEY: 'unit-test-key-never-used-in-production',
  DB: {
    prepare(sql) {
      const statement = sqlite.prepare(sql);
      return {
        bind(...args) {
          return {
            async first() { return statement.get(...args) || null; },
            async run() { return statement.run(...args); }
          };
        }
      };
    }
  }
};
