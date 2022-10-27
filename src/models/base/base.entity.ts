import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export abstract class BaseEntity {
    /*
     * Mandatory columns in all tables
     */

    @PrimaryGeneratedColumn()
    public id!: number;

    @CreateDateColumn({ type: 'timestamp' })
    public createdDate!: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    public updatedDate!: Date;

    @Column({ nullable: true })
    public createdUserId: number;

    @Column({ nullable: true })
    public updatedUserId: number;

    @Column({ type: 'smallint', default: 1 })
    public status: number;
}