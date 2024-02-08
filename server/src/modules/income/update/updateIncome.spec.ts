import { Income } from '@server/entities'
import { fakeIncome } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import incomeRouter from '..'

it('should update an income', async () => {
  const db = await createTestDatabase()

  const income = await db.getRepository(Income).save(
    fakeIncome({
      description: 'Some description',
      type: 'subscription',
      amount: 50,
    })
  )

  // Act
  const { update } = incomeRouter.createCaller(authContext({ db }))

  const updatedIncome = await update({
    id: income.id,
    amount: 80,
    type: 'subscription',
    description: income.description,
  })

  // Assert
  expect(updatedIncome).toMatchObject({
    id: income.id,
    type: income.type,
    amount: 80,
    description: income.description,
  })
})
