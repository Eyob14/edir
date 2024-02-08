import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { User } from '@server/entities'
import { fakeAdmin, fakeUser } from '@server/entities/tests/fakes'
import approvalRouter from '..'

it('should approve user', async () => {
  const db = await createTestDatabase()
  const user = await db.getRepository(User).save(fakeUser())
  const admin = await db.getRepository(User).save(fakeAdmin())

  const { approve } = approvalRouter.createCaller(authContext({ db }, admin))

  const approvedUser = await approve({
    id: user.id,
  })

  expect(approvedUser).toMatchObject({
    id: expect.any(Number),
    isVerified: true,
  })
})
