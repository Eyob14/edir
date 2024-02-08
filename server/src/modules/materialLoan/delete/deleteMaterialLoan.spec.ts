import { Material, MaterialLoan, User } from '@server/entities'
import {
  fakeMaterial,
  fakeMaterialLoan,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import materiaLoanRouter from '..'

it('should delete a material loan', async () => {
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

  const materialLoan = await db.getRepository(MaterialLoan).save(
    fakeMaterialLoan({
      reason: 'Some reason',
      requestedDate: new Date(),
      countTaken: 1,
      material,
      user,
    })
  )

  const { deleteMaterialLoan, find } = materiaLoanRouter.createCaller(
    authContext({ db }, user)
  )

  const deletedMaterialLoan = await deleteMaterialLoan({ id: materialLoan.id })

  const materialLoans = await find()

  expect(materialLoans).toHaveLength(0)
  expect(deletedMaterialLoan).toMatchObject({
    id: materialLoan.id,
    reason: 'Some reason',
    requestedDate: expect.any(Date),
    countTaken: 1,
  })
})
