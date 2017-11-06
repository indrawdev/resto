<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Masterreferensi extends CI_Controller {

	public function __construct() {
        parent::__construct();
        if ($this->session->userdata('login') <> TRUE) {
            redirect('login');
        }
    }

	public function index() {
		$this->load->view('vmasterreferensi');
	}

	public function grid() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MMasterReferensi');
		$sSQL = $this->MMasterReferensi->listReferensiAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterReferensi->listReferensi($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0)  {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
						'fs_kode_referensi' => trim($xRow->fs_kode_referensi),
						'fs_nilai1_referensi' => trim($xRow->fs_nilai1_referensi),
						'fs_nilai2_referensi' => trim($xRow->fs_nilai2_referensi),
						'fs_nama_referensi' => trim($xRow->fs_nama_referensi)
					);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function ceksave() {
		$kode = str_replace(' ', '_', $this->input->post('fs_kode_referensi'));
		$nilai1 = $this->input->post('fs_nilai1_referensi');

		if (!empty($kode) && !empty($nilai1)) {
			$this->load->model('MMasterReferensi');
			$sSQL = $this->MMasterReferensi->checkReferensi($kode, $nilai1);
			if ($sSQL->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Data Referensi sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Data Referensi belum ada, apakah Anda ingin menambah baru?'
				);
				echo json_encode($hasil);
			}
		} else {
			$hasil = array(
						'sukses' => false,
						'hasil' => 'Simpan Gagal, Data Referensi tidak diketahui!'
					);
			echo json_encode($hasil);
		}
	}

	public function save() {
		$user = $this->encryption->decrypt($this->session->userdata('username'));

		$kode = str_replace(' ', '_', strtolower($this->input->post('fs_kode_referensi')));
		$nilai1 = strtoupper($this->input->post('fs_nilai1_referensi'));
		$nilai2 = strtoupper($this->input->post('fs_nilai2_referensi'));
		$nama = strtoupper($this->input->post('fs_nama_referensi'));

		$update = false;
		$this->load->model('MMasterReferensi');
		$sSQL = $this->MMasterReferensi->checkReferensi($kode, $nilai1);

		if ($sSQL->num_rows() > 0) {
			$update = true;
		}

		if ($update == false) {
			$data = array(
					'fs_kode_referensi' => trim($kode),
					'fs_nilai1_referensi' => trim($nilai1),
					'fs_nilai2_referensi' => trim($nilai2),
					'fs_nama_referensi' => trim($nama)
				);
			$this->db->insert('tm_referensi', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('MASTER REFERENSI', $user, 'DATA REFERENSI '.trim($nama).' SUDAH DIBUAT');
			// END LOGGING

			$hasil = array(
						'sukses' => true,
						'hasil' => 'Simpan Data Referensi Baru, Sukses!!'
					);
			echo json_encode($hasil);
		} else {
			$data = array(
					'fs_kode_referensi' => trim($kode),
					'fs_nilai1_referensi' => trim($nilai1),
					'fs_nilai2_referensi' => trim($nilai2),
					'fs_nama_referensi' => trim($nama)
				);
			$where = "fs_kode_referensi = '".trim($kode)."' AND fs_nilai1_referensi = '".trim($nilai1)."'";
			$this->db->where($where);
			$this->db->update('tm_referensi', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('MASTER REFERENSI', $user, 'DATA REFERENSI '.trim($nama).' SUDAH DIEDIT');
			// END LOGGING

			$hasil = array(
						'sukses' => true,
						'hasil' => 'Update Data Referensi, Sukses!!'
					);
			echo json_encode($hasil);
		}
	}

	public function remove() {
		$user = $this->encryption->decrypt($this->session->userdata('username'));
		
		$kode = $this->input->post('fs_kode_referensi');
		$nilai1 = $this->input->post('fs_nilai1_referensi');

		if (!empty($kode) && !empty($nilai1)) {
			$where = "fs_kode_referensi = '".trim($kode)."' AND fs_nilai1_referensi = '".trim($nilai1)."'";
			$this->db->where($where);
			$this->db->delete('tm_referensi');

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('MASTER REFERENSI', $user, 'KODE REFERENSI '.trim($kode).' SUDAH DIHAPUS');
			// END LOGGING

			$hasil = array(
						'sukses' => true,
						'hasil' => 'Data Referensi dihapus!'
					);
			echo json_encode($hasil);
		} else {
			$hasil = array(
						'sukses' => false,
						'hasil' => 'Hapus Gagal...'
					);
			echo json_encode($hasil);
		}
	}

}