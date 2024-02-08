import { Income } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { incomeSchema } from '../../../entities/income'

export default authenticatedProcedure
  .input(
    incomeSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const incomes = (await db.getRepository(Income).find({
      where: {
        user: {
          id,
        },
      },
    })) as Income[]

    return incomes
  })
