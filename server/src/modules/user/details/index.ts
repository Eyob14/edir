import { User } from '@server/entities'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { userSchema } from '../../../entities/user'

export default authenticatedProcedure
  .input(
    userSchema.pick({
      id: true,
    })
  )
  .query(async ({ input: { id }, ctx: { db } }) => {
    const userDetails = (await db.getRepository(User).findOne({
      where: {
        id,
      },
      relations: ['relatives'],
    })) as User
    return userDetails
  })
