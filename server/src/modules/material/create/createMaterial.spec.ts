import { fakeAdmin } from '@server/entities/tests/fakes'
import { User } from '@server/entities/user'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import materialRouter from '..'

it('should create a new material', async () => {
  const db = await createTestDatabase()

  const adminUser = await db.getRepository(User).save(fakeAdmin())

  const { create } = materialRouter.createCaller(authContext({ db }, adminUser))

  const materialCreated = await create({
    name: 'Material 1',
    description: 'Some description',
    image: 'https://example.com/photo.jpg',
    boughtAt: new Date(),
    initialCount: 10,
  })

  expect(materialCreated).toMatchObject({
    id: expect.any(Number),
    name: 'material 1',
    description: 'Some description',
    image: 'https://example.com/photo.jpg',
    boughtAt: expect.any(Date),
    initialCount: 10,
    remainingCount: 10,
  })
})
