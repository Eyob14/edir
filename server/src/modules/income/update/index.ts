import { Income, incomeSchema } from '@server/entities/income'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    incomeSchema.pick({
      id: true,
      type: true,
      amount: true,
      description: true,
    })
  )
  .mutation(
    async ({ input: { id, amount, description, type }, ctx: { db } }) => {
      const existingIncome = await db
        .getRepository(Income)
        .findOne({ where: { id } })

      if (!existingIncome) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'income not found',
        })
      }

      existingIncome.amount = amount
      existingIncome.type = type
      existingIncome.description = description

      await db.getRepository(Income).save(existingIncome)

      return existingIncome
    }
  )
