<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MSearch extends CI_Model {
	
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function getCounter($sJenis)
	{
		$xSQL = ("
			SELECT fn_counter
			FROM tm_counter
			WHERE fs_jenis_counter = '".trim($sJenis)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL->row();
	}

	public function getReferensi($sKode)
	{
		$xSQL = ("
			SELECT fs_nilai1_referensi, fs_nilai2_referensi, fs_nama_referensi
			FROM tm_referensi
			WHERE fs_kode_referensi = '".trim($sKode)."'
		");

		$xSQL = $xSQL.("
			ORDER BY fs_nilai1_referensi ASC
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function getPembayaran()
	{
		$xSQL = ("
			SELECT fs_kode_pembayaran, fs_nama_pembayaran
			FROM tm_pembayaran
		");

		$xSQL = $xSQL.("
			ORDER BY fs_kode_pembayaran ASC
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listUserAll($sCari)
	{
		$xSQL = ("
			SELECT fs_username, fs_password, 
				fs_level_user, fd_tanggal_buat
			FROM tm_user
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE fs_username LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listUser($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_username, fs_password, 
				fs_level_user, fd_tanggal_buat
			FROM tm_user
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE fs_username LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}