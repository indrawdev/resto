<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Masteruser extends CI_Controller {

	public function __construct() {
        parent::__construct();
        if ($this->session->userdata('login') <> TRUE) {
            redirect('login');
        }
    }
    
	public function index() {
		$this->load->view('vmasteruser');
	}

	// TAB SETUP LEVEL
	public function gridlevel() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MMasterUser');
		$sSQL = $this->MMasterUser->listLevelAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterUser->listLevel($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0)  {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
						'fs_kd_parent' => trim($xRow->fs_kd_parent),
						'fs_kd_child' => trim($xRow->fs_kd_child),
						'fs_level' => trim($xRow->fs_level),
						'fs_index' => trim($xRow->fs_index)
					);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	// TAB DAFTAR USER
	public function griduser() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MMasterUser');
		$sSQL = $this->MMasterUser->listUserAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterUser->listUser($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0) {
			foreach ($sSQL->result() as $xRow) {
				$xArr[] = array(
						'fs_username' => trim($xRow->fs_username),
						'fs_level_user' => trim($xRow->fs_level_user),
						'fd_last_login' => trim($xRow->fd_last_login),
						'fd_tanggal_buat' => trim($xRow->fd_tanggal_buat)
					);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	// TAB ACTIVITY
	public function gridactivity() {
		$sCari = trim($this->input->post('fs_cari'));
		$nStart = trim($this->input->post('start'));
		$nLimit = trim($this->input->post('limit'));

		$this->db->trans_start();
		$this->load->model('MMasterUser');
		$sSQL = $this->MMasterUser->listActivityAll($sCari);
		$xTotal = $sSQL->num_rows();
		$sSQL = $this->MMasterUser->listActivity($sCari, $nStart, $nLimit);
		$this->db->trans_complete();

		$xArr = array();
		if ($sSQL->num_rows() > 0)
		{
			foreach ($sSQL->result() as $xRow)
			{
				$xArr[] = array(
						'fd_time' => trim(date_format(date_create($xRow->log_time), 'd/m/Y H:i:s')),
						'fs_log' => trim($xRow->log_name),
						'fs_user' => trim($xRow->log_user),
						'fs_message' => trim($xRow->log_message)
					);
			}
		}
		echo '({"total":"'.$xTotal.'","hasil":'.json_encode($xArr).'})';
	}

	// FUNCTION FORM SETUP USER
	public function ceksaveuser() {
		$this->load->library('form_validation');
		$this->form_validation->set_rules('fs_username', 'Username', 'trim|required|min_length[3]|max_length[10]');
		$this->form_validation->set_rules('fs_password', 'Password', 'trim|required|min_length[5]|max_length[10]');
		$this->form_validation->set_rules('fs_confpass', 'Confirm Password', 'required|matches[fs_password]');

		if ($this->form_validation->run() == FALSE) {
			$hasil = array(
				'sukses' => false,
				'hasil' => validation_errors()
			);
			echo json_encode($hasil);
		} else {
			$username = $this->input->post('fs_username');

			if (!empty($username)) {
				$this->load->model('MMasterUser');
				$xSQL = $this->MMasterUser->checkUser($username);
				if ($xSQL->num_rows() > 0) {
					$hasil = array(
							'sukses' => true,
							'hasil' => 'Username '.trim($username).', sudah terdaftar, apakah Anda ingin meng-update?'
						);
					echo json_encode($hasil);
				} else {
					$hasil = array(
							'sukses' => true,
							'hasil' => 'Username '.trim($username).', belum terdaftar, apakah Anda ingin membuat user baru?'
						);
					echo json_encode($hasil);
				}
			} else {
				$hasil = array(
					'sukses' => false,
					'hasil' => 'Simpan, Gagal!'
				);
				echo json_encode($hasil);
			}
		}
	}

	public function saveuser() {
		$user = $this->encryption->decrypt($this->session->userdata('username'));
		$username = $this->input->post('fs_username');

		// MD5 (PASS + USERNAME) & (PIN + USERNAME)
		$password = md5($this->input->post('fs_password').$username);
		$pin = md5($this->input->post('fs_pin').$username);

		$update = false;
		$this->load->model('MMasterUser');
		$xSQL = $this->MMasterUser->checkUser($username);
		
		if ($xSQL->num_rows() > 0) {
			$update = true;
		}

		$dt = array(
			'fs_username' => trim($username),
			'fs_password' => trim($password),
			'fs_level_user' => $this->input->post('fs_level_user'),
			'fs_ip_address' => $this->input->ip_address()
		);

		if ($update == false) {
			// INSERT TM USER
			$dt1 = array(
				'fs_user_buat' => trim($user),
				'fd_tanggal_buat' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt1);
			$this->db->insert('tm_user', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('BUAT USER', $user, 'USER BARU '.trim($username).' SUDAH DIBUAT');
			// END LOGGING

			$hasil = array(
					'sukses' => true,
					'hasil' => 'User baru '.trim($username).', sudah dibuat!'
				);
			echo json_encode($hasil);
		} else {
			// UPDATE TM USER
			$dt2 = array(
				'fs_user_edit' => trim($user),
				'fd_tanggal_edit' => date('Y-m-d H:i:s')
			);

			$data = array_merge($dt, $dt2);
			$where = "fs_username = '".trim($username)."'";
			$this->db->where($where);
			$this->db->update('tm_user', $data);

			// START LOGGING
			$this->load->model('MLog');
			$this->MLog->logger('EDIT USER', $user, 'USER '.trim($username).' SUDAH DIEDIT');
			// END LOGGING

			$hasil = array(
					'sukses' => true,
					'hasil' => 'Update user '.trim($username).', sukses!'
				);
			echo json_encode($hasil);
		}
	}

	// FUNCTION FORM SETUP LEVEL
	public function ceksavelevel() {
		$level = $this->input->post('fs_level');
		if (!empty($level)) {

			$this->load->model('MMasterUser');
			$ssql = $this->MMasterUser->checkAkses($level);

			if ($ssql->num_rows() > 0) {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Kode Hak Akses sudah ada, apakah Anda ingin meng-update?'
				);
				echo json_encode($hasil);
			} else {
				$hasil = array(
					'sukses' => true,
					'hasil' => 'Kode Hak Akses belum ada, apakah Anda ingin tambah baru?'
				);
				echo json_encode($hasil);
			}
		} else {
			$hasil = array(
				'sukses' => false,
				'hasil' => 'Simpan, Gagal! Kode Hak Akses tidak diketahui'
			);
			echo json_encode($hasil);
		}
	}

	public function savelevel() {
		$level = $this->input->post('fs_level');

		$this->load->model('MMasterUser');
		$ssql = $this->MMasterUser->checkAkses($level);
		$update = false;

		if ($ssql->num_rows() > 0) {
			$update = true;
		}

		$where = "fs_level = '".trim($level)."'";
		$this->db->where($where);
		$this->db->delete('tm_parlevel');

		$kdinduk = explode('|', trim($this->input->post('fs_kd_induk')));
		$kdmenu = explode('|', trim($this->input->post('fs_kd_menu')));
		$jml = count($kdinduk) - 1;

		if ($jml != 0) {
			for ($i=1; $i<=$jml; $i++) {
				if (strlen(trim($kdinduk[$i])) == 2 and trim($kdmenu[$i]) == '') {
					$kdroot = '1';
				} else {
					$kdroot = '0';
				}
				$data = array(
							'fs_kd_parent' => trim($kdinduk[$i]),
							'fs_kd_child' => trim($kdmenu[$i]),
							'fs_level' => trim($level),
							'fs_index' => '1'
						);
				$this->db->insert('tm_parlevel', $data);
			}
		}

		if ($update == false) {
			$hasil = array(
						'sukses' => true,
						'hasil' => 'Saving Level Success'
					);
			echo json_encode($hasil);
		} else {
			$hasil = array(
						'sukses' => true,
						'hasil' => 'Saving Level Update Success'
					);
			echo json_encode($hasil);
		}	
	}

	public function ambilnodes() {
		$level = $this->input->post('fs_level');
		$this->load->model('MMasterUser');
		$ssql = $this->MMasterUser->loadMenu($level);

		$arr0 = array();
		$arr1 = array();
		$arr2 = array();
		$arr3 = array();
		$arr4 = array();

		if ($ssql->num_rows() > 0) {
			foreach ($ssql->result() as $row0) {
				if (trim($row0->fs_kd_child) == '') {
					$i = 0;
					foreach ($ssql->result() as $row1) {
						if (strlen(trim($row1->fs_kd_parent)) == strlen(trim($row0->fs_kd_parent)) and trim($row1->fs_kd_parent) == trim($row0->fs_kd_parent) and trim($row1->fs_kd_child) <> '') {
							++$i;
						}
					}
					if ($i == 0) {
						if (trim($row0->fs_nm_formweb) <> '') {
							$arr0[] = array(
									'fs_kd_induk' => $row0->fs_kd_parent,
									'fs_kd_menu' => $row0->fs_kd_child,
									'fs_nm_menu' => $row0->fs_nm_menu,
									'fb_tambah' => $row0->fb_tambah,
									'expanded' => true,
									'leaf' => true
								);
						}
					} else {
						$arr1 = array();
						foreach ($ssql->result() as $row1) {
							if ((strlen(trim($row1->fs_kd_parent)) == strlen(trim($row0->fs_kd_parent))) and (trim($row1->fs_kd_parent) == trim($row0->fs_kd_parent)) and trim($row1->fs_kd_child) <> '') {
								$i = 0;
								foreach ($ssql->result() as $row2) {
									if (strlen(trim($row2->fs_kd_parent)) == strlen(trim($row1->fs_kd_child)) and trim($row2->fs_kd_parent) == trim($row1->fs_kd_child)) {
										++$i;
									}
								}
								if ($i == 0) {
									if (trim($row1->fs_nm_formweb) <> '') {
										$arr1[] = array(
												'fs_kd_induk' => $row1->fs_kd_parent,
												'fs_kd_menu' => $row1->fs_kd_child,
												'fs_nm_menu' => $row1->fs_nm_menu,
												'fb_tambah' => $row1->fb_tambah,
												'expanded' => true,
												'leaf' => true
											);
									}
								} else {
									$arr2 = array();
									foreach ($ssql->result() as $row2) {
										if (strlen(trim($row2->fs_kd_parent)) == strlen(trim($row1->fs_kd_child))
											and trim($row2->fs_kd_parent) == trim($row1->fs_kd_child)) {
											$i = 0;
											foreach ($ssql->result() as $row3) {
												if (strlen(trim($row3->fs_kd_parent)) == strlen(trim($row2->fs_kd_child)) and trim($row3->fs_kd_parent) == trim($row2->fs_kd_child)) {
													++$i;
												}
											}
											if ($i == 0) {
												if (trim($row2->fs_nm_formweb) <> '') {
													$arr2[] = array(
															'fs_kd_induk' => $row2->fs_kd_parent,
															'fs_kd_menu' => $row2->fs_kd_child,
															'fs_nm_menu' => $row2->fs_nm_menu,
															'fb_tambah' => $row2->fb_tambah,
															'expanded' => true,
															'leaf' => true
														);
												}
											} else {
												$arr3 = array();
												foreach ($ssql->result() as $row3) {
													if (strlen(trim($row3->fs_kd_parent)) == strlen(trim($row2->fs_kd_child)) and trim($row3->fs_kd_parent) == trim($row2->fs_kd_child)) {
														$i = 0;
														foreach ($ssql->result() as $row4) {
															if (strlen(trim($row4->fs_kd_parent)) == strlen(trim($row3->fs_kd_child)) and trim($row4->fs_kd_parent) == trim($row3->fs_kd_child)) {
																++$i;
															}
														}
														if ($i == 0) {
															if (trim($row3->fs_nm_formweb) <> '') {
																$arr3[] = array(
																		'fs_kd_induk' => $row3->fs_kd_parent,
																		'fs_kd_menu' => $row3->fs_kd_child,
																		'fs_nm_menu' => $row3->fs_nm_menu,
																		'fb_tambah' => $row3->fb_tambah,
																		'expanded' => true,
																		'leaf' => true
																	);
															}
														} else {
															$arr4 = array();
															foreach ($ssql->result() as $row4) {
																if (strlen(trim($row4->fs_kd_parent)) == strlen(trim($row3->fs_kd_child)) and trim($row4->fs_kd_parent) == trim($row3->fs_kd_child)) {
																	if (trim($row4->fs_nm_formweb) <> '') {
																		$arr4[] = array(
																				'fs_kd_induk' => $row4->fs_kd_parent,
																				'fs_kd_menu' => $row4->fs_kd_child,
																				'fs_nm_menu' => $row4->fs_nm_menu,
																				'fb_tambah' => $row4->fb_tambah,
																				'expanded' => true,
																				'leaf' => true
																			);
																	}
																}
															}
															$arr3[] = array(
																'fs_kd_induk' => $row3->fs_kd_parent,
																'fs_kd_menu' => $row3->fs_kd_child,
																'fs_nm_menu' => $row3->fs_nm_menu,
																'fb_tambah' => $row3->fb_tambah,
																'expanded' => true,
																'leaf' => false,
																'children' => $arr4
															);
														}
													}
												}
												$arr2[] = array(
													'fs_kd_induk' => $row2->fs_kd_parent,
													'fs_kd_menu' => $row2->fs_kd_child,
													'fs_nm_menu' => $row2->fs_nm_menu,
													'fb_tambah' => $row2->fb_tambah,
													'expanded' => true,
													'leaf' => false,
													'children' => $arr3
												);
											}
										}
									}
									$arr1[] = array(
										'fs_kd_induk' => $row1->fs_kd_parent,
										'fs_kd_menu' => $row1->fs_kd_child,
										'fs_nm_menu' => $row1->fs_nm_menu,
										'fb_tambah' => $row1->fb_tambah,
										'expanded' => true,
										'leaf' => false,
										'children' => $arr2
									);
								}
							}
						}
						$arr0[] = array(
							'fs_kd_induk' => $row0->fs_kd_parent,
							'fs_kd_menu' => $row0->fs_kd_child,
							'fs_nm_menu' => $row0->fs_nm_menu,
							'fb_tambah' => $row0->fb_tambah,
							'expanded' => true,
							'leaf' => false,
							'children' => $arr1
						);
					}
				}
			}
		}
		echo json_encode($arr0);
	}

}