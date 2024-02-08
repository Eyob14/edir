import { MaterialLoan, materialLoanSchema } from '@server/entities/materialLoan'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default adminProcedure
  .input(
    materialLoanSchema.pick({
      id: true,
    })
  )
  .mutation(async ({ input: { id }, ctx: { db } }) => {
    const existingMaterialLoan = await db.getRepository(MaterialLoan).findOne({
      where: {
        id,
      },
    })
    if (!existingMaterialLoan) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Material Loan',
      })
    }

    existingMaterialLoan.isApproved = true
    const currentDate: Date = new Date()
    existingMaterialLoan.takenDate = currentDate

    await db.getRepository(MaterialLoan).save(existingMaterialLoan)
    return existingMaterialLoan
  })
