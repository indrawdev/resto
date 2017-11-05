<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MLogin extends CI_Model {

	public function __construct() 
	{
		parent::__construct();
		$this->load->database();
	}

	public function checkCaptcha($sCaptcha)
	{
		$xSQL = ("
			SELECT COUNT(*) AS fn_jml FROM captcha
			WHERE word = '".trim($sCaptcha)."' 
			AND ip_address = '".trim($this->input->ip_address())."'
			AND captcha_time >= '".trim($this->session->userdata('vcpt'))."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

	public function validUserPass($sUser, $sPass)
	{
		$xSQL = ("
			SELECT fs_username, 
				fs_password, fs_level_user, fs_ip_address
			FROM tm_user
			WHERE fs_username = '".trim($sUser)."'
			AND fs_password = '".trim($sPass)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL->row();
	}
	
}