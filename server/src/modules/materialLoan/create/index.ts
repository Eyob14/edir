import { User } from '@server/entities'
import { Material } from '@server/entities/material'
import {
  MaterialLoan,
  materialLoanInsertSchema,
} from '@server/entities/materialLoan'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(materialLoanInsertSchema)
  .mutation(async ({ input: newMaterialLoan, ctx: { authUser, db } }) => {
    const user =
      (await db.getRepository(User).findOne({ where: { id: authUser.id } })) ??
      undefined
    const material =
      (await db
        .getRepository(Material)
        .findOne({ where: { id: newMaterialLoan.materialId } })) ?? undefined

    if (material && material.remainingCount < newMaterialLoan.countTaken) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: `Not enough ${material.name} in store`,
      })
    }
    const newMaterialLoanData = {
      reason: newMaterialLoan.reason,
      countTaken: newMaterialLoan.countTaken,
      requestedDate: newMaterialLoan.requestedDate,
      material,
      user,
    }

    const materialLoan = db
      .getRepository(MaterialLoan)
      .create(newMaterialLoanData)

    await db.getRepository(MaterialLoan).save(materialLoan)

    return materialLoan
  })
