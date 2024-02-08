import { Relative, relativeSchema } from '@server/entities/relative'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'
import { TRPCError } from '@trpc/server'

export default authenticatedProcedure
  .input(
    relativeSchema.pick({
      id: true,
      firstName: true,
      lastName: true,
      age: true,
      description: true,
      email: true,
      relativePhoto: true,
      type: true,
    })
  )
  .mutation(
    async ({
      input: {
        id,
        firstName,
        lastName,
        age,
        description,
        email,
        relativePhoto,
        type,
      },
      ctx: { db },
    }) => {
      const existingRelative = await db
        .getRepository(Relative)
        .findOne({ where: { id } })

      if (!existingRelative) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'relative not found',
        })
      }

      existingRelative.firstName = firstName
      existingRelative.lastName = lastName
      existingRelative.age = age
      existingRelative.description = description
      existingRelative.email = email
      existingRelative.relativePhoto = relativePhoto
      existingRelative.type = type
      existingRelative.relativePhoto = relativePhoto
      await db.getRepository(Relative).save(existingRelative)

      return existingRelative
    }
  )
