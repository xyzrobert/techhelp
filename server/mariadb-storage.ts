
import * as mariadb from 'mariadb';
import { 
  type User, type InsertUser,
  type Service, type InsertService,
  type Booking, type InsertBooking,
  type Review, type InsertReview,
  type Payment, type InsertPayment
} from '@shared/schema';

// Create a connection pool
const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST || 'localhost',
  user: process.env.MARIADB_USER || 'root',
  password: process.env.MARIADB_PASSWORD || '',
  database: process.env.MARIADB_DATABASE || 'klarfix',
  connectionLimit: 5
});

export const mariadbStorage = {
  async getConnection() {
    return await pool.getConnection();
  },
  // User operations
  async createUser(userData: InsertUser): Promise<User> {
    let conn;
    try {
      conn = await pool.getConnection();
      const skills = userData.skills ? JSON.stringify(userData.skills) : null;
      
      const result = await conn.query(`
        INSERT INTO users (username, password, name, role, bio, skills, phone_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        userData.username, 
        userData.password, 
        userData.name, 
        userData.role, 
        userData.bio || null, 
        skills,
        userData.phoneNumber || null
      ]);
      
      return {
        id: result.insertId,
        ...userData,
        isOnline: false,
        rating: 0,
        verified: false,
        showPhone: false
      } as User;
    } finally {
      if (conn) conn.release();
    }
  },

  async getUser(id: number): Promise<User | null> {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query('SELECT * FROM users WHERE id = ?', [id]);
      
      if (rows.length === 0) return null;
      
      const user = rows[0];
      return {
        id: user.id,
        username: user.username,
        password: user.password,
        name: user.name,
        role: user.role,
        bio: user.bio,
        skills: user.skills ? JSON.parse(user.skills) : null,
        isOnline: Boolean(user.is_online),
        showPhone: Boolean(user.show_phone),
        phoneNumber: user.phone_number,
        rating: user.rating,
        verified: Boolean(user.verified)
      };
    } finally {
      if (conn) conn.release();
    }
  },

  async updateUserOnlineStatus(id: number, isOnline: boolean): Promise<void> {
    let conn;
    try {
      conn = await pool.getConnection();
      await conn.query('UPDATE users SET is_online = ? WHERE id = ?', [isOnline, id]);
    } finally {
      if (conn) conn.release();
    }
  },

  async getOnlineHelpers(): Promise<User[]> {
    let conn;
    try {
      conn = await pool.getConnection();
      const rows = await conn.query(`
        SELECT * FROM users 
        WHERE role = 'helper' AND is_online = true
      `);
      
      return rows.map(row => ({
        id: row.id,
        username: row.username,
        password: row.password,
        name: row.name,
        role: row.role,
        bio: row.bio,
        skills: row.skills ? JSON.parse(row.skills) : null,
        isOnline: Boolean(row.is_online),
        showPhone: Boolean(row.show_phone),
        phoneNumber: row.phone_number,
        rating: row.rating,
        verified: Boolean(row.verified)
      }));
    } finally {
      if (conn) conn.release();
    }
  },

  // Service operations
  async createService(serviceData: InsertService): Promise<Service> {
    let conn;
    try {
      conn = await pool.getConnection();
      const result = await conn.query(`
        INSERT INTO services (title, description, category, price, helper_id)
        VALUES (?, ?, ?, ?, ?)
      `, [
        serviceData.title,
        serviceData.description,
        serviceData.category,
        serviceData.price,
        serviceData.helperId
      ]);
      
      return {
        id: result.insertId,
        ...serviceData
      } as Service;
    } finally {
      if (conn) conn.release();
    }
  },

  // Additional methods for bookings, reviews, payments
  // can be implemented following the same pattern
};
