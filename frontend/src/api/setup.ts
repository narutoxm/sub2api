/**
 * Setup API endpoints
 */
import axios from 'axios'
import { resolveHTTPOrBasePath } from '@/utils/basePath'

// Create a separate client for setup endpoints (not under /api/v1)
const SETUP_BASE_URL = resolveHTTPOrBasePath(
  (import.meta.env as unknown as { VITE_SETUP_BASE_URL?: string }).VITE_SETUP_BASE_URL,
  'setup'
).replace(/\/$/, '')

const setupClient = axios.create({
  baseURL: SETUP_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export interface SetupStatus {
  needs_setup: boolean
  step: string
}

export interface DatabaseConfig {
  host: string
  port: number
  user: string
  password: string
  dbname: string
  sslmode: string
}

export interface RedisConfig {
  host: string
  port: number
  password: string
  db: number
  enable_tls: boolean
}

export interface AdminConfig {
  email: string
  password: string
}

export interface ServerConfig {
  host: string
  port: number
  mode: string
}

export interface InstallRequest {
  database: DatabaseConfig
  redis: RedisConfig
  admin: AdminConfig
  server: ServerConfig
}

export interface InstallResponse {
  message: string
  restart: boolean
}

/**
 * Get setup status
 */
export async function getSetupStatus(): Promise<SetupStatus> {
  const response = await setupClient.get('/status')
  return response.data.data
}

/**
 * Test database connection
 */
export async function testDatabase(config: DatabaseConfig): Promise<void> {
  await setupClient.post('/test-db', config)
}

/**
 * Test Redis connection
 */
export async function testRedis(config: RedisConfig): Promise<void> {
  await setupClient.post('/test-redis', config)
}

/**
 * Perform installation
 */
export async function install(config: InstallRequest): Promise<InstallResponse> {
  const response = await setupClient.post('/install', config)
  return response.data.data
}
