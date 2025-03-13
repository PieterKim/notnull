CREATE TABLE `OrderStatuses` (
    `id` INT NOT NULL PRIMARY KEY,
    `status` VARCHAR(50) NOT NULL,
    UNIQUE KEY `status_UNIQUE` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;


INSERT INTO `OrderStatuses` (`id`, `status`) VALUES
    (1, '주문 접수'),
    (2, '결제 완료'),
    (3, '배송 준비 중'),
    (4, '배송 중'),
    (5, '배송 완료'),
    (6, '주문 취소'),
    (7, '반품 요청'),
    (8, '환불 완료');