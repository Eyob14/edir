import { authContext } from '@tests/utils/context'
import { fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import relativeRouter from '..'

it('should create a new relative for a user', async () => {
  // Arrange
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const { create } = relativeRouter.createCaller(authContext({ db }, user))

  // Act
  const relativeCreated = await create({
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    description: 'Some description',
    email: 'john.doe@example.com',
    relativePhoto: 'https://example.com/photo.jpg',
    type: 'child',
  })

  // Assert
  expect(relativeCreated).toMatchObject({
    id: expect.any(Number),
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    description: 'some description',
    email: 'john.doe@example.com',
    relativePhoto: 'https://example.com/photo.jpg',
    type: 'child',
  })
})

it('should throw an error if user is not found', async () => {
  // ARRANGE
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const { create } = relativeRouter.createCaller(
    authContext({ db }, user)
  )
  await db.getRepository(User).delete(user.id) // Delete user to simulate user not found

  // ACT & ASSERT
  await expect(
    create({
      firstName: 'Jane',
      lastName: 'Doe',
      age: 25,
      description: 'Another description',
      email: 'jane.doe@example.com',
      relativePhoto: 'https://example.com/photo2.jpg',
      type: 'child',
    })
  ).rejects.toThrowError('user not found')
})
