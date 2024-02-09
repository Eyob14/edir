import { Penalty } from '@server/entities'
import { penaltySchema } from '@server/entities/penalty'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(
    penaltySchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const penaltyDetails = (await db.getRepository(Penalty).findOne({
      where: {
        id,
      },
      relations: ['user'],
    })) as Penalty
    return penaltyDetails
  })
