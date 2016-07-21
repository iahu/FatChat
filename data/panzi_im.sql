/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50712
Source Host           : localhost:3306
Source Database       : panzi_im

Target Server Type    : MYSQL
Target Server Version : 50712
File Encoding         : 65001

Date: 2016-04-20 21:08:11
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for friendship
-- ----------------------------
DROP TABLE IF EXISTS `friendship`;
CREATE TABLE `friendship` (
  `user_id` int(5) NOT NULL,
  `friend_id` int(5) NOT NULL,
  `mutual` int(1) DEFAULT 0,
  `createtime` char(13) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of friendship
-- ----------------------------
INSERT INTO `friendship` VALUES ('1', '2', '0', '1461065845187');
INSERT INTO `friendship` VALUES ('1', '3', '0', '1461065845187');
INSERT INTO `friendship` VALUES ('1', '6', '0', '1461065845187');
INSERT INTO `friendship` VALUES ('1', '7', '0', '1461065845187');
INSERT INTO `friendship` VALUES ('1', '9', '0', '1461065845187');
INSERT INTO `friendship` VALUES ('2', '1', '0', '1461065845187');
INSERT INTO `friendship` VALUES ('2', '6', '0', '1461065845187');
INSERT INTO `friendship` VALUES ('2', '9', '0', '1461065845187');

-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `from` int(5) NOT NULL,
  `to` int(5) NOT NULL,
  `createtime` char(13) NOT NULL,
  `body` varchar(2046) NOT NULL DEFAULT '',
  `read` int(1) DEFAULT '0',
  `type` int(1) DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sessions
-- ----------------------------

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
  `signature` varchar(128) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of users
-- ----------------------------

