import 'dotenv/config'
import z from 'zod'

const { env } = process

if (!env.NODE_ENV) env.NODE_ENV = 'development'

const isTest = env.NODE_ENV === 'test'
const isDevTest = env.NODE_ENV === 'development' || isTest

const isInMemory = env.DB_TYPE === 'pg-mem'

const schema = z
  .object({
    env: z
      .enum(['development', 'production', 'staging', 'test'])
      .default('development'),
    isCi: z.preprocess(coerceBoolean, z.boolean().default(false)),
    port: z.coerce.number().default(3000),

    database: z.object({
      type: z
        .enum(['postgres', 'mysql', 'mariadb', 'pg-mem'])
        .default('postgres'),
      host: z.string().default('localhost'),
      port: z.coerce.number().default(5432),
      database: isInMemory ? z.string().optional() : z.string(),
      username: isInMemory ? z.string().optional() : z.string(),
      password: isInMemory ? z.string().optional() : z.string(),

      // By default, log and synchronize the database schema only for tests and development.
      ssl: z.preprocess(coerceBoolean, z.boolean().default(false)),
      logging: z.preprocess(coerceBoolean, z.boolean().default(isDevTest)),
      synchronize: z.preprocess(coerceBoolean, z.boolean().default(isDevTest)),
    }),

    auth: z.object({
      tokenKey: z.string().default(() => {
        if (isDevTest) {
          return ''
        }
        return 'c72ea80b4e166a44c83e6856089213cbe188be54fd79ef7a06c6c94e1fc024adf66af23ae41da072c4ad9623c6ea207b3a0fec5a6b8f4b5aa9b928490e52dd1b'
      }),
      expiresIn: z.string().default('7d'),
      passwordCost: z.coerce.number().default(isDevTest ? 6 : 12),
      adminEmail: z.coerce.string().email().default('admin@example.com'),
      adminPassword: z.coerce.string().default('admin123'),
    }),
  })
  .readonly()

const config = schema.parse({
  env: env.NODE_ENV,
  port: env.PORT,
  isCi: env.CI,

  auth: {
    tokenKey: env.TOKEN_KEY,
    expiresIn: env.TOKEN_EXPIRES_IN,
    passwordCost: env.PASSWORD_COST,
    adminEmail: env.ADMIN_EMAIL,
    adminPassword: env.ADMIN_PASSWORD,
  },

  database: {
    type: env.DB_TYPE,
    host: env.DB_HOST,
    port: env.DB_PORT,
    database: env.DB_NAME,
    username: env.DB_USER,
    password: env.DB_PASSWORD,
    logging: env.DB_LOGGING,
    synchronize: env.DB_SYNC,
    ssl: env.DB_SSL,
  },
})

export default config

// utility functions
function coerceBoolean(value: unknown) {
  if (typeof value === 'string') {
    return value === 'true' || value === '1'
  }

  return undefined
}
