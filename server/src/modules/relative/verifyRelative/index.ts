import { Relative, relativeSchema } from '@server/entities/relative'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    relativeSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    const existingRelative = await db
      .getRepository(Relative)
      .findOne({ where: { id } })
    if (!existingRelative) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'relative not found',
      })
    }
    existingRelative.isVerified = true
    await db.getRepository(Relative).save(existingRelative)
    return existingRelative
  })
