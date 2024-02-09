import { User } from '@server/entities'
import { Income, incomeInsertSchema } from '@server/entities/income'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(incomeInsertSchema)
  .mutation(async ({ input: newIncome, ctx: { db } }) =>
    db.transaction(async () => {
      const user = await db
        .getRepository(User)
        .findOne({ where: { email: newIncome.userEmail } })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'user not found',
        })
      }
      const newIncomeWithUser = {
        amount: newIncome.amount,
        type: newIncome.type,
        description: newIncome.description,
        user,
      }
      const income = db.getRepository(Income).create(newIncomeWithUser)
      await db.getRepository(Income).save(income)
      return income
    })
  )
