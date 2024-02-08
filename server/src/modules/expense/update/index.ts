import { Expense, expenseSchema } from '@server/entities/expense'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    expenseSchema.pick({
      id: true,
      type: true,
      amount: true,
      reason: true,
    })
  )
  .mutation(async ({ input: { id, amount, reason, type }, ctx: { db } }) => {
    const existingExpense = await db
      .getRepository(Expense)
      .findOne({ where: { id } })

    if (!existingExpense) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'expense not found',
      })
    }

    existingExpense.amount = amount
    existingExpense.type = type
    existingExpense.reason = reason

    await db.getRepository(Expense).save(existingExpense)

    return existingExpense
  })
