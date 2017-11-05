<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class MChangePass extends CI_Model {

	public function __construct()
	{
		parent::__construct();
		$this->load->database();
	}

	public function checkUser($sUser, $sOldPass)
	{
		$xSQL = ("
			SELECT fs_username, fs_password
			FROM tm_user
			WHERE fs_username = '".trim($sUser)."'
			AND fs_password = '".trim($sOldPass)."'
		");

		$sSQL = $this->db->query($xSQL);
		return $sSQL;
	}

}