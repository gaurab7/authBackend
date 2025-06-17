-- DropForeignKey
ALTER TABLE "Log" DROP CONSTRAINT "Log_u_token_fkey";

-- AlterTable
ALTER TABLE "Log" ALTER COLUMN "u_token" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_u_token_fkey" FOREIGN KEY ("u_token") REFERENCES "Session"("token") ON DELETE SET NULL ON UPDATE CASCADE;
