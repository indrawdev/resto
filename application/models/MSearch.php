<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MSearch extends CI_Model {
	
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function listCabangAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_cabang, fs_nama_cabang
			FROM tm_cabang
			WHERE fs_aktif = '1'
		");

		if (!empty($sCari))
		{
			$xSQL = $xSQL.("
				AND fs_nama_cabang LIKE '%".trim($sCari)."%'
			");
		}

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

		if (!empty($sCari))
		{
			$xSQL = $xSQL.("
				AND fs_nama_cabang LIKE '%".trim($sCari)."%'
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fs_kode_cabang ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listSurveyorAll($sCari)
	{
		$xSQL = ("
			SELECT fs_kode_surveyor, fs_nama_surveyor
			FROM tm_surveyor
			WHERE fs_aktif = '1'
		");

		if (!empty($sCari))
		{
			$xSQL = $xSQL.("
				AND fs_kode_surveyor LIKE '%".trim($sCari)."%'
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listSurveyor($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_kode_surveyor, fs_nama_surveyor
			FROM tm_surveyor
			WHERE fs_aktif = '1'
		");

		if (!empty($sCari))
		{
			$xSQL = $xSQL.("
				AND fs_nama_surveyor LIKE '%".trim($sCari)."%'
			");
		}
		
		$xSQL = $xSQL.("
			ORDER BY fs_kode_surveyor ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}
}