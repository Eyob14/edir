import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { Penalty } from '@server/entities'
import { penaltySchema } from '@server/entities/penalty'

export default adminProcedure
  .input(
    penaltySchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) =>
    db.transaction(async () => {
      const penalty = await db.getRepository(Penalty).findOne({
        where: {
          id,
        },
      })

      if (!penalty) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'penalty not found',
        })
      }
      await db.getRepository(Penalty).delete(id)
      return penalty
    })
  )
