import { Material, materialInsertSchema } from '@server/entities/material'
import { adminProcedure } from '@server/trpc/authenticatedProcedure'

export default adminProcedure
  .input(materialInsertSchema)
  .mutation(async ({ input: newMaterial, ctx: { db } }) => {
    const newMaterialData = {
      ...newMaterial,
      remainingCount: newMaterial.initialCount,
    }
    const material = db.getRepository(Material).create(newMaterialData)
    await db.getRepository(Material).save(material)
    return material
  })
