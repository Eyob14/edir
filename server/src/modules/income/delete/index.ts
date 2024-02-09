import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { incomeSchema } from '@server/entities/income'
import { Income } from '@server/entities'

export default adminProcedure
  .input(
    incomeSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) =>
    db.transaction(async () => {
      const income = await db.getRepository(Income).findOne({
        where: {
          id,
        },
      })

      if (!income) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'income not found',
        })
      }
      await db.getRepository(Income).delete(id)
      return income
    })
  )
