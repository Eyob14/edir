import { fakeAdmin, fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities/user'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import expenseRouter from '..'

it('should create a new expense', async () => {
  const db = await createTestDatabase()

  const adminUser = await db.getRepository(User).save(fakeAdmin())
  const user = await db.getRepository(User).save(fakeUser())

  const { create } = expenseRouter.createCaller(authContext({ db }, adminUser))

  const expenseCreated = await create({
    amount: 100,
    type: 'member payment',
    reason: 'Some reason',
    userEmail: user.email,
    materialName: null,
  })

  expect(expenseCreated).toMatchObject({
    id: expect.any(Number),
    amount: 100,
    type: 'member payment',
    reason: 'Some reason',
  })
})
