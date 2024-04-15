import { type DataSourceOptions } from 'typeorm'
import bcrypt from 'bcrypt'
import createApp from './app'
import { createDatabase } from './database'
import config from './config'
import { User } from './entities/user'
import { fakeAdmin } from './entities/tests/fakes'
import logger from './logger'

const database = createDatabase(config.database as DataSourceOptions)

database.initialize().then(async () => {
  logger.info('Database initialized')
  const app = createApp(database)
  logger.info('Checking for admin user...')
  const adminUser = await database.getRepository(User).findOne({
    where: {
      role: 'admin',
    },
  })
  if (!adminUser) {
    logger.info('Admin not found. Creating admin for the first time...')
    const adminData = fakeAdmin({
      email: config.auth.adminEmail,
      password: config.auth.adminPassword,
    })
    adminData.password = await bcrypt.hash(
      adminData.password,
      config.auth.passwordCost
    )
    await database.getRepository(User).save(adminData)
    logger.info('Admin is created successfully')
  } else {
    logger.info('Admin already exists')
  }
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    logger.info(`Server is running at http://localhost:${config.port}`)
  })
})
