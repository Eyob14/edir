import { Relative } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { relativeSchema } from '@server/entities/relative'

export default authenticatedProcedure
  .input(
    relativeSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const relativeDetails = (await db.getRepository(Relative).findOne({
      where: {
        id,
      },
      relations: ['user'],
    })) as Relative
    return relativeDetails
  })
