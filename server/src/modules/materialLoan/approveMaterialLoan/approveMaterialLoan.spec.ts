import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { Material, MaterialLoan, User } from '@server/entities'
import { fakeAdmin, fakeMaterial, fakeMaterialLoan, fakeUser } from '@server/entities/tests/fakes'
import approvalRouter from '..'

it('should approve material loan', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const admin = await db.getRepository(User).save(fakeAdmin())

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

  const { approveMaterialLoan } = approvalRouter.createCaller(
    authContext({ db }, admin)
  )

  const approvedMaterialLoan = await approveMaterialLoan({
    id: materialLoan.id,
  })

  expect(approvedMaterialLoan).toMatchObject({
    id: expect.any(Number),
    isApproved: true,
  })
})
