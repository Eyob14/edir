import { Income, User } from '@server/entities'
import { fakeIncome, fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import incomeRouter from '..'

it('should return an income details', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  const income = await db.getRepository(Income).save(
    fakeIncome({
      description: 'Some description',
      type: 'subscription',
      amount: 50,
      user,
    })
  )

  // Act
  const { findDetails } = incomeRouter.createCaller(authContext({ db }))

  const incomeDetails = await findDetails({
    id: income.id,
  })
  // Assert
  expect(incomeDetails).toMatchObject({
    id: expect.any(Number),
    type: 'subscription',
    amount: 50,
    description: 'Some description',
  })
})
