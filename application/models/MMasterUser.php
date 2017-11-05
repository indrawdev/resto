<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MMasterUser extends CI_Model
{
	public function __construct() {
		parent::__construct();
		$this->load->database();
	}

	public function checkNIK($nNik)
	{
		$xSQL = ("
			SELECT fn_nik
			FROM tm_karyawan
			WHERE fn_nik = '".trim($nNik)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function checkUser($sUser)
	{
		$xSQL = ("
			SELECT fs_username
			FROM tm_user
			WHERE fs_username = '".trim($sUser)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function checkAkses($sLevel)
	{
		$xSQL = ("
			SELECT fs_level FROM tm_parlevel WHERE fs_level = '".trim($sLevel)."'
		");
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}


	public function listCabangAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fs_nama_cabang
			FROM tm_cabang
			WHERE fs_aktif = '1'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listCabang($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fs_nama_cabang
			FROM tm_cabang
			WHERE fs_aktif = '1'
		");

		$xSQL = $xSQL.("
			ORDER BY fs_kode_cabang ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listActivityAll($sCari)
	{
		$xSQL = ("
			SELECT log_time, log_name, log_user, log_message
			FROM tb_log
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (log_user LIKE '%".trim($sCari)."%'
					OR log_message LIKE '%".trim($sCari)."%')
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listActivity($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT log_time, log_name, log_user, log_message
			FROM tb_log
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (log_user LIKE '%".trim($sCari)."%'
					OR log_message LIKE '%".trim($sCari)."%')
			");
		}

		$xSQL = $xSQL.("
			ORDER BY log_time DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listLevelAll($sCari)
	{
		$xSQL = ("
			SELECT *
			FROM tm_parlevel
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listLevel($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT *
			FROM tm_parlevel
		");
		
		$xSQL = $xSQL.("
			GROUP BY fs_level
			ORDER BY fs_level DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listAksesCabangAll($sUser)
	{
		$xSQL = ("
			SELECT a.fs_kode_cabang, b.fs_nama_cabang
			FROM tm_akses_cabang a
			LEFT JOIN tm_cabang b ON b.fs_kode_cabang = a.fs_kode_cabang
			WHERE a.fs_username = '".trim($sUser)."' AND b.fs_aktif = '1'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listAksesCabang($sUser, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT a.fs_kode_cabang, b.fs_nama_cabang
			FROM tm_akses_cabang a
			LEFT JOIN tm_cabang b ON b.fs_kode_cabang = a.fs_kode_cabang
			WHERE a.fs_username = '".trim($sUser)."' AND b.fs_aktif = '1'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listUserAll($sCari)
	{
		$xSQL = ("
			SELECT fs_username, fs_password, fs_level_user, fd_tanggal_buat, fd_last_login
			FROM tm_user 
			WHERE fs_aktif = '1'
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_username LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listUser($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_username, fs_password, fs_level_user, fd_tanggal_buat, fd_last_login
			FROM tm_user 
			WHERE fs_aktif = '1'
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				AND fs_username LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function loadMenu($sLevel)
	{
		$xSQL = ("
			SELECT a.fs_kd_parent, a.fs_kd_child, a.fs_nm_menu, a.fs_nm_form, a.fs_nm_formweb,
			CASE IFNULL((SELECT h.fs_kd_parent FROM	tm_parlevel h WHERE h.fs_kd_parent = a.fs_kd_parent
			AND	h.fs_kd_child = a.fs_kd_child AND h.fs_index = '1' AND	h.fs_level = '".trim($sLevel)."'), '') WHEN '' THEN 'false' ELSE 'true' END fb_tambah FROM tg_menu a
			ORDER BY a.fs_kd_parent, a.fs_kd_child
		");
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

}