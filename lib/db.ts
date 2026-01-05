import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || process.env.RDS_HOSTNAME || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.RDS_PORT || '3306'),
  user: process.env.DB_USER || process.env.RDS_USERNAME || 'root',
  password: process.env.DB_PASSWORD || process.env.RDS_PASSWORD || '',
  database: process.env.DB_NAME || process.env.RDS_DB_NAME || 'kms-sarl'
};

// Create a connection pool with production-ready settings
const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Production settings
  connectTimeout: 60000,
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
});

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error) {
    console.error('❌ Database query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    console.error('DB Host:', dbConfig.host);
    // Don't expose sensitive information in production
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database query failed');
    } else {
      throw error;
    }
  }
}

export async function queryOne<T>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows[0] || null;
}

export async function execute(sql: string, params?: unknown[]) {
  try {
    const [result] = await pool.execute(sql, params);
    return result;
  } catch (error) {
    console.error('❌ Database execute error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    console.error('DB Host:', dbConfig.host);
    // Don't expose sensitive information in production
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Database execute failed');
    } else {
      throw error;
    }
  }
}

export { pool };