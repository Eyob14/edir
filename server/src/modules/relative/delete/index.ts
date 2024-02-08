import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { Relative, relativeSchema } from '@server/entities/relative'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(
    relativeSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    const relative = await db.getRepository(Relative).findOne({
      where: {
        id,
      },
    })

    if (!relative) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'relative not found',
      })
    }

    await db.getRepository(Relative).delete(id)
    return relative
  })
