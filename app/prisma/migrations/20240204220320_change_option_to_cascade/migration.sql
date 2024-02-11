-- DropForeignKey
ALTER TABLE `bookmarks` DROP FOREIGN KEY `bookmarks_ibfk_1`;

-- DropForeignKey
ALTER TABLE `bookmarks` DROP FOREIGN KEY `bookmarks_ibfk_2`;

-- DropForeignKey
ALTER TABLE `using_recommendations` DROP FOREIGN KEY `using_recommendations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `using_recommendations` DROP FOREIGN KEY `using_recommendations_ibfk_2`;

-- DropForeignKey
ALTER TABLE `using_tags` DROP FOREIGN KEY `using_tags_ibfk_1`;

-- DropForeignKey
ALTER TABLE `using_tags` DROP FOREIGN KEY `using_tags_ibfk_2`;

-- AddForeignKey
ALTER TABLE `using_recommendations` ADD CONSTRAINT `using_recommendations_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `using_recommendations` ADD CONSTRAINT `using_recommendations_ibfk_2` FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `using_tags` ADD CONSTRAINT `using_tags_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `using_tags` ADD CONSTRAINT `using_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `bookmarks` ADD CONSTRAINT `bookmarks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
