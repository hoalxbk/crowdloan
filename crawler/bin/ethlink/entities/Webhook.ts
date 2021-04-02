import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('webhook')
export class Webhook {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'contract_name', nullable: false })
  public contractName: string;

  @Column({ name: 'type', nullable: false })
  public type: string;

  @Column({ name: 'url', nullable: false })
  public url: string;
}
