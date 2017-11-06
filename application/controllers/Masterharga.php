<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Masterharga extends CI_Controller {

	public function __construct() {
        parent::__construct();
        if ($this->session->userdata('login') <> TRUE) {
            redirect('login');
        }
    }

	public function index() {
		$this->load->view('vmasterharga');
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

	public function grid() {
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

	public function ceksave() {
		$kode = $this->input->post('fs_kode_menu');
		if (!empty($kode)) {
			$this->load->model('MMasterHarga');
			$sSQL = $this->MMasterHarga->checkMenu($kode);
			if ($sSQL->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Data Menu sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Data Menu belum ada, apakah Anda ingin menambah baru?'
				);
				echo json_encode($hasil);
			}
		} else {
			$hasil = array(
				'sukses' => false,
				'hasil' => 'Simpan Gagal, Data Menu tidak diketahui!'
			);
			echo json_encode($hasil);
		}
	}

	public function save() {
		$user = $this->encryption->decrypt($this->session->userdata('username'));

		$kode = $this->input->post('fs_kode_menu');
		$nama = $this->input->post('fs_nama_menu');
		$kategori = $this->input->post('fs_kategori_menu');
		$harga = $this->input->post('fn_harga');

		$update = false;
		$this->load->model('MMasterHarga');
		$xSQL = $this->MMasterHarga->checkMenu($kode);
		
		if ($xSQL->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fs_kode_menu' => trim($kode),
			'fs_nama_menu' => trim($nama),
			'fs_kategori_menu' => trim($kategori),
			'fn_harga' => trim($harga)
		);

		if ($update == false) {
			$dt1 = array(
				'fs_user_buat' => trim($user),
				'fd_tanggal_buat' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt1);
			$this->db->insert('tm_menu', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('MASTER MENU', $user, 'DATA MENU '.trim($nama).' SUDAH DIBUAT');
			// END LOGGING

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Simpan Data Menu Baru, Sukses!!'
			);
			echo json_encode($hasil);
		} else {
			$dt2 = array(
				'fs_user_edit' => trim($user),
				'fd_tanggal_edit' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt2);
			$where = "fs_kode_menu = '".trim($kode)."'";
			$this->db->where($where);
			$this->db->update('tm_menu', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('MASTER MENU', $user, 'DATA MENU '.trim($nama).' SUDAH DIEDIT');
			// END LOGGING

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Update Data Menu, Sukses!!'
			);
			echo json_encode($hasil);
		}
	}

}