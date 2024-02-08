import { Income, User } from '@server/entities'
import { fakeIncome, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import incomeRouter from '..'

it('should return a list of incomes', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  // Act
  await db.getRepository(Income).save([
    fakeIncome({
      description: 'Some description',
      type: 'subscription',
      amount: 50,
      user
    }),
    fakeIncome({
      description: 'Some description',
      type: 'deposit',
      amount: 500,
      user
    }),
  ])

  const { find } = incomeRouter.createCaller(authContext({ db }))

  const incomes = await find()

  // Assert
  expect(incomes).toHaveLength(2)
  expect(incomes[0]).toMatchObject({
    id: expect.any(Number),
    description: 'Some description',
    type: 'subscription',
    amount: 50,
  })
})
