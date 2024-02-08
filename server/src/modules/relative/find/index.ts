import { User } from '@server/entities'
import { Relative } from '@server/entities/relative'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { authUser, db } }) => {
    const user = await db
      .getRepository(User)
      .findOne({ where: { id: authUser.id }, relations: ['relatives'] })
      
    if (!user) {
      throw new Error('User not found')
    }

    return user.relatives as Relative[]
  }
)
