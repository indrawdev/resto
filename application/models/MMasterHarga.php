<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MMasterHarga extends CI_Model {
	
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function checkMenu($sKode)
	{
		$xSQL = ("
			SELECT fs_kode_menu, fs_nama_menu, fs_kategori_menu, fn_harga
			FROM tm_menu
			WHERE fs_kode_menu = '".trim($sKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listMenuAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_menu, fs_nama_menu, fs_kategori_menu, fn_harga
			FROM tm_menu
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (fs_kode_menu LIKE '%".trim($sCari)."%' 
					OR fs_nama_menu LIKE '%".trim($sCari)."%')
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listMenu($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_menu, fs_nama_menu, fs_kategori_menu, fn_harga
			FROM tm_menu
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (fs_kode_menu LIKE '%".trim($sCari)."%' 
					OR fs_nama_menu LIKE '%".trim($sCari)."%')
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_menu ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

}