import { validates } from '@server/utils/validation'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { z } from 'zod'
import { Expense, MaterialLoan } from '.'

@Entity()
export class Material {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('text')
  name: string

  @Column('int')
  initialCount: number

  @Column('int')
  remainingCount: number

  @Column('text', { nullable: true })
  image: string | null

  @Column('text', { nullable: true })
  description: string | null

  @Column('timestamp with time zone', { nullable: true })
  boughtAt: Date

  @OneToMany(() => Expense, (expense) => expense.material, {
    cascade: ['insert'],
  })
  expenses: Expense[]

  @OneToMany(() => MaterialLoan, (materialLoan) => materialLoan.material, {
    cascade: ['insert'],
  })
  materialLoans: MaterialLoan[]

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export type MaterialBare = Omit<
  Material,
  'expenses' | 'materialLoans' | 'createdAt' | 'updatedAt'
>

export const materialSchema = validates<MaterialBare>().with({
  id: z.number().int().positive(),
  initialCount: z.number().int().positive(),
  remainingCount: z.number().int().positive(),
  name: z.string().toLowerCase().min(1),
  description: z.string().nullable(),
  boughtAt: z.date(),
  image: z.string().nullable(),
})

// When inserting, do not include the id.
export const materialInsertSchema = materialSchema
  .omit({
    id: true,
    remainingCount: true,
  })
  .extend({
    description: materialSchema.shape.description.default(null),
    image: materialSchema.shape.image.default(null),
  })

export type MaterialInsert = z.infer<typeof materialInsertSchema>
