import { User } from '@server/entities'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'

export default adminProcedure.query(async ({ ctx: { db } }) => {
  const users = (await db.getRepository(User).find({
    where: {
      role: 'user',
    },
    order: { createdAt: 'DESC' },
  })) as User[]
  return users
})
