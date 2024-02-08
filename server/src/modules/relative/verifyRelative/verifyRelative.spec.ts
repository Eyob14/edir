import { Relative } from '@server/entities'
import { fakeAdmin, fakeRelative, fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities/user'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import relativeRouter from '..'

it('Admin should verify a relative of a user', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())
  const adminUser = await db.getRepository(User).save(fakeAdmin())

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
  ])

  const { verifyRelative } = relativeRouter.createCaller(
    authContext({ db }, adminUser)
  )

  const verifiedRelative = await verifyRelative({
    id: user.id,
  })

  expect(verifiedRelative).toMatchObject({
    id: expect.any(Number),
    isVerified: true,
    firstName: 'John',
    lastName: 'Doe',
    age: 30,
    description: 'Some description',
    email: 'john.doe@example.com',
    relativePhoto: 'https://example.com/photo.jpg',
    type: 'child',
  })
})
