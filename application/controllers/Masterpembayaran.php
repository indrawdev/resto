<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Masterpembayaran extends CI_Controller {

	public function __construct() {
        parent::__construct();
        if ($this->session->userdata('login') <> TRUE) {
            redirect('login');
        }
    }

	public function index() {
		$this->load->view('vmasterpembayaran');
	}

	public function grid() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MMasterPembayaran');
		$sSQL = $this->MMasterPembayaran->listPembayaranAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterPembayaran->listPembayaran($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
						'fs_kode_pembayaran' => trim($xRow->fs_kode_pembayaran),
						'fs_nama_pembayaran' => trim($xRow->fs_nama_pembayaran),
						'fs_aktif' => trim($xRow->fs_aktif)
					);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function ceksave() {
		$kode = $this->input->post('fs_kode_pembayaran');
		if (!empty($kode)) {
			$this->load->model('MMasterPembayaran');
			$sSQL = $this->MMasterPembayaran->checkPembayaran($kode);
			if ($sSQL->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Data Pembayaran sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Data Pembayaran belum ada, apakah Anda ingin menambah baru?'
				);
				echo json_encode($hasil);
			}
		} else {
			$hasil = array(
				'sukses' => false,
				'hasil' => 'Simpan Gagal, Data Pembayaran tidak diketahui!'
			);
			echo json_encode($hasil);
		}
	}

	public function save() {
		$user = $this->encryption->decrypt($this->session->userdata('username'));

		$kode = $this->input->post('fs_kode_pembayaran');
		$nama = $this->input->post('fs_nama_pembayaran');
		$aktif = $this->input->post('fs_aktif');

		$update = false;
		$this->load->model('MMasterPembayaran');
		$sSQL = $this->MMasterPembayaran->checkPembayaran($kode);

		if ($sSQL->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fs_kode_pembayaran' => trim($kode),
			'fs_nama_pembayaran' => trim($nama),
			'fs_aktif' => trim($aktif)
		);

		if ($update == false) {
			$dt1 = array(
				'fs_user_buat' => trim($user),
				'fd_tanggal_buat' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt1);
			$this->db->insert('tm_pembayaran', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('MASTER PEMBAYARAN', $user, 'DATA PEMBAYARAN '.trim($nama).' SUDAH DIBUAT');
			// END LOGGING

			$hasil = array(
						'sukses' => true,
						'hasil' => 'Simpan Data Pembayaran Baru, Sukses!!'
					);
			echo json_encode($hasil);
		} else {
			$dt2 = array(
				'fs_user_edit' => trim($user),
				'fd_tanggal_edit' => date('Y-m-d H:i:s')
			);
			$data = array_merge($dt, $dt2);
			$where = "fs_kode_pembayaran = '".trim($kode)."'";
			$this->db->where($where);
			$this->db->update('tm_pembayaran', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('MASTER PEMBAYARAN', $user, 'DATA PEMBAYARAN '.trim($nama).' SUDAH DIEDIT');
			// END LOGGING

			$hasil = array(
				'sukses' => true,
				'hasil' => 'Update Data Pembayaran, Sukses!!'
			);
			echo json_encode($hasil);
		}
	}

}
