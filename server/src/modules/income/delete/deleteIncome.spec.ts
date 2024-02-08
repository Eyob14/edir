import { Income, User } from '@server/entities'
import {
  fakeIncome,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import materialRouter from '..'

it('should delete an income', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())

  const income = await db.getRepository(Income).save(
    fakeIncome({
      description: 'Some description',
      type: 'subscription',
      amount: 50,
    })
  )

  const { deleteIncome, find } = materialRouter.createCaller(
    authContext({ db }, user)
  )

  const deletedIncome = await deleteIncome({ id: income.id })

  const incomes = await find()

  expect(incomes).toHaveLength(0)
  expect(deletedIncome).toMatchObject({
    id: income.id,
    description: 'Some description',
    type: 'subscription',
    amount: 50,
  })
})
