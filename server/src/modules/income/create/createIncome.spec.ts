import { fakeAdmin, fakeUser } from '@server/entities/tests/fakes'
import { User } from '@server/entities/user'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import incomeRouter from '..'

it('should create a new income', async () => {
  const db = await createTestDatabase()

  const adminUser = await db.getRepository(User).save(fakeAdmin())
  const user = await db.getRepository(User).save(fakeUser())

  const { create } = incomeRouter.createCaller(authContext({ db }, adminUser))

  const incomeCreated = await create({
    description: 'Some description',
    type: 'subscription',
    amount: 50,
    userEmail: user.email,
  })

  expect(incomeCreated).toMatchObject({
    id: expect.any(Number),
    description: 'Some description',
    type: 'subscription',
    amount: 50,
  })
})
