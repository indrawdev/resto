<?php
defined('BASEPATH') OR exit('No direct script access allowed');

	function tanggal_indo($tanggal, $cetak_hari = false)
	{
		$hari = array ( 1 =>    'Senin',
					'Selasa',
					'Rabu',
					'Kamis',
					'Jumat',
					'Sabtu',
					'Minggu'
				);
				
		$bulan = array (1 =>   'Januari',
					'Februari',
					'Maret',
					'April',
					'Mei',
					'Juni',
					'Juli',
					'Agustus',
					'September',
					'Oktober',
					'November',
					'Desember'
				);

		$tgl_indo = '';

		if ($tanggal <> '') {
			$split 	  = explode('-', $tanggal);
			$tgl_indo = $split[2] . ' ' . $bulan[ (int)$split[1] ] . ' ' . $split[0];
			
			if ($cetak_hari) {
				$num = date('N', strtotime($tanggal));
				return $hari[$num] . ', ' . $tgl_indo;
			}
		}
		return $tgl_indo;
	}

	function hari_indo($tanggal)
	{
		$hari = array ( 1 =>    'Senin',
					'Selasa',
					'Rabu',
					'Kamis',
					'Jumat',
					'Sabtu',
					'Minggu'
				);

		if ($tanggal <> '') {
			$num = date('N', strtotime($tanggal));
				return $hari[$num];
		}
	}

	function bulan_indo($param)
	{
		$month = substr($param, 5, 2);
		$year = substr($param, 0, 4);
		$bulan = array (1 =>   'Januari',
					'Februari',
					'Maret',
					'April',
					'Mei',
					'Juni',
					'Juli',
					'Agustus',
					'September',
					'Oktober',
					'November',
					'Desember'
				);
		
		if ($param <> '') {
			return $bulan[ (int)$month ] .' '. $year;
		}
	}

	function bulan($param)
	{
		$month = substr($param, 5, 2);
		$year = substr($param, 0, 4);
		$bulan = array (1 => 'Januari',
					'Februari',
					'Maret',
					'April',
					'Mei',
					'Juni',
					'Juli',
					'Agustus',
					'September',
					'Oktober',
					'November',
					'Desember'
				);
		
		if ($param <> '') {
			return $bulan[ (int)$month ];
		}
	}

	function terbilang ($x) {
		if (!empty($x)) {
			$abil = array("", "SATU", "DUA", "TIGA", "EMPAT", "LIMA", "ENAM", "TUJUH", "DELAPAN", "SEMBILAN", "SEPULUH", "SEBELAS");
			if ($x < 12) {
				return " " . $abil[$x];
			}
			elseif ($x < 20) {
				return Terbilang($x - 10) . " BELAS";
			}
			elseif ($x < 100) {
				return Terbilang($x / 10) . " PULUH" . Terbilang($x % 10);
			}
			elseif ($x < 200) {
				return " SERATUS" . Terbilang($x - 100);
			}
			elseif ($x < 1000) {
				return Terbilang($x / 100) . " RATUS" . Terbilang($x % 100);
			}
			elseif ($x < 2000) {
				return " SERIBU" . Terbilang($x - 1000);
			}
			elseif ($x < 1000000) {
				return Terbilang($x / 1000) . " RIBU" . Terbilang($x % 1000);
			}
			elseif ($x < 1000000000) {
				return Terbilang($x / 1000000) . " JUTA" . Terbilang($x % 1000000);
			}
		}
    }
