import { Expense } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
  const expenses = (await db.getRepository(Expense).find({
    relations: ['user', 'material'],
  })) as Expense[]

  return expenses
})
