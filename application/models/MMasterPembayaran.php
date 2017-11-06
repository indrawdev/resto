<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MMasterPembayaran extends CI_Model {
	
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function checkPembayaran($sKode)
	{
		$xSQL = ("
			SELECT fs_kode_pembayaran, fs_nama_pembayaran
			FROM tm_pembayaran
			WHERE fs_kode_pembayaran = '".trim($sKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPembayaranAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_pembayaran, fs_nama_pembayaran
			FROM tm_pembayaran
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (fs_kode_pembayaran LIKE '%".trim($sCari)."%'
					OR fs_nama_pembayaran LIKE '%".trim($sCari)."%')
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listPembayaran($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_pembayaran, fs_nama_pembayaran
			FROM tm_pembayaran
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (fs_kode_pembayaran LIKE '%".trim($sCari)."%'
					OR fs_nama_pembayaran LIKE '%".trim($sCari)."%')
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_pembayaran ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}