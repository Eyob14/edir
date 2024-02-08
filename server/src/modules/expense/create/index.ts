import { Material, User } from '@server/entities'
import { Expense, expenseInsertSchema } from '@server/entities/expense'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

type NewExpenseDataType = {
  amount: number
  type: string
  reason: string
  user: User | undefined
  material: Material | undefined
}

export default authenticatedProcedure
  .input(expenseInsertSchema)
  .mutation(async ({ input: newExpense, ctx: { db } }) => {
    const newExpenseData: NewExpenseDataType = {
      amount: newExpense.amount,
      type: newExpense.type,
      reason: newExpense.reason,
      user: undefined,
      material: undefined,
    }

    if (newExpense.userEmail !== null) {
      const user = await db
        .getRepository(User)
        .findOne({ where: { email: newExpense.userEmail } })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'user not found',
        })
      }
      newExpenseData.user = user
    }

    if (newExpense.materialName !== null) {
      const material = await db
        .getRepository(Material)
        .findOne({ where: { name: newExpense.materialName } })

      if (!material) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'material not found',
        })
      }
      newExpenseData.material = material
    }

    const expense = db.getRepository(Expense).create(newExpenseData)
    await db.getRepository(Expense).save(expense)
    return expense
  })
