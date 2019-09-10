--# mysql -u root -p
--# Enter password: 12345Qwert

-- 创建用户
create user 'dev'@'localhost' identified by '12345Qwert';

-- 设置用户密码等级
ALTER USER 'dev'@'localhost' IDENTIFIED WITH mysql_native_password BY '12345Qwert';
FLUSH PRIVILEGES;

-- 查看用户
SELECT User, Host FROM mysql.user;

-- 创建数据库
create database if not exists sn_seller;

-- 分配权限
grant ALL on sn_seller.* to 'dev'@'localhost';

-- 查看用户权限
show grants for 'dev'@'localhost';

-- 展示所有数据库
show databases;

-- 使用数据库
use sn_seller;

-- 展示所有表
-- show tables;


-- 商户表
create table seller (
    id int(10) primary key auto_increment,
    name varchar(40) not null, -- 商户名（B2C店铺名称）20个汉字
    type int(1), -- 商户类型 enum { 1: '个人', 2: '个体工商', 3: '企业商户', 4: '平台商户' }
    mobilePhone varchar(20),
    logo varchar(20), -- 店铺logo
    accountId int(11),
    addDt timestamp,
    paymentTypes varchar(10), -- 支持的支付方式，多个`,`号隔开 enum { 1: '货到付款', 2: '支付宝', 3: '微信' }
    description varchar(400), -- 商户简介
    status int(2), -- 状态: enum { 1: '审核通过', 0: '审核失败', 2: '审核中' }
    approver varchar(30), -- 审批人
    approveDt timestamp, -- 审批时间
    unique nameIndex (name) -- name 唯一索引
) auto_increment=10001;

insert into seller (id,name,type,mobilePhone,accountId,addDt,paymentTypes,description,status) values (10000,'平台商户',4,null,1,NOW(),'1,2,3','平台商户',1);

-- O2O店铺，商家可在后台创建O2O门店，O2O库存和B2C库存独立
create table o2oShop (
    id int(10) primary key auto_increment,
);

create table enterprise (
    sellerId int(10) primary key,
    companyName varchar(200), -- 公司名称
    companyType varchar(200), -- 公司类型 (参考营业执照)
    businessLicenseType int(1), -- 营业执照类型
    businessLicensePic varchar(20), -- 营业执照图片
    businessLicenseCode varchar(20), -- 营业执照注册号
    blProvinceId int(10), -- 营业执照省
    blCityId int(10), -- 营业执照市
    blDistrictId int(10), -- 营业执照区
    blAddress varchar(20), -- 营业执照所在地
    foundingTime timestamp, -- 成立日期
    registeredCapital int(10), -- 注册资本
    businessStartDate timestamp, -- 营业期限开始时间
    businessEndDate timestamp, -- 营业期限结束时间
    businessScope varchar(200), -- 经营范围
    apName varchar(11), -- 法人姓名 (artificial person)
    apIdCardType int(1), -- 法人证件类型
    apIdCardCode varchar(20), -- 法人证件号
    apIdCardPic varchar(20), -- 法人证件图片
    apIdCardExp timestamp, -- 法人证件有效期
    orgCode varchar(20),
    orgCodePic varchar(20),
    orgStartDate timestamp, -- 组织结构有效期开始时间
    orgEndDate timestamp, -- 组织结构有效期结束时间
    taxBankLicencePic varchar(20), -- 银行开户许可证(电子版)
    taxBankRegPic varchar(20), -- 税务登记证电子版
    taxPayerType int(1), -- 纳税人类型 enum { 1: '一般纳税人', 2: '小规模纳税人' }
    genTexPayerCertPic varchar(20), -- 一般纳税人资格证电子版
    props json
);

create table person (
    sellerId int(10) primary key,
    name varchar(200),
    idCardType int(2),
    idCardCode varchar(30),
    idCardPic varchar(60),
    idCardExp timestamp,
    address varchar(300),
    isThreeInOne int(1), -- 是否三证合一
    socialCreditCode varchar(100), -- 统一社会信用代码
    businessExp timestamp, -- 营业期限
    businessLicensePic varchar(30), -- 营业执照
    props json,
    status int(2) -- 状态
);

-- 收款账号表
create table paymentAccount (
    sellerId int(10) primary key,
    alipay varchar(200)
);