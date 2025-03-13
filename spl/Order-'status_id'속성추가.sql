ALTER TABLE `Orders`
ADD COLUMN `status_id` INT DEFAULT 1;
-- 외래 키 추가
ALTER TABLE `Orders`
ADD CONSTRAINT `FK_Orders_OrderStatuses`
FOREIGN KEY (`status_id`)
REFERENCES `OrderStatuses` (`id`)
ON DELETE SET NULL
ON UPDATE CASCADE;
