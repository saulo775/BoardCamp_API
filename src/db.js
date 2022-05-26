import pg from "pg";

const {Poll} = pg;

const db = new Poll(process.env.DATABASE_URL);

export default db;