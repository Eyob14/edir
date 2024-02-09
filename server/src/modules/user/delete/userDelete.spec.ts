import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import userRouter from '..'

it('should delete a user from the database', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())

  const { deleteUser, find } = userRouter.createCaller(authContext({ db }))

  const deletedUser = await deleteUser({ id: user.id })

  const users = await find()

  expect(users).toHaveLength(0)
  expect(deletedUser).toMatchObject({
    firstName: 'eyob',
    lastName: 'zebene',
    role: 'user',
    age: 23,
    profileImage:
      'https://t4.ftcdn.net/jpg/03/64/21/11/360_F_364211147_1qgLVxv1Tcq0Ohz3FawUfrtONzz8nq3e.jpg',
    isVerified: false,
  })
})
