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

	public function pembayaran() {
		$this->db->trans_start();
		$this->load->model('MSearch');
		$sSQL = $this->MSearch->getPembayaran();
		$this->db->trans_complete();
		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_kode' => trim($xRow->fs_kode_pembayaran),
					'fs_nama' => trim($xRow->fs_nama_pembayaran)
				);
			}
		}
		echo json_encode($xArr);
	}

	public function getorder() {
		$this->load->model('MSearch');
		$order = $this->MSearch->getCounter('ORDER');
		$hasil = array(
			'sukses' => true,
			'fn_counter' => trim($order->fn_counter)
		);
		echo json_encode($hasil);
	}

	public function getter() {
		$this->load->model('MSearch');
		$order = $this->MSearch->getCounter('ORDER');
		return $order->fn_counter;
	}

	public function setter($order) {
		$neworder = $order + 1;
		$set = array(
			'fn_counter' => trim($neworder)
		);
		$where = "fs_jenis_counter = 'ORDER'";
		$this->db->where($where);
		$this->db->update('tm_counter', $set);
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
	
	public function gridorderdetail() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MOrder');
		$sSQL = $this->MOrder->listDetailAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MOrder->listDetail($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_no_order' => trim($xRow->fs_no_order),
					'fs_kode_menu' => trim($xRow->fs_kode_menu),
					'fs_nama_menu' => trim($xRow->fs_nama_menu),
					'fn_harga' => trim($xRow->fn_harga)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function gridorderhistory() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MOrder');
		$sSQL = $this->MOrder->listHeaderAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MOrder->listHeader($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
					'fs_no_order' => trim($xRow->fs_no_order),
					'fd_tanggal_order' => trim($xRow->fd_tanggal_order),
					'fs_nama_tamu' => trim($xRow->fs_nama_tamu),
					'fs_no_meja' => trim($xRow->fs_no_meja),
					'fn_jumlah_tamu' => trim($xRow->fn_jumlah_tamu),
					'fs_kode_pembayaran' => trim($xRow->fs_kode_pembayaran),
					'fn_subtotal' => trim($xRow->fn_subtotal),
					'fn_serv_charge' => trim($xRow->fn_serv_charge),
					'fn_ppn' => trim($xRow->fn_ppn),
					'fn_total_bill' => trim($xRow->fn_total_bill)
				);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	public function ceksave() {
		$kode = $this->input->post('fs_no_order');
		if (!empty($kode)) {
			$this->load->model('MOrder');
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
		$user = $this->encryption->decrypt($this->session->userdata('username'));

		$kode = $this->input->post('fs_no_order');
		$tamu = $this->input->post('fs_nama_tamu');
		$meja = $this->input->post('fs_no_meja');
		$jumlah = $this->input->post('fn_jumlah_tamu');
		$pembayaran = $this->input->post('fs_kode_pembayaran');
		$subtotal = $this->input->post('fn_subtotal');
		$charge = $this->input->post('fn_serv_charge');
		$ppn = $this->input->post('fn_ppn');
		$total = $this->input->post('fn_total_bill');
		$bayar = $this->input->post('fn_uang_bayar');
		$kembali = $this->input->post('fn_uang_kembali');

		// field order detail
		$kodemenu = explode('|', $this->input->post('fs_kode_menu'));
		$qty = explode('|', $this->input->post('fn_qty'));
		$harga = explode('|', $this->input->post('fn_harga'));

		$where = "fs_no_order = '".trim($kode)."'";
		// hapus order detail
		$this->db->where($where);
		$this->db->delete('tx_order_detail');

		// simpan order detail
		$jml = count($kodemenu) - 1;
		if ($jml <> 0) {
			for ($i=1; $i<=$jml; $i++) {
				$data = array(
					'fs_no_order' => trim($kode),
					'fs_kode_menu' => trim($kodemenu[$i]),
					'fn_qty' => trim($qty[$i]),
					'fn_harga' => trim($harga[$i]),
					'fs_user_buat' => trim($user),
					'fd_tanggal_buat' => date('Y-m-d H:i:s')
				);
				$this->db->insert('tx_order_detail', $data);
			}
		}

		$update = false;
		$this->load->model('MOrder');
		$xSQL = $this->MOrder->checkOrder($kode);
		
		if ($xSQL->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fs_no_order' => trim($kode),
			'fd_tanggal_order' => date('Y-m-d H:i:s'),
			'fs_nama_tamu' => trim($tamu),
			'fs_no_meja' => trim($meja),
			'fn_jumlah_tamu' => trim($jumlah),
			'fs_kode_pembayaran' => trim($pembayaran),
			'fn_subtotal' => trim($subtotal),
			'fn_serv_charge' => trim($charge),
			'fn_ppn' => trim($ppn),
			'fn_total_bill' => trim($total),
			'fn_uang_bayar' => trim($bayar),
			'fn_uang_kembali' => trim($kembali)
		);

		if ($update == false) {
			$dt1 = array(
				'fs_user_buat' => trim($user),
				'fd_tanggal_buat' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt1);
			$this->db->insert('tx_order_header', $data);

			// UPDATE COUNTER
			$this->setter($kode);

			// GET COUNTER
			$counter = $this->getter();

			// PRINT ALL 
			$this->printall($kode);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('ORDER', $user, 'DATA ORDER '.trim($kode).' SUDAH DIBUAT');
			// END LOGGING

			$hasil = array(
				'sukses' => true,
				'counter' => trim($counter),
				'hasil' => 'Simpan Data Order '.trim($kode).', Sukses!!'
			);
			echo json_encode($hasil);
		} else {

			// GET COUNTER
			$counter = $this->getter();

			$dt2 = array(
				'fs_user_edit' => trim($user),
				'counter' => trim($counter),
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
				'hasil' => 'Update Data Order '.trim($kode).', Sukses!!'
			);
			echo json_encode($hasil);
		}
	}

	public function printbill($kode) {
		$this->load->helper('escpos');
		$this->load->model('MOrder');
		$header = $this->MOrder->getHeader($kode);
		$detail = $this->MOrder->getDetail($kode);

		$printer = new phpprint("LPT1");
		// LABEL
		$label_tanggal = str_pad('Tanggal', 15, " ", STR_PAD_RIGHT);
		$label_jam = str_pad('Jam', 15, " ", STR_PAD_RIGHT);
		$label_tamu = str_pad('Nama Tamu', 15, " ", STR_PAD_RIGHT);
		$label_pelayan = str_pad('Pelayan', 15, " ", STR_PAD_RIGHT);
		$label_meja = str_pad('No. Meja', 15," ", STR_PAD_RIGHT);
		$label_jumlah = str_pad('Jumlah Tamu', 15, " ", STR_PAD_RIGHT);
		
		$label_subtotal = str_pad('Sub Total', 25, " ", STR_PAD_LEFT);
		$label_service = str_pad('Serv. Charge 5.5%', 25, " ", STR_PAD_LEFT);
		$label_ppn = str_pad('PB-1 10%', 25, " ", STR_PAD_LEFT);
		$label_totalbill = str_pad('Total Bill', 25, " ", STR_PAD_LEFT);
		$label_grandtotal = str_pad('Grand Total', 25, " ", STR_PAD_LEFT);
		$label_pembayaran = str_pad('Visa Card', 25, " ", STR_PAD_LEFT);
		$label_kembali = str_pad('Kembali', 25, " ", STR_PAD_LEFT);

		// SEPARATOR
		$separator = str_pad(':', 3, " ", STR_PAD_BOTH);

		// VALUE
		$val_tanggal = str_pad(date('n.j.Y', strtotime($header->fd_tanggal_buat)), 22, " ", STR_PAD_RIGHT);
		$val_jam = str_pad(date('H:i', strtotime($header->fd_tanggal_buat)), 22, " ", STR_PAD_RIGHT);
		$val_tamu = str_pad($header->fs_nama_tamu, 22, " ", STR_PAD_RIGHT);
		$val_pelayan = str_pad($header->fs_user_buat, 22, " ", STR_PAD_RIGHT);
		$val_meja = str_pad($header->fs_no_meja, 22, " ", STR_PAD_RIGHT);
		$val_jumlah = str_pad($header->fn_jumlah_tamu, 22, " ", STR_PAD_RIGHT);

		$val_subtotal = str_pad(number_format($header->fn_subtotal), 12, " ", STR_PAD_LEFT);
		$val_service = str_pad(number_format($header->fn_serv_charge), 12, " ", STR_PAD_LEFT);
		$val_ppn = str_pad(number_format($header->fn_ppn), 12, " ", STR_PAD_LEFT);
		$val_totalbill = str_pad(number_format($header->fn_total_bill), 12, " ", STR_PAD_LEFT);
		$val_grandtotal = str_pad(number_format($header->fn_total_bill), 12, " ", STR_PAD_LEFT);
		$val_pembayaran = str_pad(number_format($header->fn_uang_bayar), 12, " ", STR_PAD_LEFT);
		$val_kembali = str_pad(number_format($header->fn_uang_kembali), 12, " ", STR_PAD_LEFT);

		$val_footer = str_pad('TERIMA KASIH', 40, " ", STR_PAD_BOTH);

		/* HEADER */
		$printer->set_justification(phpprint::JUSTIFY_CENTER);
		$printer->text("REMPAH WANGI\n");
		$printer->text("Jl. Fatmawati no. 29 Jak-Sel\n");
		$printer->text("Telp. 021 - 7509168\n");
		$printer->text("Fax. 021 - 7509167\n");
		$printer->text("www.rempahwangi.com\n");

		/* BODY */
		$printer->set_justification(phpprint::JUSTIFY_LEFT);
		$printer->text("========================================\n");

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

		$printer->text("========================================\n");
		if ($detail->num_rows() > 0) {
			foreach ($detail->result() as $value) {
				if (strlen($value->fs_nama_menu) > 25) {
					$produk = substr($value->fs_nama_menu, 0, 22) . '...';
				} else {
					$produk = $value->fs_nama_menu;
				}
				$val_qty = str_pad(number_format($value->fn_qty), 4, " ", STR_PAD_RIGHT);
				$val_produk = str_pad($produk, 25, " ", STR_PAD_RIGHT);
				$val_harga = str_pad(number_format($value->fn_harga), 11, " ", STR_PAD_LEFT);

				$printer->text($val_qty . $val_produk . $val_harga);
				$printer->newline();
			}
		}
		
		$printer->set_justification(phpprint::JUSTIFY_RIGHT);
		$printer->text("----------------------------------------\n");
		$printer->text($label_subtotal . $separator . $val_subtotal);
		$printer->newline();
		$printer->text($label_service . $separator . $val_service);
		$printer->newline();
		$printer->text($label_ppn . $separator . $val_ppn);
		$printer->newline();
		$printer->text("--------------------------------\n");
		$printer->text($label_totalbill . $separator . $val_totalbill);
		$printer->newline();
		$printer->text("--------------------------------\n");
		$printer->text($label_grandtotal . $separator . $val_grandtotal);
		$printer->newline();
		$printer->newline();
		/* FOOTER */
		$printer->set_justification(phpprint::JUSTIFY_CENTER);
		$printer->text($val_footer);
		$printer->newline();
		
		$printer->cut();
	}

	public function printpaymentbill($kode) {
		$this->load->helper('escpos');
		$this->load->model('MOrder');
		$header = $this->MOrder->getHeader($kode);
		$detail = $this->MOrder->getDetail($kode);

		$printer = new phpprint("LPT1");
		// LABEL
		$label_tanggal = str_pad('Tanggal', 15, " ", STR_PAD_RIGHT);
		$label_jam = str_pad('Jam', 15, " ", STR_PAD_RIGHT);
		$label_tamu = str_pad('Nama Tamu', 15, " ", STR_PAD_RIGHT);
		$label_pelayan = str_pad('Pelayan', 15, " ", STR_PAD_RIGHT);
		$label_meja = str_pad('No. Meja', 15," ", STR_PAD_RIGHT);
		$label_jumlah = str_pad('Jumlah Tamu', 15, " ", STR_PAD_RIGHT);
		
		$label_subtotal = str_pad('Sub Total', 25, " ", STR_PAD_LEFT);
		$label_service = str_pad('Serv. Charge 5.5%', 25, " ", STR_PAD_LEFT);
		$label_ppn = str_pad('PB-1 10%', 25, " ", STR_PAD_LEFT);
		$label_totalbill = str_pad('Total Bill', 25, " ", STR_PAD_LEFT);
		$label_grandtotal = str_pad('Grand Total', 25, " ", STR_PAD_LEFT);
		$label_pembayaran = str_pad('Visa Card', 25, " ", STR_PAD_LEFT);
		$label_kembali = str_pad('Kembali', 25, " ", STR_PAD_LEFT);

		// SEPARATOR
		$separator = str_pad(':', 3, " ", STR_PAD_BOTH);

		// VALUE
		$val_tanggal = str_pad(date('n.j.Y', strtotime($header->fd_tanggal_buat)), 22, " ", STR_PAD_RIGHT);
		$val_jam = str_pad(date('H:i', strtotime($header->fd_tanggal_buat)), 22, " ", STR_PAD_RIGHT);
		$val_tamu = str_pad($header->fs_nama_tamu, 22, " ", STR_PAD_RIGHT);
		$val_pelayan = str_pad($header->fs_user_buat, 22, " ", STR_PAD_RIGHT);
		$val_meja = str_pad($header->fs_no_meja, 22, " ", STR_PAD_RIGHT);
		$val_jumlah = str_pad($header->fn_jumlah_tamu, 22, " ", STR_PAD_RIGHT);

		$val_subtotal = str_pad(number_format($header->fn_subtotal), 12, " ", STR_PAD_LEFT);
		$val_service = str_pad(number_format($header->fn_serv_charge), 12, " ", STR_PAD_LEFT);
		$val_ppn = str_pad(number_format($header->fn_ppn), 12, " ", STR_PAD_LEFT);
		$val_totalbill = str_pad(number_format($header->fn_total_bill), 12, " ", STR_PAD_LEFT);
		$val_grandtotal = str_pad(number_format($header->fn_total_bill), 12, " ", STR_PAD_LEFT);
		$val_pembayaran = str_pad(number_format($header->fn_uang_bayar), 12, " ", STR_PAD_LEFT);
		$val_kembali = str_pad(number_format($header->fn_uang_kembali), 12, " ", STR_PAD_LEFT);

		$val_footer = str_pad('TERIMA KASIH', 40, " ", STR_PAD_BOTH);

		/* HEADER */
		$printer->set_justification(phpprint::JUSTIFY_CENTER);
		$printer->text("REMPAH WANGI\n");
		$printer->text("Jl. Fatmawati no. 29 Jak-Sel\n");
		$printer->text("Telp. 021 - 7509168\n");
		$printer->text("Fax. 021 - 7509167\n");
		$printer->text("www.rempahwangi.com\n");

		/* BODY */
		$printer->set_justification(phpprint::JUSTIFY_LEFT);
		$printer->text("========================================\n");

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

		$printer->text("========================================\n");
		if ($detail->num_rows() > 0) {
			foreach ($detail->result() as $value) {
				if (strlen($value->fs_nama_menu) > 25) {
					$produk = substr($value->fs_nama_menu, 0, 22) . '...';
				} else {
					$produk = $value->fs_nama_menu;
				}
				$val_qty = str_pad(number_format($value->fn_qty), 4, " ", STR_PAD_RIGHT);
				$val_produk = str_pad($produk, 25, " ", STR_PAD_RIGHT);
				$val_harga = str_pad(number_format($value->fn_harga), 11, " ", STR_PAD_LEFT);

				$printer->text($val_qty . $val_produk . $val_harga);
				$printer->newline();
			}
		}
		
		$printer->set_justification(phpprint::JUSTIFY_RIGHT);
		$printer->text("----------------------------------------\n");
		$printer->text($label_subtotal . $separator . $val_subtotal);
		$printer->newline();
		$printer->text($label_service . $separator . $val_service);
		$printer->newline();
		$printer->text($label_ppn . $separator . $val_ppn);
		$printer->newline();
		$printer->text("--------------------------------\n");
		$printer->text($label_totalbill . $separator . $val_totalbill);
		$printer->newline();
		$printer->text("--------------------------------\n");
		$printer->text($label_grandtotal . $separator . $val_grandtotal);
		$printer->newline();
		$printer->text("--------------------------------\n");
		$printer->text($label_pembayaran . $separator . $val_pembayaran);
		$printer->newline();
		$printer->text("--------------------------------\n");
		$printer->text($label_kembali . $separator . $val_kembali);
		$printer->newline();
		$printer->newline();
		/* FOOTER */
		$printer->set_justification(phpprint::JUSTIFY_CENTER);
		$printer->text($val_footer);
		$printer->newline();
		
		$printer->cut();
	}

	public function printall($kode) {
		$this->printbill($kode);
		$this->printpaymentbill($kode);
	}
}
