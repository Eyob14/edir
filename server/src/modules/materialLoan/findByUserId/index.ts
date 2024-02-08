import { MaterialLoan, materialLoanSchema } from '@server/entities/materialLoan'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure
  .input(
    materialLoanSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const materialLoans = (await db.getRepository(MaterialLoan).find({
      where: {
        user: {
          id,
        },
      },
      relations: ['material', 'user'],
      order: { requestedDate: 'DESC' },
    })) as MaterialLoan[]

    return materialLoans
  })
