import { Expense } from '@server/entities'
import { fakeExpense } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import expesneRouter from '..'

it('should update an expense', async () => {
  const db = await createTestDatabase()

  const expense = await db.getRepository(Expense).save(
    fakeExpense({
      reason: 'Some description',
      type: 'member payment',
      amount: 50,
    })
  )

  // Act
  const { update } = expesneRouter.createCaller(authContext({ db }))

  const updatedExpense = await update({
    id: expense.id,
    amount: 80,
    type: 'member payment',
    reason: expense.reason,
  })

  // Assert
  expect(updatedExpense).toMatchObject({
    id: expense.id,
    type: expense.type,
    amount: 80,
    reason: expense.reason,
  })
})
