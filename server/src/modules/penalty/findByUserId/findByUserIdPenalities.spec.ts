import { Penalty, User } from '@server/entities'
import { fakePenalty, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import penaltyRouter from '..'

it('should return a list of penalities created under the given user', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  await db.getRepository(Penalty).save([
    fakePenalty({
      reason: 'Some reason 1',
      amount: 50,
      paymentDate: new Date(),
      user,
    }),
    fakePenalty({
      reason: 'Some reason 2',
      amount: 80,
      paymentDate: new Date(),
      user,
    }),
  ])

  const { findByUserId } = penaltyRouter.createCaller(authContext({ db }, user))

  const penalties = await findByUserId({
    id: user.id,
  })

  // Assert
  expect(penalties).toHaveLength(2)
  expect(penalties[0]).toMatchObject({
    id: expect.any(Number),
    reason: 'Some reason 1',
    paymentDate: expect.any(Date),
    amount: 50,
  })
})
