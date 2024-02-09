import { Expense } from '@server/entities'
import { expenseSchema } from '@server/entities/expense'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(
    expenseSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const expenseDetails = (await db.getRepository(Expense).findOne({
      where: {
        id,
      },
      relations: ['user', 'material'],
    })) as Expense
    return expenseDetails
  })
