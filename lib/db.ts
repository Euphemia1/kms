import mysql from "mysql2/promise";

// Database configuration with specific production settings for shared hosting
const dbConfig = {
  host: process.env.DB_HOST || process.env.RDS_HOSTNAME || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.RDS_PORT || '3306'),
  user: process.env.DB_USER || process.env.RDS_USERNAME || 'u754414236_kms',
  password: process.env.DB_PASSWORD || process.env.RDS_PASSWORD || 'Kmssarl@2025',
  database: process.env.DB_NAME || process.env.RDS_DB_NAME || 'u754414236_kms'
};

// Create a connection pool with settings optimized for shared hosting
const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 5, // Reduced connection limit for shared hosting
  queueLimit: 0,
  // Shared hosting settings
  connectTimeout: 60000,
  // SSL configuration for production
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined,
  // Additional settings for shared hosting
  insecureAuth: true, // Required for some shared hosting providers
  multipleStatements: true,
  // Use legacy auth for older MySQL versions
  authPlugins: {
    mysql_clear_password: () => (pluginData: Buffer) => {
      return Buffer.from(dbConfig.password + '\0', 'utf8');
    }
  }
});

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params);
    return rows as T[];
  } catch (error: any) {
    console.error('❌ Database query error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    console.error('DB Host:', dbConfig.host);
    console.error('DB User:', dbConfig.user);
    console.error('DB Database:', dbConfig.database);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    // Don't expose sensitive information in production
    if (process.env.NODE_ENV === 'production') {
      // Log the error with basic info but throw generic error
      if (error.code === 'ECONNREFUSED') {
        console.error('Database connection refused - check host and port configuration');
        throw new Error('Database connection failed');
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('Database access denied - check username and password');
        throw new Error('Database access denied');
      } else {
        throw new Error('Database query failed');
      }
    } else {
      throw error;
    }
  }
}

export async function queryOne<T>(sql: string, params?: unknown[]): Promise<T | null> {
  const rows = await query<T>(sql, params)
  return rows[0] || null
}

export async function execute(sql: string, params?: unknown[]) {
  try {
    const [result] = await pool.execute(sql, params);
    return result;
  } catch (error: any) {
    console.error('❌ Database execute error:', error);
    console.error('SQL:', sql);
    console.error('Params:', params);
    console.error('DB Host:', dbConfig.host);
    console.error('DB User:', dbConfig.user);
    console.error('DB Database:', dbConfig.database);
    console.error('Error code:', error.code);
    console.error('Error message:', error.message);
    // Don't expose sensitive information in production
    if (process.env.NODE_ENV === 'production') {
      // Log the error with basic info but throw generic error
      if (error.code === 'ECONNREFUSED') {
        console.error('Database connection refused - check host and port configuration');
        throw new Error('Database connection failed');
      } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
        console.error('Database access denied - check username and password');
        throw new Error('Database access denied');
      } else {
        throw new Error('Database execute failed');
      }
    } else {
      throw error;
    }
  }
}

export { pool }