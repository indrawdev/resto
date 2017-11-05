-- phpMyAdmin SQL Dump
-- version 4.6.5.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 05, 2017 at 04:53 PM
-- Server version: 10.1.21-MariaDB
-- PHP Version: 7.1.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `resto`
--

-- --------------------------------------------------------

--
-- Table structure for table `captcha`
--

CREATE TABLE `captcha` (
  `captcha_id` bigint(13) UNSIGNED NOT NULL,
  `captcha_time` int(10) UNSIGNED NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `word` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `captcha`
--

INSERT INTO `captcha` (`captcha_id`, `captcha_time`, `ip_address`, `word`) VALUES
(4, 1509872138, '::1', 'QCP'),
(5, 1509872213, '::1', 'MDU'),
(6, 1509872837, '::1', 'UNV'),
(7, 1509872845, '::1', 'QOP'),
(8, 1509872849, '::1', 'GMH'),
(9, 1509872853, '::1', 'PRX'),
(10, 1509872859, '::1', 'QUS'),
(11, 1509872868, '::1', 'WYU'),
(12, 1509875536, '::1', 'IKM'),
(13, 1509875588, '::1', 'CXG');

-- --------------------------------------------------------

--
-- Table structure for table `ci_sessions`
--

CREATE TABLE `ci_sessions` (
  `id` varchar(128) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  `timestamp` int(10) UNSIGNED NOT NULL DEFAULT '0',
  `data` blob NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ci_sessions`
--

INSERT INTO `ci_sessions` (`id`, `ip_address`, `timestamp`, `data`) VALUES
('c6ffhmg5o5ijcdkpaclll6qcg0pah9me', '::1', 1509859113, 0x5f5f63695f6c6173745f726567656e65726174657c693a313530393835393131323b766370747c643a313530393835393131343b),
('g0ajbqmdt8jrjf20d31jroui1jorr392', '::1', 1509875588, 0x5f5f63695f6c6173745f726567656e65726174657c693a313530393837353538373b766370747c643a313530393837353538383b),
('puk80ju1usj1b9qta0ls47e9vt4mj6sf', '::1', 1509820552, 0x5f5f63695f6c6173745f726567656e65726174657c693a313530393832303437313b);

-- --------------------------------------------------------

--
-- Table structure for table `config_email`
--

CREATE TABLE `config_email` (
  `email_id` int(1) NOT NULL,
  `category` varchar(1) NOT NULL,
  `smtp_user` varchar(50) NOT NULL,
  `smtp_pass` varchar(30) NOT NULL,
  `smtp_host` varchar(50) NOT NULL,
  `smtp_crypto` varchar(10) NOT NULL,
  `smtp_port` varchar(5) NOT NULL,
  `smtp_timeout` varchar(1) NOT NULL,
  `protocol` varchar(4) NOT NULL,
  `mailtype` varchar(8) DEFAULT NULL,
  `charset` varchar(8) NOT NULL,
  `status` set('1','0') NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tb_log`
--

CREATE TABLE `tb_log` (
  `log_time` timestamp NOT NULL DEFAULT '0000-00-00 00:00:00',
  `log_name` varchar(15) NOT NULL,
  `log_user` varchar(15) NOT NULL,
  `log_message` varchar(200) NOT NULL,
  `ip_address` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tb_log`
--

INSERT INTO `tb_log` (`log_time`, `log_name`, `log_user`, `log_message`, `ip_address`) VALUES
('2017-11-05 08:58:29', 'LOGIN', 'INDRA', 'MASUK KE SISTEM RESTO', '::1'),
('2017-11-05 09:07:15', 'LOGOUT', 'INDRA', 'KELUAR DARI SISTEM RESTO', '::1'),
('2017-11-05 09:52:24', 'LOGIN', 'INDRA', 'MASUK KE SISTEM RESTO', '::1'),
('2017-11-05 09:53:06', 'LOGOUT', 'INDRA', 'KELUAR DARI SISTEM RESTO', '::1');

-- --------------------------------------------------------

--
-- Table structure for table `tg_menu`
--

CREATE TABLE `tg_menu` (
  `id_menu` int(6) NOT NULL,
  `fs_group` int(6) NOT NULL DEFAULT '0',
  `fs_kd_comp` varchar(10) NOT NULL,
  `fs_kd_parent` varchar(10) NOT NULL,
  `fs_kd_child` varchar(10) NOT NULL,
  `fs_nm_menu` varchar(50) NOT NULL,
  `fs_nm_form` varchar(50) NOT NULL,
  `fb_root` int(1) NOT NULL,
  `fs_nm_formweb` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tg_menu`
--

INSERT INTO `tg_menu` (`id_menu`, `fs_group`, `fs_kd_comp`, `fs_kd_parent`, `fs_kd_child`, `fs_nm_menu`, `fs_nm_form`, `fb_root`, `fs_nm_formweb`) VALUES
(1, 0, 'RESTO', '1', '', 'TRANSAKSI', '0', 1, '0'),
(2, 0, 'RESTO', '1', '200', 'Dashboard', '0', 1, 'dashboard'),
(3, 0, 'RESTO', '1', '201', 'Order', '0', 1, 'order'),
(4, 0, 'RESTO', '1', '202', 'History', '0', 1, 'history'),
(5, 0, 'RESTO', '5', '', 'MASTER', '0', 1, '0'),
(6, 0, 'RESTO', '5', '300', 'Master Menu & Harga', '0', 1, 'masterharga'),
(7, 0, 'RESTO', '5', '301', 'Master Pelayan  / User', '0', 1, 'masteruser'),
(8, 0, 'RESTO', '5', '302', 'Master Pembayaran', '0', 1, 'masterpembayaran'),
(9, 0, 'RESTO', '5', '303', 'Master Referensi', '0', 1, 'masterreferensi'),
(10, 0, 'RESTO', '10', '', 'UTILITY', '0', 1, '0'),
(11, 0, 'RESTO', '10', '400', 'Change Password', '0', 1, 'changepass');

-- --------------------------------------------------------

--
-- Table structure for table `tm_menu`
--

CREATE TABLE `tm_menu` (
  `fs_kode_menu` varchar(5) NOT NULL,
  `fs_nama_menu` varchar(80) NOT NULL,
  `fn_harga` decimal(8,0) NOT NULL,
  `fs_user_buat` varchar(15) NOT NULL,
  `fd_tanggal_buat` datetime NOT NULL,
  `fs_user_edit` varchar(15) DEFAULT NULL,
  `fd_tanggal_edit` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tm_parlevel`
--

CREATE TABLE `tm_parlevel` (
  `fs_kd_parent` varchar(2) NOT NULL,
  `fs_kd_child` varchar(4) NOT NULL,
  `fs_level` varchar(20) DEFAULT NULL,
  `fs_index` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tm_pembayaran`
--

CREATE TABLE `tm_pembayaran` (
  `fs_kode_pembayaran` varchar(5) NOT NULL,
  `fs_nama_pembayaran` varchar(45) NOT NULL,
  `fs_user_buat` varchar(15) NOT NULL,
  `fd_tanggal_buat` datetime NOT NULL,
  `fs_user_edit` varchar(15) DEFAULT NULL,
  `fd_tanggal_edit` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tm_referensi`
--

CREATE TABLE `tm_referensi` (
  `fs_kode_referensi` varchar(20) NOT NULL,
  `fs_nilai1_referensi` varchar(15) NOT NULL,
  `fs_nilai2_referensi` varchar(15) DEFAULT NULL,
  `fs_nama_referensi` varchar(50) NOT NULL,
  `fs_user_buat` varchar(15) NOT NULL,
  `fd_tanggal_buat` datetime NOT NULL,
  `fs_user_edit` varchar(15) NOT NULL,
  `fd_tanggal_edit` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tm_user`
--

CREATE TABLE `tm_user` (
  `fs_username` varchar(15) NOT NULL,
  `fs_password` varchar(50) NOT NULL,
  `fs_level_user` varchar(20) NOT NULL,
  `fs_pin` varchar(50) DEFAULT NULL,
  `fd_last_login` datetime NOT NULL DEFAULT '0000-00-00 00:00:00',
  `fs_ip_address` varchar(15) DEFAULT NULL,
  `fs_aktif` set('0','1') NOT NULL DEFAULT '0',
  `fd_ganti_pass` datetime DEFAULT NULL,
  `fd_ganti_pin` datetime DEFAULT NULL,
  `fs_user_buat` varchar(15) NOT NULL,
  `fd_tanggal_buat` datetime NOT NULL,
  `fs_user_edit` varchar(15) DEFAULT NULL,
  `fd_tanggal_edit` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `tm_user`
--

INSERT INTO `tm_user` (`fs_username`, `fs_password`, `fs_level_user`, `fs_pin`, `fd_last_login`, `fs_ip_address`, `fs_aktif`, `fd_ganti_pass`, `fd_ganti_pin`, `fs_user_buat`, `fd_tanggal_buat`, `fs_user_edit`, `fd_tanggal_edit`) VALUES
('INDRA', '59a920b4b99558bcbed3fee8405e1042', 'SUPERADMIN', NULL, '2017-11-05 16:52:24', '::1', '1', NULL, NULL, 'INDRA', '2017-11-05 15:56:47', 'INDRA', '2017-11-05 16:52:24');

-- --------------------------------------------------------

--
-- Table structure for table `tx_order_detail`
--

CREATE TABLE `tx_order_detail` (
  `fs_no_order` varchar(9) NOT NULL,
  `fs_kode_menu` varchar(5) NOT NULL,
  `fn_harga` decimal(8,0) NOT NULL,
  `fs_user_buat` varchar(15) NOT NULL,
  `fd_tanggal_buat` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `tx_order_header`
--

CREATE TABLE `tx_order_header` (
  `fs_no_order` varchar(9) NOT NULL,
  `fd_tanggal_order` datetime NOT NULL,
  `fs_nama_tamu` varchar(45) NOT NULL,
  `fs_no_meja` varchar(5) DEFAULT NULL,
  `fn_jumlah_tamu` int(3) DEFAULT NULL,
  `fn_subtotal` decimal(9,0) NOT NULL,
  `fn_serv_charge` decimal(7,0) NOT NULL,
  `fn_ppn` decimal(7,0) NOT NULL,
  `fn_total_bill` decimal(10,0) NOT NULL,
  `fs_user_buat` varchar(15) NOT NULL,
  `fd_tanggal_buat` datetime NOT NULL,
  `fs_user_edit` varchar(15) DEFAULT NULL,
  `fd_tanggal_edit` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `captcha`
--
ALTER TABLE `captcha`
  ADD PRIMARY KEY (`captcha_id`),
  ADD KEY `word` (`word`);

--
-- Indexes for table `ci_sessions`
--
ALTER TABLE `ci_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ci_sessions_timestamp` (`timestamp`);

--
-- Indexes for table `config_email`
--
ALTER TABLE `config_email`
  ADD PRIMARY KEY (`email_id`);

--
-- Indexes for table `tb_log`
--
ALTER TABLE `tb_log`
  ADD PRIMARY KEY (`log_time`);

--
-- Indexes for table `tg_menu`
--
ALTER TABLE `tg_menu`
  ADD PRIMARY KEY (`id_menu`);

--
-- Indexes for table `tm_menu`
--
ALTER TABLE `tm_menu`
  ADD PRIMARY KEY (`fs_kode_menu`);

--
-- Indexes for table `tm_pembayaran`
--
ALTER TABLE `tm_pembayaran`
  ADD PRIMARY KEY (`fs_kode_pembayaran`);

--
-- Indexes for table `tm_referensi`
--
ALTER TABLE `tm_referensi`
  ADD PRIMARY KEY (`fs_kode_referensi`,`fs_nilai1_referensi`);

--
-- Indexes for table `tm_user`
--
ALTER TABLE `tm_user`
  ADD PRIMARY KEY (`fs_username`);

--
-- Indexes for table `tx_order_header`
--
ALTER TABLE `tx_order_header`
  ADD PRIMARY KEY (`fs_no_order`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `captcha`
--
ALTER TABLE `captcha`
  MODIFY `captcha_id` bigint(13) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
