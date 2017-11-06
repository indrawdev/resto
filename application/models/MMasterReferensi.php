<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MMasterReferensi extends CI_Model
{
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function checkReferensi($sKode, $nNilai1)
	{
		$xSQL = ("
			SELECT fs_kode_referensi, fs_nilai1_referensi, fs_nilai2_referensi, fs_nama_referensi
			FROM tm_referensi 
			WHERE fs_kode_referensi = '".trim($sKode)."'
			AND fs_nilai1_referensi = '".trim($nNilai1)."'
		");
		
		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listReferensiAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_referensi, fs_nilai1_referensi, fs_nilai2_referensi, fs_nama_referensi
			FROM tm_referensi
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (fs_kode_referensi LIKE '%".trim($sCari)."%'
					OR fs_nilai1_referensi LIKE '%".trim($sCari)."%'
					OR fs_nama_referensi LIKE '%".trim($sCari)."%')
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listReferensi($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_referensi, fs_nilai1_referensi, fs_nilai2_referensi, fs_nama_referensi
			FROM tm_referensi
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (fs_kode_referensi LIKE '%".trim($sCari)."%'
					OR fs_nilai1_referensi LIKE '%".trim($sCari)."%'
					OR fs_nama_referensi LIKE '%".trim($sCari)."%')
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_referensi ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}