import { Index, Entity, Column, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';
import { Utils } from 'sota-common';

@Entity('crawl_campaign_status')
export class CrawlCampaignStatus {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column({ name: 'contract_name', nullable: false })
  public contractName: string;

  @Column('varchar', { name: 'campaign_address', nullable: true })
  public campaignAddress: string;

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
