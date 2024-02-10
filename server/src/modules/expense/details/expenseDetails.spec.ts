import { Expense, User } from '@server/entities'
import { fakeExpense, fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import expenseRouter from '..'

it('should return an expense details', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  const expense = await db.getRepository(Expense).save(
    fakeExpense({
      reason: 'Some reason',
      type: 'member payment',
      amount: 50,
      user,
    })
  )

  // Act
  const { findDetails } = expenseRouter.createCaller(authContext({ db }))

  const expenseDetails = await findDetails({
    id: expense.id,
  })

  // Assert
  expect(expenseDetails).toMatchObject({
    id: expect.any(Number),
    type: 'member payment',
    amount: 50,
    reason: 'Some reason',
  })
})
