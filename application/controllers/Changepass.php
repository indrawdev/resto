<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Changepass extends CI_Controller {

	public function __construct() {
        parent::__construct();
        if ($this->session->userdata('login') <> TRUE) {
            redirect('login');
        }
    }

	public function index() {
		$this->load->view('vchangepass');
	}

	public function username() {
		$user = $this->encryption->decrypt($this->session->userdata('username'));
		$hasil = array(
			'sukses' => true,
			'fs_username' => trim($user)
		);
		echo json_encode($hasil);
	}

	public function ceksave() {
		$this->load->library('form_validation');
		$this->form_validation->set_rules('fs_old_pass', 'Old Password', 'trim|required|min_length[5]|max_length[10]');
		$this->form_validation->set_rules('fs_new_pass', 'New Password', 'trim|required|min_length[5]|max_length[10]');
		$this->form_validation->set_rules('fs_conf_pass', 'Confirm Password', 'trim|required|matches[fs_new_pass]');

		if ($this->form_validation->run() == FALSE) {
			$hasil = array(
				'sukses' => false,
				'hasil' => validation_errors()
			);
			echo json_encode($hasil);
		} else {
			$username = $this->input->post('fs_username');
			$oldpass = md5($this->input->post('fs_old_pass').$username);

			if (!empty($username) && !empty($oldpass)) {
				$this->load->model('MChangePass');
				$sSQL = $this->MChangePass->checkUser($username, $oldpass);
				
				if ($sSQL->num_rows() > 0) {
					$hasil = array(
						'sukses' => true,
						'hasil' => 'Apakah anda yakin, akan mengganti password baru?'
					);
					echo json_encode($hasil);
				} else {
					$hasil = array(
						'sukses' => false,
						'hasil' => 'Password Lama, salah input, silakan coba kembali'
					);
					echo json_encode($hasil);
				}
			} else {
				$hasil = array(
					'sukses' => false,
					'hasil' => 'Ganti Password, Gagal!'
				);
				echo json_encode($hasil);				
			}	
		}
	}

	public function save() {
		$username = $this->input->post('fs_username');
		$oldpass = md5($this->input->post('fs_old_pass').$username);
		$newpass = md5($this->input->post('fs_new_pass').$username);

		$data = array(
				'fs_password' => $newpass,
				'fs_user_edit' => $username,
				'fd_tanggal_edit' => date('Y-m-d H:i:s')
			);
		$where = "fs_username = '".trim($username)."' AND fs_password = '".trim($oldpass)."'";
		$this->db->where($where);
		$this->db->update('tm_user', $data);

		// START LOGGING
		$this->load->model('MLog');
		$this->MLog->logger('CHANGE PASSWORD', $username, 'SUDAH GANTI PASSWORD');
		// END LOGGING
		
		$hasil = array(
					'sukses' => true,
					'hasil' => 'Password User '.trim($username).', sudah diganti!'
				);
		echo json_encode($hasil);
	}

}
