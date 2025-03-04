
import * as mariadb from 'mariadb';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool
const pool = mariadb.createPool({
  host: process.env.MARIADB_HOST || 'db.tz-gaming.com',
  port: parseInt(process.env.MARIADB_PORT || '3306'),
  user: process.env.MARIADB_USER || 'u161_aKh5jybBkZ',
  password: process.env.MARIADB_PASSWORD || 'm4f!C0Vx^d7zkltPi^m^oD3r',
  database: process.env.MARIADB_DATABASE || 'u161_klarfix',
  connectionLimit: 5
});

async function setupDatabase() {
  let conn;
  try {
    conn = await pool.getConnection();
    
    // Create tables
    console.log('Creating users table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        role ENUM('helper', 'client') NOT NULL,
        bio TEXT,
        skills JSON,
        is_online BOOLEAN DEFAULT FALSE,
        show_phone BOOLEAN DEFAULT FALSE,
        phone_number VARCHAR(20),
        rating INT DEFAULT 0,
        verified BOOLEAN DEFAULT FALSE
      )
    `);

    console.log('Creating services table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category ENUM('hardware', 'software', 'network', 'mobile', 'other') NOT NULL,
        price INT NOT NULL,
        helper_id INT NOT NULL,
        FOREIGN KEY (helper_id) REFERENCES users(id)
      )
    `);

    console.log('Creating bookings table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        client_id INT NOT NULL,
        service_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        date TIMESTAMP NOT NULL,
        FOREIGN KEY (client_id) REFERENCES users(id),
        FOREIGN KEY (service_id) REFERENCES services(id)
      )
    `);

    console.log('Creating reviews table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        rating INT NOT NULL,
        comment TEXT,
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      )
    `);

    console.log('Creating payments table...');
    await conn.query(`
      CREATE TABLE IF NOT EXISTS payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        amount INT NOT NULL,
        student_amount INT NOT NULL,
        platform_amount INT NOT NULL,
        method ENUM('cash', 'online', 'other') NOT NULL,
        status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        date TIMESTAMP NOT NULL,
        FOREIGN KEY (booking_id) REFERENCES bookings(id)
      )
    `);

    console.log('Database setup completed successfully!');
    
    // Insert some test data
    console.log('Inserting test helpers...');
    await conn.query(`
      INSERT IGNORE INTO users (username, password, name, role, bio, skills)
      VALUES 
        ('techwhiz@example.com', 'test123', 'Alex Chen', 'helper', 'Computer Science student specializing in hardware repairs', '["Hardware", "Networking", "Windows"]'),
        ('netguru@example.com', 'test123', 'Sarah Smith', 'helper', 'Network security specialist and PC troubleshooter', '["Networking", "Security", "Linux"]'),
        ('codemaster@example.com', 'test123', 'James Wilson', 'helper', 'Software developer helping with programming issues', '["Programming", "Web Development", "Mobile Apps"]')
    `);

  } catch (err) {
    console.error('Error setting up database:', err);
    throw err;
  } finally {
    if (conn) conn.release();
  }
}

// Run the setup
setupDatabase()
  .then(() => {
    console.log('Database initialization completed.');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
  });
