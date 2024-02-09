import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { Expense } from '@server/entities'
import { expenseSchema } from '@server/entities/expense'

export default adminProcedure
  .input(
    expenseSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) =>
    db.transaction(async () => {
      const expense = await db.getRepository(Expense).findOne({
        where: {
          id,
        },
      })

      if (!expense) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'expense not found',
        })
      }
      await db.getRepository(Expense).delete(id)
      return expense
    })
  )
