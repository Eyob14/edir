import { Penalty } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { penaltySchema } from '@server/entities/penalty'

export default authenticatedProcedure
  .input(
    penaltySchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const penalties = (await db.getRepository(Penalty).find({
      where: {
        user: {
          id,
        },
      },
    })) as Penalty[]

    return penalties
  })
