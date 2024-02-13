-- CreateTable
CREATE TABLE `admin` (
    `id` VARCHAR(255) NOT NULL,
    `pw` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `authors` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `books` (
    `id` VARCHAR(255) NOT NULL,
    `isbn` VARCHAR(30) NULL,
    `book_name` VARCHAR(255) NOT NULL,
    `book_sub_name` VARCHAR(255) NULL,
    `author_id` VARCHAR(255) NOT NULL,
    `ndc` INTEGER NULL,
    `publisher_id` VARCHAR(255) NOT NULL,
    `year` INTEGER NULL,
    `book_content` TEXT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    INDEX `author_id`(`author_id`),
    INDEX `publisher_id`(`publisher_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `departments` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publishers` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `recommendations` (
    `id` VARCHAR(255) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `content` TEXT NOT NULL,
    `is_solid` INTEGER NOT NULL,
    `sort_index` INTEGER NOT NULL,
    `thumbnail_name` VARCHAR(200) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `requests` (
    `id` VARCHAR(255) NOT NULL,
    `book_name` VARCHAR(255) NOT NULL,
    `author_name` VARCHAR(255) NULL,
    `publisher_name` VARCHAR(255) NULL,
    `isbn` VARCHAR(255) NULL,
    `message` TEXT NULL,
    `department_id` VARCHAR(255) NOT NULL,
    `school_year` VARCHAR(100) NOT NULL,
    `school_class` VARCHAR(100) NOT NULL,
    `user_name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `department_id`(`department_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `school_grade_info` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `year` INTEGER NOT NULL,
    `school_class` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tags` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `using_recommendations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `book_id` VARCHAR(255) NOT NULL,
    `recommendation_id` VARCHAR(255) NOT NULL,
    `comment` VARCHAR(250) NULL,

    INDEX `book_id`(`book_id`),
    INDEX `recommendation_id`(`recommendation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `using_tags` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `book_id` VARCHAR(255) NOT NULL,
    `tag_id` VARCHAR(255) NOT NULL,

    INDEX `book_id`(`book_id`),
    INDEX `tag_id`(`tag_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_ibfk_1` FOREIGN KEY (`author_id`) REFERENCES `authors`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `books` ADD CONSTRAINT `books_ibfk_2` FOREIGN KEY (`publisher_id`) REFERENCES `publishers`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `requests` ADD CONSTRAINT `requests_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `departments`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `using_recommendations` ADD CONSTRAINT `using_recommendations_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `using_recommendations` ADD CONSTRAINT `using_recommendations_ibfk_2` FOREIGN KEY (`recommendation_id`) REFERENCES `recommendations`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `using_tags` ADD CONSTRAINT `using_tags_ibfk_1` FOREIGN KEY (`book_id`) REFERENCES `books`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `using_tags` ADD CONSTRAINT `using_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
