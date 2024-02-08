import { Expense, User } from '@server/entities'
import { fakeAdmin, fakeExpense } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import materialRouter from '..'

it('should delete an expense', async () => {
  const db = await createTestDatabase()

  const adminUser = await db.getRepository(User).save(fakeAdmin())

  const expense = await db.getRepository(Expense).save(
    fakeExpense({
      reason: 'Some reason',
      type: 'subscription',
      amount: 50,
    })
  )

  const { deleteIncome, find } = materialRouter.createCaller(
    authContext({ db }, adminUser)
  )

  const deletedExpense = await deleteIncome({ id: expense.id })

  const expenses = await find()

  expect(expenses).toHaveLength(0)
  expect(deletedExpense).toMatchObject({
    id: expense.id,
    reason: 'Some reason',
    type: 'subscription',
    amount: 50,
  })
})
