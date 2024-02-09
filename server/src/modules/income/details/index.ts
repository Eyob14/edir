import { Income } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { incomeSchema } from '../../../entities/income';

export default authenticatedProcedure
  .input(
    incomeSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const incomeDetails = (await db.getRepository(Income).findOne({
      where: {
        id,
      },
      relations: ['user'],
    })) as Income
    return incomeDetails
  })
