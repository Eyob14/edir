import { validates } from '@server/utils/validation'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { z } from 'zod'
import { Material, User } from '.'

@Entity()
export class MaterialLoan {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('int')
  countTaken: number

  @Column('int', { nullable: true })
  countReturned: number | null

  @Column('boolean', { nullable: true, default: false })
  isReturned: boolean | null

  @Column('boolean', { nullable: true, default: false })
  isApproved: boolean | null

  @Column('text')
  reason: string

  @Column('text', { nullable: true })
  description: string | null

  @Column('timestamp with time zone')
  requestedDate: Date

  @Column('timestamp with time zone', { nullable: true })
  takenDate: Date | null

  @Column('timestamp with time zone', { nullable: true })
  returnedDate: Date | null

  @ManyToOne(() => Material, (material) => material.materialLoans)
  @JoinColumn()
  material: Material

  @ManyToOne(() => User, (user) => user.materialLoans)
  @JoinColumn()
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export type MaterialLoanBare = Omit<
  MaterialLoan,
  'material' | 'user' | 'createdAt' | 'updatedAt'
>

export const materialLoanSchema = validates<MaterialLoanBare>().with({
  id: z.number().int().positive(),
  countTaken: z.number().int().positive(),
  countReturned: z.number().int().positive().nullable(),
  reason: z.string(),
  isApproved: z.boolean().nullable(),
  isReturned: z.boolean().nullable(),
  description: z.string().nullable(),
  requestedDate: z.date(),
  takenDate: z.date().nullable(),
  returnedDate: z.date().nullable(),
})

// When inserting, do not include the id.
export const materialLoanInsertSchema = materialLoanSchema
  .omit({
    id: true,
    isApproved: true,
    isReturned: true,
    takenDate: true,
    returnedDate: true,
    countReturned: true,
    description: true,
  })
  .extend({
    materialId: z.number().int().positive(),
  })

export type MaterialLoanInsert = z.infer<typeof materialLoanInsertSchema>
