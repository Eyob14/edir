import { User } from '@server/entities'
import { fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import userRouter from '..'

it('should return user details', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  // Act
  const { getDetails } = userRouter.createCaller(authContext({ db }))

  const userDetails = await getDetails({
    id: user.id,
  })
  // Assert
  expect(userDetails).toMatchObject({
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
