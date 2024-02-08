import { MaterialLoan } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { db } }) => {
    const materialLoans = (await db
      .getRepository(MaterialLoan)
      .find(
        {
          relations: ['material', 'user'],
          order: { requestedDate: 'DESC' },
        }
      )) as MaterialLoan[]

    return materialLoans
  }
)
