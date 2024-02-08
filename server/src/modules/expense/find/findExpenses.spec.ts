import { Expense, Material, User } from '@server/entities'
import {
  fakeExpense,
  fakeMaterial,
  fakeUser,
} from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import expenseRouter from '..'

it('should return a list of expenses', async () => {
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
  await db.getRepository(Expense).save([
    fakeExpense({
      reason: 'Some description',
      type: 'member payment',
      amount: 50,
      user,
    }),
    fakeExpense({
      reason: 'Some description',
      type: 'material cost',
      amount: 500,
      material,
    }),
  ])

  const { find } = expenseRouter.createCaller(authContext({ db }))

  const expenses = await find()

  // Assert
  expect(expenses).toHaveLength(2)
})
