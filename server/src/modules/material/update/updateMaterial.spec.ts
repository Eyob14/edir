import { Material } from '@server/entities'
import { fakeMaterial } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import materialRouter from '..'

it('should update a material', async () => {
  const db = await createTestDatabase()

  const material = await db.getRepository(Material).save(
    fakeMaterial({
      name: 'tent',
      initialCount: 1,
      remainingCount: 1,
      boughtAt: new Date('2021-01-01'),
      description: 'Some description',
      image: 'https://example.com/photo.jpg',
    })
  )

  // Act
  const { update } = materialRouter.createCaller(authContext({ db }))

  const updatedMaterial = await update({
    id: material.id,
    name: material.name,
    initialCount: 10,
    remainingCount: 10,
    boughtAt: material.boughtAt,
    description: material.description,
    image: material.image,
  })

  // Assert
  expect(updatedMaterial).toMatchObject({
    id: material.id,
    name: material.name,
    initialCount: 10,
    remainingCount: 10,
    boughtAt: material.boughtAt,
    description: material.description,
    image: material.image,
  })
})
