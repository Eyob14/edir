import { validates } from '@server/utils/validation'
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm'
import { z } from 'zod'
import { User } from '.'

@Entity()
export class Relative {
  @PrimaryGeneratedColumn('increment')
  id: number

  @Unique(['email'])
  @Column('text')
  email: string

  @Column('text')
  firstName: string

  @Column('text')
  lastName: string

  @Column('text')
  type: string

  @Column('int')
  age: number

  @Column('text', { nullable: true })
  description: string | null

  @Column('text')
  relativePhoto: string

  @Column('boolean', { default: false })
  isVerified: boolean

  @ManyToOne(() => User, (user) => user.relatives)
  @JoinColumn()
  user: User

  @CreateDateColumn()
  createdAt: Date

  @UpdateDateColumn()
  updatedAt: Date
}

export type RelativeBare = Omit<Relative, 'user' | 'createdAt' | 'updatedAt'>

export const relativeSchema = validates<RelativeBare>().with({
  id: z.number().int().positive(),
  email: z.string().trim().toLowerCase().email(),
  firstName: z.string().trim().min(2).max(100),
  lastName: z.string().trim().min(2).max(100),
  age: z.number().int().positive(),
  type: z.enum([
    'child',
    'mother',
    'father',
    'sibling',
    'grandparent',
    'grandchild',
    'aunt',
    'uncle',
  ]),
  description: z.string().trim().toLowerCase().min(2).nullable(),
  relativePhoto: z.string().url(),
  isVerified: z.boolean(),
})

export const relativeInsertSchema = relativeSchema.omit({
  id: true,
  isVerified: true,
})

export type RelativeInsert = z.infer<typeof relativeInsertSchema>
