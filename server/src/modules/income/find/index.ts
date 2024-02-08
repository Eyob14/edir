import { Income } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
  const incomes = (await db.getRepository(Income).find({
    relations: ['user'],
  })) as Income[]

  return incomes
})
