import { Relative, relativeInsertSchema } from '@server/entities/relative'
import { User } from '@server/entities/user'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(
    relativeInsertSchema
  )
  .mutation(
    async ({
      input: newRelative,
      ctx: { authUser, db },
    }) => {
      const user = await db
        .getRepository(User)
        .findOne({ where: { id: authUser.id } })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'user not found',
        })
      }

      const relative = db.getRepository(Relative).create({
        ...newRelative,
        user,
      })
      await db.getRepository(Relative).save(relative)
      return relative
    }
  )
