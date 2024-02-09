import { Penalty, User } from '@server/entities'
import { fakePenalty, fakeUser } from '@server/entities/tests/fakes'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import penaltyRouter from '..'

it('should return a penalty details', async () => {
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
  const { findDetails } = penaltyRouter.createCaller(authContext({ db }))

  const penaltyDetails = await findDetails({
    id: penalty.id,
  })

  // Assert
  expect(penaltyDetails).toMatchObject({
    id: expect.any(Number),
    reason: 'Some reason 1',
    amount: 50,
    paymentDate: expect.any(Date),
  })
})
