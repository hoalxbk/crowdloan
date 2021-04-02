import { Index, Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Utils } from 'sota-common';

@Entity('crawl_status')
export class CrawlStatus {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'contract_name', nullable: false })
  public contractName: string;

  @Column({ name: 'block_number', nullable: false })
  public blockNumber: number;

  @Column({ name: 'created_at', type: 'bigint' })
  public createdAt: number;

  @Column({ name: 'updated_at', type: 'bigint' })
  public updatedAt: number;

  @BeforeInsert()
  public updateCreateDates() {
    this.createdAt = Utils.nowInMillis();
    this.updatedAt = Utils.nowInMillis();
  }

  @BeforeUpdate()
  public updateUpdateDates() {
    this.updatedAt = Utils.nowInMillis();
  }
}
