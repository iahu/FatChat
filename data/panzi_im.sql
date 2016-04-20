/*
Navicat MySQL Data Transfer

Source Server         : mysql
Source Server Version : 50712
Source Host           : localhost:3306
Source Database       : panzi_im

Target Server Type    : MYSQL
Target Server Version : 50712
File Encoding         : 65001

Date: 2016-04-19 20:11:47
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
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `from` int(5) NOT NULL,
  `to` int(5) NOT NULL,
  `createtime` char(13) NOT NULL,
  `body` varchar(2046) NOT NULL DEFAULT '',
  `read` int(1) DEFAULT 0,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('1', '1', '2', '1461065845187', '断断续续', 0);
INSERT INTO `sessions` VALUES ('2', '1', '2', '1461066063718', '工', 0);
INSERT INTO `sessions` VALUES ('3', '1', '3', '1461066120347', '地人', 0);
INSERT INTO `sessions` VALUES ('4', '1', '2', '1461066164751', '式人', 0);
INSERT INTO `sessions` VALUES ('5', '1', '2', '1461066583154', 'aaa', 0);
INSERT INTO `sessions` VALUES ('6', '1', '2', '1461066642398', 'aaa\n', 0);
INSERT INTO `sessions` VALUES ('7', '1', '2', '1461066666165', 'aaa', 0);
INSERT INTO `sessions` VALUES ('8', '1', '2', '1461066716409', 'aaa', 0);
INSERT INTO `sessions` VALUES ('9', '1', '7', '1461066799059', 'vv', 0);
INSERT INTO `sessions` VALUES ('10', '1', '9', '1461066826249', 'vb ', 0);
INSERT INTO `sessions` VALUES ('11', '1', '6', '1461066989958', '好男儿\n', 0);
INSERT INTO `sessions` VALUES ('12', '1', '6', '1461067047830', '登录\n', 0);
INSERT INTO `sessions` VALUES ('13', '1', '3', '1461067087935', '好\n', 0);
INSERT INTO `sessions` VALUES ('14', '1', '6', '1461067108991', '好\n', 0);
INSERT INTO `sessions` VALUES ('15', '1', '6', '1461067133179', '好牛\n', 0);
INSERT INTO `sessions` VALUES ('16', '1', '2', '1461067152125', '工', 0);
INSERT INTO `sessions` VALUES ('17', '1', '6', '1461067163693', '圭', 0);
INSERT INTO `sessions` VALUES ('18', '1', '7', '1461067297111', '好男儿志在四方\n', 0);
INSERT INTO `sessions` VALUES ('19', '1', '7', '1461067359768', '好男儿志在四方\n', 0);
INSERT INTO `sessions` VALUES ('20', '1', '9', '1461067416291', '剪子\n', 0);
INSERT INTO `sessions` VALUES ('21', '1', '7', '1461067439375', '好吗\n', 0);
INSERT INTO `sessions` VALUES ('22', '1', '9', '1461067466210', '胖子，你好\n', 0);
INSERT INTO `sessions` VALUES ('23', '1', '9', '1461067469209', '在吗\n', 0);
INSERT INTO `sessions` VALUES ('24', '1', '9', '1461067477409', '回消息\n', 0);
INSERT INTO `sessions` VALUES ('25', '1', '9', '1461067490383', '真懒\n', 0);
INSERT INTO `sessions` VALUES ('26', '1', '7', '1461067542187', '你好啊，小居士\n', 0);
INSERT INTO `sessions` VALUES ('27', '1', '7', '1461067625142', '你好\n在吗\n试试多行', 0);
INSERT INTO `sessions` VALUES ('28', '1', '7', '1461067658892', '<script>alert(0)</script>', 0);

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
