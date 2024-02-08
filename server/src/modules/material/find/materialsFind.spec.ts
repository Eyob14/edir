import { Material } from '@server/entities'
import { fakeMaterial } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import materialRouter from '..'

it('should return a list of materials', async () => {
  const db = await createTestDatabase()

  // Act
  await db.getRepository(Material).save([
    fakeMaterial({
      name: 'tent',
      initialCount: 1,
      boughtAt: new Date('2021-01-01'),
      description: 'Some description',
      image: 'https://example.com/photo.jpg',
      remainingCount: 1,
    }),
    fakeMaterial({
      name: 'chair',
      initialCount: 80,
      remainingCount: 80,
      boughtAt: new Date('2021-01-01'),
      description: 'Some description',
      image: 'https://example.com/photo.jpg',
    }),
  ])

  const { find } = materialRouter.createCaller(authContext({ db }))

  const materials = await find()

  // Assert
  expect(materials).toHaveLength(2)
  expect(materials[0]).toMatchObject({
    id: expect.any(Number),
    name: 'tent',
    initialCount: 1,
    boughtAt: new Date('2021-01-01'),
    description: 'Some description',
    image: 'https://example.com/photo.jpg',
  })
})
