import { Material } from '@server/entities'
import { MaterialBare } from '@server/entities/material'
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure'

export default authenticatedProcedure.query(
  async ({ ctx: { db } }) => {
    const materials = (await db
      .getRepository(Material)
      .find()) as MaterialBare[]

    return materials
  }
)
