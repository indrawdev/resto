<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MOrder extends CI_Model {
	
	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function checkOrder($sKode)
	{
		$xSQL = ("
			SELECT fs_no_order
			FROM tx_order_header
			WHERE fs_no_order = '".trim($sKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listHeaderAll($sCari)
	{
		$xSQL = ("
			SELECT fs_no_order, fd_tanggal_order, fs_nama_tamu, 
				fs_no_meja, fn_jumlah_tamu, fs_kode_pembayaran,
				fn_subtotal, fn_serv_charge, fn_ppn, fn_total_bill
			FROM tx_order_header
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (fs_no_order LIKE '%".trim($sCari)."%' 
					OR fs_nama_tamu LIKE '%".trim($sCari)."%')
			");
		}

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listHeader($sCari, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT fs_no_order, fd_tanggal_order, fs_nama_tamu, 
				fs_no_meja, fn_jumlah_tamu, fs_kode_pembayaran,
				fn_subtotal, fn_serv_charge, fn_ppn, fn_total_bill
			FROM tx_order_header
		");

		if (!empty($sCari)) {
			$xSQL = $xSQL.("
				WHERE (fs_no_order LIKE '%".trim($sCari)."%' 
					OR fs_nama_tamu LIKE '%".trim($sCari)."%')
			");
		}

		$xSQL = $xSQL.("
			ORDER BY fd_tanggal_buat DESC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listDetailAll($sKode)
	{
		$xSQL = ("
			SELECT a.fs_no_order, a.fs_kode_menu, a.fn_harga, b.fs_nama_menu
			FROM tx_order_detail a
			LEFT JOIN tm_menu b ON b.fs_kode_menu = a.fs_kode_menu
			WHERE a.fs_no_order = '".trim($sKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function listDetail($sKode, $nStart, $nLimit)
	{
		$xSQL = ("
			SELECT a.fs_no_order, a.fs_kode_menu, a.fn_harga, b.fs_nama_menu
			FROM tx_order_detail a
			LEFT JOIN tm_menu b ON b.fs_kode_menu = a.fs_kode_menu
			WHERE a.fs_no_order = '".trim($sKode)."'
		");

		$xSQL = $xSQL.("
			ORDER BY a.fs_kode_menu ASC LIMIT ".$nStart.",".$nLimit."
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function getHeader($sKode)
	{
		$xSQL = ("
			SELECT fd_tanggal_order, fs_nama_tamu, fs_no_meja, fn_jumlah_tamu,
				fs_kode_pembayaran, fn_subtotal, fn_serv_charge,
				fn_ppn, fn_total_bill, fn_uang_bayar, fn_uang_kembali,
				fs_user_buat, fd_tanggal_buat
			FROM tx_order_header
			WHERE fs_no_order = '".trim($sKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL->row();
	}

	public function getDetail($sKode)
	{
		$xSQL = ("
			SELECT a.fs_no_order, a.fs_kode_menu, a.fn_qty, a.fn_harga, b.fs_nama_menu
			FROM tx_order_detail a
			LEFT JOIN tm_menu b ON b.fs_kode_menu = a.fs_kode_menu
			WHERE a.fs_no_order = '".trim($sKode)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

}