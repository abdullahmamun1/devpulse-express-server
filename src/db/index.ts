import { neon } from "@neondatabase/serverless";
import config from "../config";

export const sql = neon(config.connection_string);

export const initDB = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(64) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password TEXT NOT NULL,

    role VARCHAR(15) NOT NULL 
      DEFAULT 'contributor' 
      CHECK(role IN('contributor', 'maintainer')),

    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `;

  await sql`
    CREATE TABLE IF NOT EXISTS issues(
    id SERIAL PRIMARY KEY,

    title VARCHAR(150) NOT NULL,

    description TEXT NOT NULL 
      CHECK (char_length(description) >= 20),

    type VARCHAR(20) NOT NULL 
      CHECK(type IN('bug', 'feature_request' )),

    status VARCHAR(15) NOT NULL DEFAULT 'open' 
      CHECK(status IN('open', 'resolved', 'in_progress' )),

    reporter_id INT NOT NULL 
      REFERENCES users(id) ON DELETE CASCADE,
      
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    )
    `;
  console.log("Database Connected");
};
