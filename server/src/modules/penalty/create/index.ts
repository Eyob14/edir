import { User } from '@server/entities'
import { penaltyInsertSchema } from '@server/entities/penalty'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'
import { Penalty } from '../../../entities/penalty'

export default adminProcedure
  .input(penaltyInsertSchema)
  .mutation(async ({ input: newPenalty, ctx: { db } }) => {
    db.transaction(async () => {
      const user = await db
        .getRepository(User)
        .findOne({ where: { email: newPenalty.userEmail } })

      if (!user) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'user not found',
        })
      }
      const newPenaltyWithUser = {
        amount: newPenalty.amount,
        reason: newPenalty.reason,
        paymentDate: newPenalty.paymentDate,
        user,
      }
      const penalty = db.getRepository(Penalty).create(newPenaltyWithUser)
      await db.getRepository(Penalty).save(penalty)
      return penalty
    })
  })
