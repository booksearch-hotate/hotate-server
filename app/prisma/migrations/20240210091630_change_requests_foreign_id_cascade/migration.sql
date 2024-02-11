-- DropForeignKey
ALTER TABLE `requests` DROP FOREIGN KEY `requests_ibfk_1`;

-- AddForeignKey
ALTER TABLE `requests` ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
