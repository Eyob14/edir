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
import { User } from '.'

@Entity()
export class Penalty {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Column('decimal')
  amount: number

  @Column('text')
  reason: string

  @Column('timestamp with time zone', { nullable: true })
  paymentDate: Date | null

  @ManyToOne(() => User, (user) => user.incomes)
  @JoinColumn()
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export type PenaltyBare = Omit<Penalty, 'user' | 'createdAt' | 'updatedAt'>

export const penaltySchema = validates<PenaltyBare>().with({
  id: z.number().int().positive(),
  amount: z.number().positive(),
  reason: z.string().min(2),
  paymentDate: z.date().nullable(),
})

export const penaltyInsertSchema = penaltySchema
  .omit({
    id: true,
  })
  .extend({
    userEmail: z.string().trim().toLowerCase().email(),
  })

export type PenaltyInsert = z.infer<typeof penaltyInsertSchema>
