import Database from 'better-sqlite3';

// export const db = new Database('/var/guilder/test.db');
export const db = new Database('test.db');

db.prepare(
    'CREATE TABLE IF NOT EXISTS proposals (' +
    'realm_pubkey TEXT NOT NULL, ' + 
    'name TEXT NOT NULL, ' +
    'descriptionLink TEXT, ' + 
    'label TEXT, ' + 
    'draftAt INTEGER NOT NULL)'
).run();

db.prepare(
    'CREATE TABLE IF NOT EXISTS realms (' +
    'pubkey TEXT NOT NULL PRIMARY KEY, ' +
    'owner TEXT NOT NULL, ' + 
    'name TEXT NOT NULL)'
).run();

db.prepare(
    'CREATE TABLE IF NOT EXISTS notification_subscription (' +
    'mobile_token TEXT NOT NULL PRIMARY KEY, ' +
    'device_type TEXT NOT NULL, ' +
    'subscription_type TEXT NOT NULL, ' +
    'pubkey_subscribe TEXT NOT NULL, ' + 
    'name TEXT NOT NULL)'
).run();

