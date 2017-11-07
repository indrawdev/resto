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

	public function cetakpos() {
		$this->load->helper('escpos');
		$printer = new phpprint("LPT1");
		$printer->set_justification(phpprint::JUSTIFY_CENTER);
		/* HEADER */
		$printer->text("REMPAH WANGI\n");
		$printer->text("Jl. Fatmawati no. 29 Jak-Sel\n");
		$printer->text("Telp. 021 - 7509168\n");
		$printer->text("Fax. 021 - 7509167\n");
		$printer->text("www.rempahwangi.com\n");
		
		
		// LABEL
		$label_tanggal = str_pad('Tanggal', 15, " ", STR_PAD_RIGHT);
		$label_jam = str_pad('Jam', 15, " ", STR_PAD_RIGHT);
		$label_tamu = str_pad('Nama Tamu', 15, " ", STR_PAD_RIGHT);
		$label_pelayan = str_pad('Pelayan', 15, " ", STR_PAD_RIGHT);
		$label_meja = str_pad('No. Meja', 15," ", STR_PAD_RIGHT);
		$label_jumlah = str_pad('Jumlah Tamu', 15, " ", STR_PAD_RIGHT);
		
		$label_subtotal = str_pad('Sub Total', 22, " ", STR_PAD_LEFT);
		$label_service = str_pad('Serv. Charge 5.5%', 22, " ", STR_PAD_LEFT);
		$label_ppn = str_pad('PB-1 10%', 22, " ", STR_PAD_LEFT);
		$label_totalbill = str_pad('Total Bill', 22, " ", STR_PAD_LEFT);

		// SEPARATOR
		$separator = str_pad(':', 3, " ", STR_PAD_BOTH);

		// VALUE
		$val_tanggal = str_pad('02-11-17', 22, " ", STR_PAD_RIGHT);
		$val_jam = str_pad('02:46:10', 22, " ", STR_PAD_RIGHT);
		$val_tamu = str_pad('Umum', 22, " ", STR_PAD_RIGHT);
		$val_pelayan = str_pad('Christine', 22, " ", STR_PAD_RIGHT);
		$val_meja = str_pad('D14', 22, " ", STR_PAD_RIGHT);
		$val_jumlah = str_pad('2', 22, " ", STR_PAD_RIGHT);

		$val_subtotal = str_pad('171,000', 15, " ", STR_PAD_LEFT);
		$val_service = str_pad('9,405', 15, " ", STR_PAD_LEFT);
		$val_ppn = str_pad('18,041', 15, " ", STR_PAD_LEFT);
		$val_totalbill = str_pad('198,446', 15, " ", STR_PAD_LEFT);

		/* BODY */
		$printer->set_justification(phpprint::JUSTIFY_LEFT);
		$printer->text("=======================================\n");

		// PRINT 1
		$printer->text($label_tanggal . $separator . $val_tanggal);
		$printer->newline();
		$printer->text($label_jam . $separator . $val_jam);
		$printer->newline();
		$printer->text($label_tamu . $separator . $val_tamu);
		$printer->newline();
		$printer->text($label_pelayan . $separator . $val_pelayan);
		$printer->newline();
		$printer->text($label_meja . $separator . $val_meja);
		$printer->newline();
		$printer->text($label_jumlah . $separator . $val_jumlah);
		$printer->newline();

		$printer->text("=======================================\n");
		$printer->newline();
		$printer->set_justification(phpprint::JUSTIFY_RIGHT);
		$printer->text("---------------------------------------\n");
		$printer->text($val_subtotal . $separator . $val_subtotal);
		$printer->newline();
		$printer->text($label_service . $separator . $val_service);
		$printer->newline();
		$printer->text($label_ppn . $separator . $val_ppn);
		$printer->newline();
		$printer->text("---------------------------------------\n");
		$printer->text($label_totalbill . $separator . $val_totalbill);
		$printer->newline();
		/*
		$printer->set_justification(phpprint::JUSTIFY_LEFT);
		$printer->text("  1 Daging Mercon Batang");
		$printer->set_justification(phpprint::JUSTIFY_RIGHT);
		$printer->text("62,000");
		$printer->newline();
		$printer->set_justification(phpprint::JUSTIFY_LEFT);
		$printer->text("  2 Nasi Putih");
		$printer->set_justification(phpprint::JUSTIFY_RIGHT);
		$printer->text("16,000");
		$printer->newline();
		$printer->set_justification(phpprint::JUSTIFY_LEFT);
		$printer->text("  2 Nasi Putih");
		$printer->set_justification(phpprint::JUSTIFY_RIGHT);
		$printer->text("16,000");
		$printer->newline();
		$printer->set_justification(phpprint::JUSTIFY_LEFT);
		$printer->text("  1 Sop Iga Kadeudeuh");
		$printer->set_justification(phpprint::JUSTIFY_RIGHT);
		$printer->text("65,000");
		$printer->newline();
		$printer->set_justification(phpprint::JUSTIFY_LEFT);
		$printer->text("  1 Ice Lemon Tea");
		$printer->set_justification(phpprint::JUSTIFY_RIGHT);
		$printer->text("28,000");
		$printer->newline();
		$printer->text("-----------------------------------------\n");
		$printer->text("Sub Total : 171,000\n");
		$printer->text("Serv. Charge 5.5% : 9,405\n");
		$printer->text("PB-1 10% : 18,041\n");
		$printer->text("-----------------------------------------\n");
		$printer->text("Total Bill : 198,446\n");
		*/
		/* FOOTER */
		$printer->cut();
		echo "Print succesful";
	}


}
