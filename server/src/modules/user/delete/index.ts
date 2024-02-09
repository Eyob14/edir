import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { User } from '@server/entities'
import { TRPCError } from '@trpc/server'
import { userSchema } from '@server/entities/user'

export default authenticatedProcedure
  .input(
    userSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) =>
    db.transaction(async () => {
      const user = await db.getRepository(User).findOne({
        where: {
          id,
        },
      })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'user not found',
        })
      }

      await db.getRepository(User).delete(id)
      return user
    })
  )
