import { Relative, User } from '@server/entities'
import { fakeRelative, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import relativeRouter from '..'

it('should delete a relative for a user', async () => {
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

  const { deleteRelative, find } = relativeRouter.createCaller(
    authContext({ db }, user)
  )

  const deletedRelative = await deleteRelative({ id: relative.id })

  const userRelatives = await find()

  expect(userRelatives).toHaveLength(0)
  expect(deletedRelative).toMatchObject({
    id: relative.id,
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    description: 'Some description',
    email: 'john.doe@example.com',
    relativePhoto: 'https://example.com/photo.jpg',
    type: 'child',
  })
})
