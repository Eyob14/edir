import { fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities/user'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import relativeRouter from '..'

it('should return a list of users in the database', async () => {
  const db = await createTestDatabase()

  await db.getRepository(User).save([
    fakeUser(),
    fakeUser({
      password: 'Password.124!',
      firstName: 'balcha',
      lastName: 'debele',
      role: 'user',
      age: 24,
    }),
  ])

  const { find } = relativeRouter.createCaller(authContext({ db }))

  const users = await find()

  // Assert
  expect(users).toHaveLength(2)
  expect(users[1]).toMatchObject({
    id: expect.any(Number),
    firstName: 'eyob',
    lastName: 'zebene',
    role: 'user',
    age: 23,
    profileImage:
      'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
    isVerified: false,
  })
})
