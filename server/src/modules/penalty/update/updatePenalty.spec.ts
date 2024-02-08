import { Penalty, User } from '@server/entities'
import { fakePenalty, fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import penaltyRouter from '..'

it('should update a penalty', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  const penalty = await db.getRepository(Penalty).save(
    fakePenalty({
      reason: 'Some reason 1',
      amount: 50,
      paymentDate: new Date(),
      user,
    })
  )

  // Act
  const { update } = penaltyRouter.createCaller(authContext({ db }))

  const updatedPenalty = await update({
    id: penalty.id,
    amount: 80,
    reason: 'Some reason 2',
    paymentDate: penalty.paymentDate,
  })

  // Assert
  expect(updatedPenalty).toMatchObject({
    id: expect.any(Number),
    reason: 'Some reason 2',
    amount: 80,
    paymentDate: expect.any(Date),
  })
})
