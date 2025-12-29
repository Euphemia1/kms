import mysql from "mysql2/promise"

// Hardcoded database configuration for live server
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'u754414236_kms',
  password: 'Kmssarl@2025',
  database: 'u754414236_kms'
};

// Create a connection pool
const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
})

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params)
    return rows as T[]
  } catch (error) {
    console.error('❌ Database query error:', error)
    console.error('SQL:', sql)
    console.error('Params:', params)
    throw error
  }
}

export async function queryOne<T>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] || null
}

export async function execute(sql: string, params?: unknown[]) {
  try {
    const [result] = await pool.execute(sql, params)
    return result
  } catch (error) {
    console.error('❌ Database execute error:', error)
    console.error('SQL:', sql)
    console.error('Params:', params)
    throw error
  }
}

export { pool }