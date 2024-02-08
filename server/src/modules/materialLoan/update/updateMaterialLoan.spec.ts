import { Material, MaterialLoan, User } from '@server/entities'
import {
  fakeMaterial,
  fakeMaterialLoan,
  fakeUser,
} from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import materialLoanRouter from '..'

it('should update a material loan', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())

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

  const materialLoan = await db.getRepository(MaterialLoan).save(
    fakeMaterialLoan({
      reason: 'Some reason',
      requestedDate: new Date(),
      countTaken: 1,
      material,
      user,
    })
  )

  // Act
  const { update } = materialLoanRouter.createCaller(authContext({ db }))

  const updatedMaterialLoan = await update({
    id: materialLoan.id,
    reason: 'Some other reason',
    requestedDate: materialLoan.requestedDate,
    countTaken: 1,
  })

  // Assert
  expect(updatedMaterialLoan).toMatchObject({
    id: materialLoan.id,
    reason: 'Some other reason',
    requestedDate: materialLoan.requestedDate,
    countTaken: 1,
  })
})
