/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50712
Source Host           : localhost:3306
Source Database       : panzi_im

Target Server Type    : MYSQL
Target Server Version : 50712
File Encoding         : 65001

Date: 2016-04-18 19:39:24
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for friendship
-- ----------------------------
DROP TABLE IF EXISTS `friendship`;
CREATE TABLE `friendship` (
  `user_id` int(5) NOT NULL,
  `friend_id` int(5) NOT NULL DEFAULT '0',
  `mutual` int(1) NOT NULL,
  PRIMARY KEY (`user_id`,`friend_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of friendship
-- ----------------------------
INSERT INTO `friendship` VALUES ('1', '2', '0');
INSERT INTO `friendship` VALUES ('1', '3', '0');
INSERT INTO `friendship` VALUES ('1', '6', '0');
INSERT INTO `friendship` VALUES ('1', '7', '0');
INSERT INTO `friendship` VALUES ('1', '9', '0');

-- ----------------------------
-- Table structure for users
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
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES ('1', 'iahu1988@gmail.com', 'Comics-Ironman-Patriot-icon.png', '1460875143261', '白火', '61d963a67f0b1cadbe85f790b7680d70', '1', null);
INSERT INTO `users` VALUES ('2', 'iahu1111@yahoo.cn', 'Comics-Avengers-icon.png', '1460878849121', '火星特工', '61d963a67f0b1cadbe85f790b7680d70', '2', null);
INSERT INTO `users` VALUES ('3', '347006609@qq.com', 'Comics-Shadowcat-icon.png', '1460878947198', '白酒干一杯', '61d963a67f0b1cadbe85f790b7680d70', '1', null);
INSERT INTO `users` VALUES ('6', '983308797@qq.com', 'Comics-Spiderman-Morales-icon.png', '1460880262716', '好男儿', '61d963a67f0b1cadbe85f790b7680d70', '1', null);
INSERT INTO `users` VALUES ('7', '347006610@qq.com', 'Comics-Avengers-icon.png', '1460880427087', '后来居上', '61d963a67f0b1cadbe85f790b7680d70', '1', null);
INSERT INTO `users` VALUES ('9', '137182049@qq.com', 'Comics-Hero-Grey-icon.png', '1460902051771', '胖子', '61d963a67f0b1cadbe85f790b7680d70', '2', null);
