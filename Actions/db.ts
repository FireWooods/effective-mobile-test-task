import { Pool } from 'pg';

const db = new Pool({
	user: 'postgres',
	password: 'admin',
	host: 'localhost',
	port: 5432,
	database: 'actions',
});

export default db;
