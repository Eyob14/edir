import { Material, MaterialLoan, User } from '@server/entities'
import {
  fakeMaterial,
  fakeMaterialLoan,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import materialLoanRouter from '..'

it('should return a list of material loans', async () => {
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
  // Act
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

  const { find } = materialLoanRouter.createCaller(authContext({ db }))

  const materialLoans = await find()

  // Assert
  expect(materialLoans).toHaveLength(2)
  expect(materialLoans[0]).toMatchObject({
    id: expect.any(Number),
    reason: 'Some reason',
    requestedDate: expect.any(Date),
    countTaken: 1,
    countReturned: null,
    isReturned: false,
    isApproved: false,
    takenDate: null,
    returnedDate: null,
    description: null,
  })
})
