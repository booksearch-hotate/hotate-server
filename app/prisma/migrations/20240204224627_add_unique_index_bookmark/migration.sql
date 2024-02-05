/*
  Warnings:

  - A unique constraint covering the columns `[book_id,user_id]` on the table `bookmarks` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `book_id_user_id` ON `bookmarks`(`book_id`, `user_id`);
