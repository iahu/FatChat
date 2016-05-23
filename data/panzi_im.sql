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
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=83 DEFAULT CHARSET=utf8;

-- ----------------------------
-- Records of sessions
-- ----------------------------
INSERT INTO `sessions` VALUES ('1', '1', '2', '1461065845187', '断断续续', '0');
INSERT INTO `sessions` VALUES ('2', '1', '2', '1461066063718', '工', '0');
INSERT INTO `sessions` VALUES ('3', '1', '3', '1461066120347', '地人', '0');
INSERT INTO `sessions` VALUES ('4', '1', '2', '1461066164751', '式人', '0');
INSERT INTO `sessions` VALUES ('5', '1', '2', '1461066583154', 'aaa', '0');
INSERT INTO `sessions` VALUES ('6', '1', '2', '1461066642398', 'aaa\n', '0');
INSERT INTO `sessions` VALUES ('7', '1', '2', '1461066666165', 'aaa', '0');
INSERT INTO `sessions` VALUES ('8', '1', '2', '1461066716409', 'aaa', '0');
INSERT INTO `sessions` VALUES ('9', '1', '7', '1461066799059', 'vv', '0');
INSERT INTO `sessions` VALUES ('10', '1', '9', '1461066826249', 'vb ', '0');
INSERT INTO `sessions` VALUES ('11', '1', '6', '1461066989958', '好男儿\n', '0');
INSERT INTO `sessions` VALUES ('12', '1', '6', '1461067047830', '登录\n', '0');
INSERT INTO `sessions` VALUES ('13', '1', '3', '1461067087935', '好\n', '0');
INSERT INTO `sessions` VALUES ('14', '1', '6', '1461067108991', '好\n', '0');
INSERT INTO `sessions` VALUES ('15', '1', '6', '1461067133179', '好牛\n', '0');
INSERT INTO `sessions` VALUES ('16', '1', '2', '1461067152125', '工', '0');
INSERT INTO `sessions` VALUES ('17', '1', '6', '1461067163693', '圭', '0');
INSERT INTO `sessions` VALUES ('18', '1', '7', '1461067297111', '好男儿志在四方\n', '0');
INSERT INTO `sessions` VALUES ('19', '1', '7', '1461067359768', '好男儿志在四方\n', '0');
INSERT INTO `sessions` VALUES ('20', '1', '9', '1461067416291', '剪子\n', '0');
INSERT INTO `sessions` VALUES ('21', '1', '7', '1461067439375', '好吗\n', '0');
INSERT INTO `sessions` VALUES ('22', '1', '9', '1461067466210', '胖子，你好\n', '0');
INSERT INTO `sessions` VALUES ('23', '1', '9', '1461067469209', '在吗\n', '0');
INSERT INTO `sessions` VALUES ('24', '1', '9', '1461067477409', '回消息\n', '0');
INSERT INTO `sessions` VALUES ('25', '1', '9', '1461067490383', '真懒\n', '0');
INSERT INTO `sessions` VALUES ('26', '1', '7', '1461067542187', '你好啊，小居士\n', '0');
INSERT INTO `sessions` VALUES ('27', '1', '7', '1461067625142', '你好\n在吗\n试试多行', '0');
INSERT INTO `sessions` VALUES ('28', '1', '7', '1461067658892', '<script>alert(0)</script>', '0');
INSERT INTO `sessions` VALUES ('29', '1', '3', '1461144299589', '人', '0');
INSERT INTO `sessions` VALUES ('30', '1', '9', '1461145041999', '我打', '0');
INSERT INTO `sessions` VALUES ('31', '1', '9', '1461145114773', '我打', '0');
INSERT INTO `sessions` VALUES ('32', '1', '9', '1461145132139', '我错了', '0');
INSERT INTO `sessions` VALUES ('33', '1', '7', '1461145146972', '你好啊', '0');
INSERT INTO `sessions` VALUES ('34', '1', '7', '1461145283833', '式', '0');
INSERT INTO `sessions` VALUES ('35', '1', '7', '1461145415509', '最新的消息', '0');
INSERT INTO `sessions` VALUES ('36', '1', '9', '1461146619854', 'shn kfgh', '0');
INSERT INTO `sessions` VALUES ('37', '1', '3', '1461146689195', 'aaaa', '0');
INSERT INTO `sessions` VALUES ('38', '1', '3', '1461146692557', 'werwerewr', '0');
INSERT INTO `sessions` VALUES ('39', '1', '3', '1461146694497', 'adsfasfasf', '0');
INSERT INTO `sessions` VALUES ('40', '1', '3', '1461146696959', 'asfasfasdfasd', '0');
INSERT INTO `sessions` VALUES ('41', '1', '3', '1461146838501', '消息', '0');
INSERT INTO `sessions` VALUES ('42', '1', '3', '1461146907782', '大哥', '0');
INSERT INTO `sessions` VALUES ('43', '1', '3', '1461146912004', '我服了', '0');
INSERT INTO `sessions` VALUES ('44', '1', '6', '1461148329318', '邮', '0');
INSERT INTO `sessions` VALUES ('45', '1', '2', '1461148379048', '工', '0');
INSERT INTO `sessions` VALUES ('46', '1', '9', '1461148411943', '工', '0');
INSERT INTO `sessions` VALUES ('47', '1', '9', '1461148415693', '人', '0');
INSERT INTO `sessions` VALUES ('48', '1', '3', '1461148436131', '呵呵', '0');
INSERT INTO `sessions` VALUES ('49', '1', '6', '1461148601727', '高人', '0');
INSERT INTO `sessions` VALUES ('50', '1', '9', '1461148614795', '上去', '0');
INSERT INTO `sessions` VALUES ('51', '1', '9', '1461148887127', '顶上去', '0');
INSERT INTO `sessions` VALUES ('52', '1', '7', '1461149240050', '困困国\n', '0');
INSERT INTO `sessions` VALUES ('53', '1', '3', '1461149307318', '翻脸了\n', '0');
INSERT INTO `sessions` VALUES ('54', '1', '6', '1461149441900', '苦\n', '0');
INSERT INTO `sessions` VALUES ('55', '1', '3', '1461149461574', '吸', '0');
INSERT INTO `sessions` VALUES ('56', '1', '3', '1461149466883', '好吸收', '0');
INSERT INTO `sessions` VALUES ('57', '1', '3', '1461149469233', '中侃侃', '0');
INSERT INTO `sessions` VALUES ('58', '1', '2', '1461149763723', '人', '0');
INSERT INTO `sessions` VALUES ('59', '2', '1', '1461151905906', '大红门', '0');
INSERT INTO `sessions` VALUES ('60', '2', '1', '1461152798188', 'a', '0');
INSERT INTO `sessions` VALUES ('61', '2', '1', '1461152852355', 'aaa', '0');
INSERT INTO `sessions` VALUES ('62', '2', '1', '1461152867063', 'aaa', '0');
INSERT INTO `sessions` VALUES ('63', '2', '1', '1461152974566', 'haha', '0');
INSERT INTO `sessions` VALUES ('64', '2', '1', '1461153244414', 'aaa', '0');
INSERT INTO `sessions` VALUES ('65', '2', '1', '1461153256528', 'aaaaaa', '0');
INSERT INTO `sessions` VALUES ('66', '2', '1', '1461153271233', 'aaa', '0');
INSERT INTO `sessions` VALUES ('67', '2', '1', '1461153369553', 'aaaaa', '0');
INSERT INTO `sessions` VALUES ('68', '2', '1', '1461153371838', 'rwqer', '0');
INSERT INTO `sessions` VALUES ('69', '2', '1', '1461153392386', '滚啊', '0');
INSERT INTO `sessions` VALUES ('70', '2', '1', '1461153658978', '翻滚吧，阿信', '0');
INSERT INTO `sessions` VALUES ('71', '1', '9', '1461156790563', 'aaa', '0');
INSERT INTO `sessions` VALUES ('72', '1', '9', '1461156793935', 'asdfsadf', '0');
INSERT INTO `sessions` VALUES ('73', '1', '9', '1461156802855', 'asdfsdaf', '0');
INSERT INTO `sessions` VALUES ('74', '1', '2', '1461157204094', 'a', '0');
INSERT INTO `sessions` VALUES ('75', '1', '2', '1461157340412', 'todm', '0');
INSERT INTO `sessions` VALUES ('76', '1', '2', '1461157349810', '翻滚吧，除号', '0');
INSERT INTO `sessions` VALUES ('77', '1', '2', '1461157351237', '呵呵', '0');
INSERT INTO `sessions` VALUES ('78', '1', '2', '1461157352567', '哈哈中', '0');
INSERT INTO `sessions` VALUES ('79', '1', '2', '1461157354286', '只侣', '0');
INSERT INTO `sessions` VALUES ('80', '1', '2', '1461157355358', '煤', '0');
INSERT INTO `sessions` VALUES ('81', '1', '2', '1461157362262', '晓得不了', '0');
INSERT INTO `sessions` VALUES ('82', '1', '2', '1461157364298', '楞楞要', '0');

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
INSERT INTO `users` VALUES ('1', 'iahu1988@gmail.com', 'Comics-Ironman-Patriot-icon.png', '1460875143261', '白火', '61d963a67f0b1cadbe85f790b7680d70', '1', null, null);
INSERT INTO `users` VALUES ('2', 'iahu1111@yahoo.cn', 'Comics-Avengers-icon.png', '1460878849121', '火星特工', '61d963a67f0b1cadbe85f790b7680d70', '2', null, null);
INSERT INTO `users` VALUES ('3', '347006609@qq.com', 'Comics-Shadowcat-icon.png', '1460878947198', '白酒干一杯', '61d963a67f0b1cadbe85f790b7680d70', '1', null, null);
INSERT INTO `users` VALUES ('6', '983308797@qq.com', 'Comics-Spiderman-Morales-icon.png', '1460880262716', '好男儿', '61d963a67f0b1cadbe85f790b7680d70', '1', null, null);
INSERT INTO `users` VALUES ('7', '347006610@qq.com', 'Comics-Avengers-icon.png', '1460880427087', '后来居上', '61d963a67f0b1cadbe85f790b7680d70', '1', null, null);
INSERT INTO `users` VALUES ('9', '137182049@qq.com', 'Comics-Hero-Grey-icon.png', '1460902051771', '胖子', '61d963a67f0b1cadbe85f790b7680d70', '2', null, null);
