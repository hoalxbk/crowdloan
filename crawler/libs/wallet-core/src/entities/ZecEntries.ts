import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Utils } from 'sota-common';

@Entity('zec_entries')
export class ZecEntries {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ nullable: false })
  public txid: string;

  @Column({ nullable: false })
  public vin_index: number;

  @Column({ nullable: false })
  public vout_index: number;

  @Column({ nullable: false })
  public address: string;

  @Column({ type: 'decimal', precision: 16, scale: 8, nullable: false })
  public amount: number;
}
