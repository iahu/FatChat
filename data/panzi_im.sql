/*
 Navicat MySQL Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50710
 Source Host           : localhost
 Source Database       : panzi_im

 Target Server Type    : MySQL
 Target Server Version : 50710
 File Encoding         : utf-8

 Date: 04/17/2016 23:26:07 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `friendship`
-- ----------------------------
DROP TABLE IF EXISTS `friendship`;
CREATE TABLE `friendship` (
  `id` int(5) NOT NULL,
  `user_id` int(5) DEFAULT NULL,
  `friend_id` int(5) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
--  Table structure for `users`
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(5) NOT NULL AUTO_INCREMENT,
  `email` varchar(64) DEFAULT NULL,
  `avatar` varchar(128) DEFAULT NULL,
  `createtime` char(13) DEFAULT NULL,
  `nickname` varchar(64) DEFAULT NULL,
  `password` varchar(32) DEFAULT NULL,
  `gender` char(1) DEFAULT NULL,
  `birthday` char(16) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
--  Records of `users`
-- ----------------------------
BEGIN;
INSERT INTO `users` VALUES ('1', 'iahu1988@gmail.com', 'Comics-Ironman-Patriot-icon.png', '1460875143261', '白火', '61d963a67f0b1cadbe85f790b7680d70', '1', null), ('2', 'iahu1111@yahoo.cn', 'Comics-Avengers-icon.png', '1460878849121', '火星特工', '61d963a67f0b1cadbe85f790b7680d70', '2', null), ('3', '347006609@qq.com', 'Comics-Shadowcat-icon.png', '1460878947198', '白酒干一杯', '61d963a67f0b1cadbe85f790b7680d70', '1', null), ('6', '983308797@qq.com', 'Comics-Spiderman-Morales-icon.png', '1460880262716', '好男儿', '61d963a67f0b1cadbe85f790b7680d70', '1', null), ('7', '347006610@qq.com', 'Comics-Avengers-icon.png', '1460880427087', '后来居上', '61d963a67f0b1cadbe85f790b7680d70', '1', null), ('9', '137182049@qq.com', 'Comics-Hero-Grey-icon.png', '1460902051771', '胖子', '61d963a67f0b1cadbe85f790b7680d70', '2', null);
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
