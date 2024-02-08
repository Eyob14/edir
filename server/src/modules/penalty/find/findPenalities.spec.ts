import { Penalty, User } from '@server/entities'
import { fakePenalty, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import penaltyRouter from '..'

it('should return a list of penalties', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())

  // Act
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

  const { find } = penaltyRouter.createCaller(authContext({ db }))

  const penalities = await find()

  // Assert
  expect(penalities).toHaveLength(2)
  expect(penalities[0]).toMatchObject({
    id: expect.any(Number),
    reason: 'Some reason 1',
    paymentDate: expect.any(Date),
    amount: 50,
  })
})
