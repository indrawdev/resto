<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Order extends CI_Controller {

	public function __construct() {
        parent::__construct();
        if ($this->session->userdata('login') <> TRUE) {
            redirect('login');
        }
    }

	public function index() {
		$this->load->view('vorder');
	}

	// COMPONENT SELECT
	public function select() {
		$kode = trim($this->input->post('fs_kode_referensi'));
		$this->db->trans_start();
		$this->load->model('MSearch');
		$sSQL = $this->MSearch->getReferensi($kode);
		$this->db->trans_complete();
		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode' => trim($xRow->fs_nilai1_referensi),
					'fs_nama' => trim($xRow->fs_nama_referensi)
				);
			}
		}
		echo json_encode($xArr);
	}

	public function gridmenu() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MMasterHarga');
		$sSQL = $this->MMasterHarga->listMenuAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterHarga->listMenu($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode_menu' => trim($xRow->fs_kode_menu),
					'fs_nama_menu' => trim($xRow->fs_nama_menu),
					'fs_kategori_menu' => trim($xRow->fs_kategori_menu),
					'fn_harga' => trim($xRow->fn_harga)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}
	
	public function gridorder() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));
	}

	public function ceksave() {
		$kode = $this->input->post('fs_no_order');
		if (!empty($kode)) {
			$this->load->model('MMasterHarga');
			$sSQL = $this->MOrder->checkOrder($kode);
			if ($sSQL->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Data Order sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Data Order belum ada, apakah Anda ingin menambah baru?'
				);
				echo json_encode($hasil);
			}
		} else {
			$hasil = array(
				'sukses' => false,
				'hasil' => 'Simpan Gagal, Data Order tidak diketahui!'
			);
			echo json_encode($hasil);
		}
	}

	public function save() {
		$kode = $this->input->post('fs_no_order');
		$tamu = $this->input->post('fs_nama_tamu');
		$jumlah = $this->input->post('fn_jumlah_tamu');
		$charge = $this->input->post('fn_serv_charge');
		$ppn = $this->input->post('fn_ppn');
		$total = $this->input->post('fn_total_bill');

		// detail field

		$update = false;
		$this->load->model('MOrder');
		$xSQL = $this->MOrder->checkOrder($kode);
		
		if ($xSQL->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fs_no_order' => trim($kode),
			'fs_nama_tamu' => trim($tamu),
			'fn_jumlah_tamu' => trim($jumlah),
			'fn_serv_charge' => trim($charge),
			'fn_ppn' => trim($ppn),
			'fn_total_bill' => trim($total)
		);

		if ($update == false) {
			$dt1 = array(
				'fs_user_buat' => trim($user),
				'fd_tanggal_buat' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt1);
			$this->db->insert('tx_order_header', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('ORDER', $user, 'DATA ORDER '.trim($kode).' SUDAH DIBUAT');
			// END LOGGING

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Simpan Data Order Baru, Sukses!!'
			);
			echo json_encode($hasil);
		} else {
			$dt2 = array(
				'fs_user_edit' => trim($user),
				'fd_tanggal_edit' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt2);
			$where = "fs_no_order = '".trim($kode)."'";
			$this->db->where($where);
			$this->db->update('tx_order_header', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('ORDER', $user, 'DATA ORDER '.trim($kode).' SUDAH DIEDIT');
			// END LOGGING

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Update Data Order, Sukses!!'
			);
			echo json_encode($hasil);
		}
	}

}
