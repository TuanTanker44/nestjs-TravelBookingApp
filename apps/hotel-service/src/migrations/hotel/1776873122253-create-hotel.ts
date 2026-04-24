import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateHotel1776873122253 implements MigrationInterface {
    name = 'CreateHotel1776873122253'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`locations\` DROP FOREIGN KEY \`fk_location_hotel\``);
        await queryRunner.query(`DROP INDEX \`idx_city\` ON \`hotels\``);
        await queryRunner.query(`DROP INDEX \`idx_country\` ON \`hotels\``);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`status\` varchar(20) NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`rating_avg\` \`rating_avg\` float NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`rating_count\` \`rating_count\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP COLUMN \`price_min\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD \`price_min\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP COLUMN \`price_max\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD \`price_max\` float NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD \`status\` varchar(20) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`created_at\` \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`updated_at\` \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`updated_at\` \`updated_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`created_at\` \`created_at\` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP COLUMN \`price_max\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD \`price_max\` decimal(10,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` DROP COLUMN \`price_min\``);
        await queryRunner.query(`ALTER TABLE \`hotels\` ADD \`price_min\` decimal(10,2) NULL`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`rating_count\` \`rating_count\` int NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`hotels\` CHANGE \`rating_avg\` \`rating_avg\` float(12) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE \`locations\` DROP COLUMN \`status\``);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD \`status\` enum ('ACTIVE', 'INACTIVE') NOT NULL`);
        await queryRunner.query(`CREATE INDEX \`idx_country\` ON \`hotels\` (\`country\`)`);
        await queryRunner.query(`CREATE INDEX \`idx_city\` ON \`hotels\` (\`city\`)`);
        await queryRunner.query(`ALTER TABLE \`locations\` ADD CONSTRAINT \`fk_location_hotel\` FOREIGN KEY (\`hotel_id\`) REFERENCES \`hotels\`(\`id\`) ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
