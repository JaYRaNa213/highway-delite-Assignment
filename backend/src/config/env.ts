// src/config/env.ts
import dotenv from 'dotenv';
import path from 'path';

// ensure the path points to your project root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export default process.env;
