import { Relative, User } from '@server/entities'
import { fakeRelative, fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import relativeRouter from '..'

it('should update a relative', async () => {
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
  const { update } = relativeRouter.createCaller(authContext({ db }, user))

  const updatedRelative = await update({
    id: relative.id,
    firstName: 'Jane',
    type: 'child',
    email: relative.email,
    lastName: relative.lastName,
    age: relative.age,
    description: relative.description,
    relativePhoto: relative.relativePhoto
  })

  // Assert
  expect(updatedRelative).toMatchObject({
    id: relative.id,
    firstName: 'Jane',
    lastName: 'Doe',
    age: 30,
    description: 'some description',
    email: 'john.doe@example.com',
    relativePhoto: 'https://example.com/photo.jpg',
    type: 'child',
  })
})
