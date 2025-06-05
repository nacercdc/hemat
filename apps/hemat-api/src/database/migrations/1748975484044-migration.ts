import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1748975484044 implements MigrationInterface {
    name = 'Migration1748975484044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."assessments_status_enum" RENAME TO "assessments_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."assessments_status_enum" AS ENUM('draft', 'pending', 'ready', 'in_progress', 'closed', 'completed')`);
        await queryRunner.query(`ALTER TABLE "assessments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "assessments" ALTER COLUMN "status" TYPE "public"."assessments_status_enum" USING "status"::"text"::"public"."assessments_status_enum"`);
        await queryRunner.query(`ALTER TABLE "assessments" ALTER COLUMN "status" SET DEFAULT 'draft'`);
        await queryRunner.query(`DROP TYPE "public"."assessments_status_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."dashboard_assessmentstatus_enum" RENAME TO "dashboard_assessmentstatus_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."dashboard_assessmentstatus_enum" AS ENUM('draft', 'pending', 'ready', 'in_progress', 'closed', 'completed')`);
        await queryRunner.query(`ALTER TABLE "dashboard" ALTER COLUMN "assessmentStatus" TYPE "public"."dashboard_assessmentstatus_enum" USING "assessmentStatus"::"text"::"public"."dashboard_assessmentstatus_enum"`);
        await queryRunner.query(`DROP TYPE "public"."dashboard_assessmentstatus_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."dashboard_assessmentstatus_enum_old" AS ENUM('DRAFT', 'PENDING', 'READY', 'in_progress', 'CLOSED', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "dashboard" ALTER COLUMN "assessmentStatus" TYPE "public"."dashboard_assessmentstatus_enum_old" USING "assessmentStatus"::"text"::"public"."dashboard_assessmentstatus_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."dashboard_assessmentstatus_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."dashboard_assessmentstatus_enum_old" RENAME TO "dashboard_assessmentstatus_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."assessments_status_enum_old" AS ENUM('DRAFT', 'PENDING', 'READY', 'in_progress', 'CLOSED', 'COMPLETED')`);
        await queryRunner.query(`ALTER TABLE "assessments" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "assessments" ALTER COLUMN "status" TYPE "public"."assessments_status_enum_old" USING "status"::"text"::"public"."assessments_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "assessments" ALTER COLUMN "status" SET DEFAULT 'DRAFT'`);
        await queryRunner.query(`DROP TYPE "public"."assessments_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."assessments_status_enum_old" RENAME TO "assessments_status_enum"`);
    }

}
