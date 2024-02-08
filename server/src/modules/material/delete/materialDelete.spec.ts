import { Material, User } from '@server/entities'
import { fakeMaterial, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import materialRouter from '..'

it('should delete a material', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())

  const material = await db.getRepository(Material).save(
    fakeMaterial({
      name: 'Material 1',
      description: 'Some description',
      image: 'https://example.com/photo.jpg',
      boughtAt: new Date(),
      initialCount: 10,
      remainingCount: 10,
    })
  )

  const { deleteMaterial, find } = materialRouter.createCaller(
    authContext({ db }, user)
  )

  const deletedMaterial = await deleteMaterial({ id: material.id })

  const materials = await find()

  expect(materials).toHaveLength(0)
  expect(deletedMaterial).toMatchObject({
    id: material.id,
    name: 'Material 1',
    description: 'Some description',
    image: 'https://example.com/photo.jpg',
    boughtAt: material.boughtAt,
    initialCount: 10,
  })
})
