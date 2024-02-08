import { Penalty } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
  const penalties = (await db.getRepository(Penalty).find({
    relations: ['user'],
  })) as Penalty[]

  return penalties
})
