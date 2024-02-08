import { Material, MaterialLoan, User } from '@server/entities'
import {
  fakeMaterial,
  fakeUser,
  fakeMaterialLoan,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import materialRouter from '..'

it('should return the details of a material', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  const material = await db.getRepository(Material).save(
    fakeMaterial({
      name: 'tent',
      initialCount: 5,
      remainingCount: 5,
      boughtAt: new Date('2021-01-01'),
      description: 'Some description',
      image: 'https://example.com/photo.jpg',
    })
  )
  await db.getRepository(MaterialLoan).save([
    fakeMaterialLoan({
      reason: 'Some reason',
      requestedDate: new Date(),
      countTaken: 1,
      materialId: material.id,
      material,
      user,
    }),
    fakeMaterialLoan({
      reason: 'Some reason',
      requestedDate: new Date(),
      countTaken: 3,
      material,
      user,
    }),
  ])
  const { details } = materialRouter.createCaller(authContext({ db }))

  const materialDetails = await details({ id: material.id })

  expect(materialDetails).toMatchObject({
    materialDetails: {
      name: 'tent',
      initialCount: 5,
      remainingCount: 5,
      boughtAt: expect.any(Date),
      description: 'Some description',
      image: 'https://example.com/photo.jpg',
    },
    materialLoans: [
      {
        reason: 'Some reason',
        requestedDate: expect.any(Date),
        countTaken: 1,
      },
      {
        reason: 'Some reason',
        requestedDate: expect.any(Date),
        countTaken: 3,
      },
    ],
  })
})
