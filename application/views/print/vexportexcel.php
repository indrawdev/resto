<?php
	$filename = 'laporan-'. strtolower($bulan) .'.xls';

	date_default_timezone_set("Asia/Jakarta");
	header('Content-type: application/octet-stream');
	header('Content-Disposition: attachment; filename="'.basename($filename).'"');
	header('Pragma: no-cache');
	header('Expires: 0');
?>
<h1 align="center">LAPORAN REMPAH WANGI - <?php echo strtoupper($bulan); ?>
</h1>

<table border="1" align="left" width="100%" cellpadding="5px">
	<thead>
		<tr>
			<th width="5%" align="center"><strong>NO</strong></th>
			<th width="10%" align="center"><strong>ORDER</strong></th>
			<th width="10%" align="center"><strong>TANGGAL</strong></th>
			<th width="20%" align="center"><strong>TAMU</strong></th>
			<th width="10%" align="center"><strong>MEJA</strong></th>
			<th width="10%" align="center"><strong>SUB TOTAL</strong></th>
			<th width="10%" align="center"><strong>SERV CHARGE</strong></th>
			<th width="10%" align="center"><strong>PPN</strong></th>
			<th width="15%" align="center"><strong>TOTAL</strong></th>
		</tr>
	</thead>
	<tbody>
		<?php $i = 1; ?>
		<?php foreach ($detail->result() as $val) : ?>
		<tr>
			<th width="5%" align="center"><?php echo $i; ?></th>
			<th width="10%" align="center"><?php echo $val->fs_no_order; ?></th>
			<th width="10%" align="center"><?php echo $val->fd_tanggal_buat; ?></th>
			<th width="20%" align="center"><?php echo $val->fs_nama_tamu; ?></th>
			<th width="10%" align="center"><?php echo $val->fs_no_meja; ?></th>
			<th width="10%" align="center"><?php echo $val->fn_subtotal; ?></th>
			<th width="10%" align="center"><?php echo $val->fn_serv_charge; ?></th>
			<th width="10%" align="center"><?php echo $val->fn_ppn; ?></th>
			<th width="15%" align="center"><?php echo $val->fn_total_bill; ?></th>
		</tr>
		<?php $i++; ?>
		<?php endforeach; ?>
	</tbody>
</table>