import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import Batch from "./Batch";

@Entity()
export default class Event extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("timestamp")
  at!: Date;

  @ManyToOne((_type) => Batch, (batch) => batch.events)
  batch!: Promise<Batch>;

  @Column("jsonb")
  data!: any;
}
