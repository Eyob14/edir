import { Penalty, User } from '@server/entities'
import { fakePenalty, fakeUser } from '@server/entities/tests/fakes'
import { createTestDatabase } from '@tests/utils/database'
import { authContext } from '@tests/utils/context'
import penaltyRouter from '..'

it('should delete a penalty', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())

  const penalty = await db.getRepository(Penalty).save(
    fakePenalty({
      reason: 'Some reason',
      amount: 50,
      paymentDate: new Date(),
      user,
    })
  )

  const { deletePenalty, find } = penaltyRouter.createCaller(
    authContext({ db }, user)
  )

  const deletedPenalty = await deletePenalty({ id: penalty.id })

  const penalties = await find()

  expect(penalties).toHaveLength(0)
  expect(deletedPenalty).toMatchObject({
    id: penalty.id,
    reason: 'Some reason',
    paymentDate: expect.any(Date),
    amount: 50,
  })
})
