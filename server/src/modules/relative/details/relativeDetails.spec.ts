import { Relative, User } from '@server/entities'
import { fakeRelative, fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import relativeRouter from '..'

it('should return relative details', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  const relative = await db.getRepository(Relative).save(
    fakeRelative({
      firstName: 'John',
      lastName: 'Doe',
      age: 30,
      description: 'Some description',
      email: 'john.doe@example.com',
      relativePhoto: 'https://example.com/photo.jpg',
      type: 'child',
      user,
    })
  )

  // Act
  const { findDetails } = relativeRouter.createCaller(authContext({ db }))

  const relativeDetails = await findDetails({
    id: relative.id,
  })
  // Assert
  expect(relativeDetails).toMatchObject({
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
