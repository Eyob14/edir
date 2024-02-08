import { Income, User } from '@server/entities'
import { fakeIncome, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import incomeRouter from '..'

it('should return a list of incomes registered under the current user', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  // Act
  await db.getRepository(Income).save([
    fakeIncome({
      description: 'Some description',
      type: 'subscription',
      amount: 50,
      user,
    }),
    fakeIncome({
      description: 'Some description',
      type: 'deposit',
      amount: 500,
    }),
  ])

  const { findByUserId } = incomeRouter.createCaller(authContext({ db }, user))

  const incomes = await findByUserId({
    id: user.id
  })
  // Assert
  expect(incomes).toHaveLength(1)
  expect(incomes[0]).toMatchObject({
    id: expect.any(Number),
    description: 'Some description',
    type: 'subscription',
    amount: 50,
  })
})
