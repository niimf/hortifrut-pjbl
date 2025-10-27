import sql from "mssql";

let pool = null;

export async function getPool() {
  if (!pool) {
    pool = new sql.ConnectionPool(process.env.AZURE_SQL_CONN);
    await pool.connect();
  }
  return pool;
}
