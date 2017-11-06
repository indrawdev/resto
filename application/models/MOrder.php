<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MOrder extends CI_Model {
	
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function listOrderAll($sCari)
	{
		$xSQL = ("
			SELECT a.fs_no_order, a.fd_tanggal_order, a.fs_nama_tamu
			FROM tx_order_header a
			LEFT JOIN tx_order_detail b ON b.fs_no_order = a.fs_no_order
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listOrder($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT a.fs_no_order, a.fd_tanggal_order, a.fs_nama_tamu
			FROM tx_order_header a
			LEFT JOIN tx_order_detail b ON b.fs_no_order = a.fs_no_order
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

}