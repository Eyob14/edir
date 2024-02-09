import { fakeAdmin, fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities/user'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import penaltyRouter from '..'

it('should create a new penalty', async () => {
  const db = await createTestDatabase()

  const adminUser = await db.getRepository(User).save(fakeAdmin())
  const user = await db.getRepository(User).save(fakeUser())

  const { create } = penaltyRouter.createCaller(authContext({ db }, adminUser))

  const penaltyCreated = await create({
    reason: 'Some reason',
    amount: 50,
    paymentDate: new Date(),
    userEmail: user.email,
  })
  console.log('Created', penaltyCreated)

  expect(penaltyCreated).toMatchObject({
    id: expect.any(Number),
    reason: 'Some reason',
    amount: 50,
    paymentDate: expect.any(Date),
  })
})
