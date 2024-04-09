import { type DataSourceOptions } from 'typeorm'
import bcrypt from 'bcrypt'
import createApp from './app'
import { createDatabase } from './database'
import config from './config'
import { User } from './entities/user'
import { fakeAdmin } from './entities/tests/fakes'

const database = createDatabase(config.database as DataSourceOptions)

database.initialize().then(async () => {
  const app = createApp(database)
  const adminUser = await database.getRepository(User).findOne({
    where: {
      role: 'admin',
    },
  })
  if (!adminUser) {
    const adminData = fakeAdmin({
      email: config.auth.adminEmail,
      password: config.auth.adminPassword,
    })
    adminData.password = await bcrypt.hash(
      adminData.password,
      config.auth.passwordCost
    )
    await database.getRepository(User).save(adminData)
  }
  app.listen(config.port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server is running at http://localhost:${config.port}`)
  })
})
