import { BaseEntity, Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import Event from "./Event";

@Entity()
export default class Batch extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column("varchar")
  name!: string;

  @Column("text")
  description!: string;

  @OneToMany((_type) => Event, (event) => event.batch)
  events!: Promise<Event[]>;
}
