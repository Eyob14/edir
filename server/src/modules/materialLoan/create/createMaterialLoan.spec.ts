import {
  fakeMaterial,
  fakeUser,
} from '@server/entities/tests/fakes'
import { User } from '@server/entities/user'
import { authContext } from '@tests/utils/context'
import { createTestDatabase } from '@tests/utils/database'
import { Material } from '@server/entities'
import materialLoanRouter from '..'

it('should create a new material loan', async () => {
  const db = await createTestDatabase()

  const user = await db.getRepository(User).save(fakeUser())
  const material = await db.getRepository(Material).save(
    fakeMaterial({
      name: 'tent',
      initialCount: 1,
      remainingCount: 1,
      boughtAt: new Date('2021-01-01'),
      description: 'Some description',
      image: 'https://example.com/photo.jpg',
    })
  )

  const { create } = materialLoanRouter.createCaller(authContext({ db }, user))

  const materialLoanCreated = await create({
    reason: 'Some reason',
    requestedDate: new Date(),
    countTaken: 1,
    materialId: material.id,
  })

  expect(materialLoanCreated).toMatchObject({
    id: expect.any(Number),
    reason: 'Some reason',
    requestedDate: expect.any(Date),
    countTaken: 1,
    countReturned: null,
    isReturned: false,
    isApproved: false,
    takenDate: null,
    returnedDate: null,
    description: null,
  })
})
