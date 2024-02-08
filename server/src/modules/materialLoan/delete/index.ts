import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { MaterialLoan } from '@server/entities'
import { materialLoanSchema } from '@server/entities/materialLoan'

export default authenticatedProcedure
  .input(
    materialLoanSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    const materialLoan = await db.getRepository(MaterialLoan).findOne({
      where: {
        id,
      },
    })

    if (!materialLoan) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'material loan not found',
      })
    }

    await db.getRepository(MaterialLoan).delete(id)

    return materialLoan
  })
