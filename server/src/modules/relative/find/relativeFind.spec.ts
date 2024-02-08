import { Relative } from '@server/entities'
import { fakeRelative, fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities/user'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import relativeRouter from '..'

it('should return a list of relatives of the user', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())

  // Act
  await db.getRepository(Relative).save([
    fakeRelative({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      description: 'Some description',
      email: 'john.doe@example.com',
      relativePhoto: 'https://example.com/photo.jpg',
      type: 'child',
      user,
    }),
    fakeRelative({
      firstName: 'Jane',
      lastName: 'Doe',
      age: 25,
      description: 'Another description',
      email: 'doe@example.com',
      relativePhoto: 'https://example.com/photo2.jpg',
      type: 'parent',
      user,
    }),
  ])

  const { find } = relativeRouter.createCaller(authContext({ db }, user))

  const userRelatives = await find()

  // Assert
  expect(userRelatives).toHaveLength(2)
  expect(userRelatives[0]).toMatchObject({
    id: expect.any(Number),
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    description: 'Some description',
    email: 'john.doe@example.com',
    relativePhoto: 'https://example.com/photo.jpg',
    type: 'child',
  })
})
