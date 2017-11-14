Ext.Loader.setConfig({
	enabled: true
});

Ext.Loader.setPath('Ext.ux', gBaseUX);

Ext.require([
	'Ext.ux.form.NumericField',
	'Ext.ux.ProgressBarPager',
	'Ext.ProgressBar',
	'Ext.view.View',
]);

Ext.onReady(function() {
	Ext.QuickTips.init();
	Ext.util.Format.thousandSeparator = ',';
	Ext.util.Format.decimalSeparator = '.';

	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

	Ext.Ajax.request({
		method: 'POST',
		url: 'order/getorder',
		success: function(response) {
			var xtext = Ext.decode(response.responseText);
			if (xtext.sukses === true) {
				Ext.getCmp('txtNoOrder').setValue(xtext.fn_counter);
			}
		},
		failure: function(response) {
			var xText = Ext.decode(response.responseText);
			Ext.MessageBox.show({
				buttons: Ext.MessageBox.OK,
				closable: false,
				icon: Ext.MessageBox.INFO,
				message: 'Load default value Failed, Connection Failed!!',
				title: 'RESTO'
			});
		}
	});

	Ext.define('DataGridHeader', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_order', type: 'string'},
			{name: 'fd_tanggal_buat', type: 'string'},
			{name: 'fs_nama_tamu', type: 'string'},
			{name: 'fs_no_meja', type: 'string'},
			{name: 'fn_jumlah_tamu', type: 'string'},
			{name: 'fn_subtotal', type: 'string'},
			{name: 'fn_serv_charge', type: 'string'},
			{name: 'fn_ppn', type: 'string'},
			{name: 'fn_total_bill', type: 'string'}
		]
	});

	Ext.define('DataGridDetail', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_order', type: 'string'},
			{name: 'fs_kode_menu', type: 'string'},
			{name: 'fs_nama_menu', type: 'string'},
			{name: 'fn_qty', type: 'int'},
			{name: 'fn_harga', type: 'string'},
			{name: 'fn_itemtotal', type: 'string'}
		]
	});

	Ext.define('DataGridMenu', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_menu', type: 'string'},
			{name: 'fs_nama_menu', type: 'string'},
			{name: 'fs_kategori_menu', type: 'string'},
			{name: 'fn_harga', type: 'string'}
		]
	});

	var grupOrderHeader = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridHeader',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'order/gridorderhistory'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}
	});

	var grupOrderDetail = Ext.create('Ext.data.Store', {
		autoLoad: false,
		model: 'DataGridDetail',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'order/gridorderdetail'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_no_order': Ext.getCmp('txtNoOrder').getValue()
				});
			}
		}
	});

	var grupMenu = Ext.create('Ext.data.Store', {
		autoLoad: false,
		model: 'DataGridMenu',
		pageSize: 25,
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				rootProperty: 'hasil',
				totalProperty: 'total',
				type: 'json'
			},
			type: 'ajax',
			url: 'order/gridmenu'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCariMenu').getValue()
				});
			}
		}
	});

	var grupMeja = Ext.create('Ext.data.Store', {
		autoLoad: true,
		fields: [
			'fs_kode','fs_nama'
		],
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json'
			},
			type: 'ajax',
			url: 'order/select'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_kode_referensi': 'nomor_meja'
				});
			}
		}
	});

	var grupPembayaran = Ext.create('Ext.data.Store', {
		autoLoad: true,
		fields: [
			'fs_kode','fs_nama'
		],
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json'
			},
			type: 'ajax',
			url: 'order/pembayaran'
		}
	});

	// COUNTING FUNCTION
	function fnEditQty() {
		var record = gridOrderDetail.getSelectionModel().getSelection()[0];
		var xqty = record.get('fn_harga');
		var xharga = record.get('fn_qty');
		var xitemtotal = xqty * xharga;
		record.set('fn_itemtotal', xitemtotal);
		fnTotalBill();
	}

	function fnTotalBill() {
		var xsubtotal = 0;
		var xservcharge = 0;
		var xppntotal = 0;
		var xtotalbill = 0;

		var store = gridOrderDetail.getStore();
		store.each(function(record, idx) {
			xsubtotal = xsubtotal + (record.get('fn_qty') * record.get('fn_harga'));
		});

		xservcharge = xsubtotal * 0.055;
		xppntotal = (xsubtotal + xservcharge) * 0.1;
		xtotalbill = xsubtotal + xservcharge + xppntotal;

		Ext.getCmp('txtSubTotal').setValue(xsubtotal);
		Ext.getCmp('txtServCharge').setValue(xservcharge);
		Ext.getCmp('txtPPN').setValue(xppntotal);
		Ext.getCmp('txtTotalBill').setValue(xtotalbill);
	}

	function fnPembayaran(value) {
		var xtotalbill = 0;
		xtotalbill = Ext.getCmp('txtTotalBill').getValue();
		if (value !== 'CA') {
			Ext.getCmp('txtUangBayar').setValue(xtotalbill);
			return;
		} else {
			Ext.getCmp('txtUangBayar').setValue(0);
			return;
		}
	}

	function fnUangKembali() {
		var xtotalbill = 0;
		var xuangbayar = 0;
		var xuangkembali = 0;

		xtotalbill = Ext.getCmp('txtTotalBill').getValue();
		xuangbayar = Ext.getCmp('txtUangBayar').getValue();
		xuangkembali = xuangbayar - xtotalbill;
		Ext.getCmp('txtUangKembali').setValue(xuangkembali);
	}

	function fnTanpaPajak() {
		var xsubtotal = 0;
		var xservcharge = 0;
		var xppn = 0;

		Ext.getCmp('txtServCharge').setValue(xservcharge);
		Ext.getCmp('txtPPN').setValue(xppn);

		xsubtotal = Ext.getCmp('txtSubTotal').getValue();
		Ext.getCmp('txtTotalBill').setValue(xsubtotal);
	}

	// POPUP MENU
	var winGrid = Ext.create('Ext.grid.Panel',{
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 550,
		sortableColumns: false,
		store: grupMenu,
		columns: [{
			xtype: 'rownumberer',
			width: 45
		},{
			text: 'Kode Menu',
			dataIndex: 'fs_kode_menu',
			menuDisabled: true,
			flex: 0.5
		},{
			text: 'Nama Menu',
			dataIndex: 'fs_nama_menu',
			menuDisabled: true,
			flex: 2
		},{
			text: 'Harga',
			dataIndex: 'fn_harga',
			menuDisabled: true,
			flex: 1,
			renderer: Ext.util.Format.numberRenderer('0,000,000')
		}],
		tbar: [{
			flex: 2.8,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Kode Menu / Nama Menu',
				id: 'txtCariMenu',
				name: 'txtCariMenu',
				xtype: 'textfield'
			}]
		},{
			flex: 0.5,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
					grupMenu.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupMenu,
			items:[
				'-', {
				text: 'Exit',
				handler: function() {
					winCari.hide();
				}
			}]
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('cboKodeMenu').setValue(record.get('fs_kode_menu'));
				Ext.getCmp('txtNamaMenu').setValue(record.get('fs_nama_menu'));
				Ext.getCmp('txtHarga').setValue(record.get('fn_harga'));
				winCari.hide();
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false
		}
	});

	var winCari = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Searching...',
		items: [
			winGrid
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupMenu.load();
				vMask.show();
			}
		}
	});

	// COMPONENT FORM ORDER
	var txtNamaMenu = {
		anchor: '95%',
		fieldLabel: 'Nama Menu',
		fieldStyle: 'background-color: #eee; background-image: none;',
		labelAlign: 'top',
		editable: false,
		id: 'txtNamaMenu',
		name: 'txtNamaMenu',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 30,
		enforceMaxLength: true,
	};

	var txtSubTotal = {
		alwaysDisplayDecimals: true,
		anchor: '98%',
		currencySymbol: 'Rp.',
		decimalPrecision: 0,
		decimalSeparator: '.',
		editable: false,
		fieldLabel: 'Sub Total',
		fieldStyle: 'background-color: #eee; background-image: none; text-align: right;',
		hideTrigger: true,
		id: 'txtSubTotal',
		name: 'txtSubTotal',
		xtype: 'numericfield',
		keyNavEnabled: false,
		mouseWheelEnabled: false,
		thousandSeparator: ',',
		useThousandSeparator: true,
		value: 0
	};

	var txtServCharge = {
		alwaysDisplayDecimals: true,
		anchor: '98%',
		currencySymbol: 'Rp.',
		decimalPrecision: 0,
		decimalSeparator: '.',
		editable: false,
		fieldLabel: 'Serv. Charge',
		fieldStyle: 'background-color: #eee; background-image: none; text-align: right;',
		hideTrigger: true,
		id: 'txtServCharge',
		name: 'txtServCharge',
		xtype: 'numericfield',
		keyNavEnabled: false,
		mouseWheelEnabled: false,
		thousandSeparator: ',',
		useThousandSeparator: true,
		value: 0
	};

	var txtPPN = {
		alwaysDisplayDecimals: true,
		anchor: '97%',
		currencySymbol: 'Rp.',
		decimalPrecision: 0,
		decimalSeparator: '.',
		editable: false,
		fieldLabel: 'PB-1',
		fieldStyle: 'background-color: #eee; background-image: none; text-align: right;',
		hideTrigger: true,
		id: 'txtPPN',
		name: 'txtPPN',
		xtype: 'numericfield',
		keyNavEnabled: false,
		mouseWheelEnabled: false,
		thousandSeparator: ',',
		useThousandSeparator: true,
		value: 0
	};

	var txtTotalBill = {
		alwaysDisplayDecimals: true,
		anchor: '98%',
		currencySymbol: 'Rp.',
		decimalPrecision: 0,
		decimalSeparator: '.',
		editable: false,
		fieldLabel: 'TOTAL BILL',
		fieldStyle: 'background-color: #eee; background-image: none; text-align: right;',
		hideTrigger: true,
		id: 'txtTotalBill',
		name: 'txtTotalBill',
		xtype: 'numericfield',
		keyNavEnabled: false,
		mouseWheelEnabled: false,
		thousandSeparator: ',',
		useThousandSeparator: true,
		value: 0
	};

	var txtUangBayar = {
		alwaysDisplayDecimals: true,
		anchor: '98%',
		currencySymbol: '',
		decimalPrecision: 0,
		decimalSeparator: '.',
		editable: true,
		fieldLabel: 'Uang Bayar',
		fieldStyle: 'background-image: none; text-align: right;',
		hideTrigger: true,
		id: 'txtUangBayar',
		name: 'txtUangBayar',
		xtype: 'numericfield',
		keyNavEnabled: true,
		mouseWheelEnabled: false,
		thousandSeparator: ',',
		useThousandSeparator: true,
		value: 0,
		listeners: {
			change: function(value) {
				fnUangKembali();
			}
		}
	};

	var txtUangKembali = {
		alwaysDisplayDecimals: true,
		anchor: '98%',
		currencySymbol: '',
		decimalPrecision: 0,
		decimalSeparator: '.',
		editable: false,
		fieldLabel: 'Uang Kembali',
		fieldStyle: 'background-color: #eee; background-image: none; text-align: right;',
		hideTrigger: true,
		id: 'txtUangKembali',
		name: 'txtUangKembali',
		xtype: 'numericfield',
		keyNavEnabled: false,
		mouseWheelEnabled: false,
		thousandSeparator: ',',
		useThousandSeparator: true,
		value: 0
	};

	var txtNoOrder = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '90%',
		fieldLabel: 'No. Order',
		fieldStyle: 'background-color: #eee; background-image: none;',
		id: 'txtNoOrder',
		name: 'txtNoOrder',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 30,
		enforceMaxLength: true
	};

	var txtNamaTamu = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '90%',
		fieldLabel: 'Nama Tamu',
		id: 'txtNamaTamu',
		name: 'txtNamaTamu',
		xtype: 'textfield',
		value: 'UMUM',
		minValue: 0,
		maxLength: 45,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var cboMeja = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '60%',
		displayField: 'fs_nama',
		editable: false,
		fieldLabel: 'No. Meja',
		id: 'cboMeja',
		name: 'cboMeja',
		store: grupMeja,
		valueField: 'fs_kode',
		xtype: 'combobox'
	};

	var txtJumlahTamu = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '60%',
		fieldLabel: 'Jumlah Tamu',
		id: 'txtJumlahTamu',
		name: 'txtJumlahTamu',
		xtype: 'numberfield',
		minValue: 0,
		maxLength: 3,
		enforceMaxLength: true
	};

	var cboPembayaran = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '60%',
		displayField: 'fs_nama',
		editable: false,
		fieldLabel: 'Pembayaran',
		id: 'cboPembayaran',
		name: 'cboPembayaran',
		store: grupPembayaran,
		valueField: 'fs_kode',
		xtype: 'combobox',
		listeners: {
			change: function(value) {

			}
		}
	};

	var checkPajak = {
		boxLabel: 'Include (TAX)',
		id: 'checkPajak',
		name: 'checkPajak',
		xtype: 'checkboxfield',
		checked: true,
		listeners: {
			change: function(checkbox, isChecked) {
				if (isChecked) {
					fnTotalBill();
				}
				else {
					fnTanpaPajak();
				}
			}
		}
	};

	var cellEditingQty = Ext.create('Ext.grid.plugin.CellEditing', {
		clicksToEdit: 2,
		listeners: {
			edit: function(editor, e) {
				fnEditQty();
			}
		}
	});

	// GRID DETAIL
	var gridOrderDetail = Ext.create('Ext.grid.Panel', {
		anchor: '100%',
		defaultType: 'textfield',
		height: 225,
		sortableColumns: false,
		store: grupOrderDetail,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			dataIndex: 'fs_kode_menu',
			text: 'Kode',
			flex: 0.5,
			menuDisabled: true
		},{
			dataIndex: 'fs_nama_menu',
			text: 'Nama Menu',
			flex: 1.5,
			menuDisabled: true
		},{
			dataIndex: 'fn_qty',
			text: 'Qty',
			flex: 0.3,
			menuDisabled: true,
			editor: {
				editable: true,
				xtype: 'numberfield'
			}
		},{
			dataIndex: 'fn_harga',
			text: 'Harga',
			flex: 0.8,
			menuDisabled: true,
			renderer: Ext.util.Format.numberRenderer('0,000,000')
		},{
			dataIndex: 'fn_itemtotal',
			text: 'Total',
			flex: 0.8,
			menuDisabled: true,
			renderer: Ext.util.Format.numberRenderer('0,000,000')
		}],
		tbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '97%',
				emptyText: 'Kode Menu',
				fieldLabel: 'Kode',
				labelAlign: 'top',
				editable: false,
				id: 'cboKodeMenu',
				name: 'cboKodeMenu',
				xtype: 'textfield',
				triggers: {
					reset: {
						cls: 'x-form-clear-trigger',
						handler: function(field) {
							field.setValue('');
						}
					},
					cari: {
						cls: 'x-form-search-trigger',
						handler: function() {
							winCari.show();
							winCari.center();
						}
					}
				}
			}]
		},{
			flex: 1.5,
			layout: 'anchor',
			xtype: 'container',
			items: [
				txtNamaMenu
			]
		},{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [
				Ext.create('Ext.ux.form.NumericField', {
					alwaysDisplayDecimals: true,
					anchor: '98%',
					currencySymbol: null,
					decimalPrecision: 0,
					decimalSeparator: '.',
					fieldLabel: 'Harga',
					fieldStyle: 'background-color: #eee; background-image: none; text-align: right;',
					hideTrigger: true,
					id: 'txtHarga',
					name: 'txtHarga',
					editable: false,
					keyNavEnabled: false,
					labelAlign: 'top',
					mouseWheelEnabled: false,
					thousandSeparator: ',',
					useThousandSeparator: true,
				})
			]
		},{
			xtype: 'buttongroup',
			columns: 1,
			defaults: {
				scale: 'small'
			},
			items: [{
				iconCls: 'icon-add',
				text: 'Add',
				handler: function() {
					var xtotal = grupOrderDetail.getCount();

					var xkode = Ext.getCmp('cboKodeMenu').getValue();
					var xdata = Ext.create('DataGridDetail', {
						fs_kode_menu: Ext.getCmp('cboKodeMenu').getValue(),
						fs_nama_menu: Ext.getCmp('txtNamaMenu').getValue(),
						fn_qty: '0',
						fn_harga: Ext.getCmp('txtHarga').getValue(),
						fn_itemtotal: '0'
					});

					var store = gridOrderDetail.getStore();
					var xlanjut = true;

					store.each(function(record, idx) {
						var xtext = record.get('fs_kode_menu');
						if (xtext == xkode) {
							Ext.MessageBox.show({
								buttons: Ext.MessageBox.OK,
								closable: false,
								icon: Ext.Msg.WARNING,
								msg: 'Menu sudah ada di List...',
								title: 'RESTO'
							});
							xlanjut = false;
						}
					});

					if (xlanjut === false) {
						return;
					}

					var xnama = Ext.getCmp('txtNamaMenu').getValue();
					if (xnama === '') {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.Msg.WARNING,
							msg: 'Nama Menu, belum diisi..',
							title: 'RESTO'
						});
						return;
					}

					var xharga = Ext.getCmp('txtHarga').getValue();
					if (xharga === '') {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.Msg.WARNING,
							msg: 'Harga, belum diisi..',
							title: 'RESTO'
						});
						return;
					}

					grupOrderDetail.insert(xtotal, xdata);
					Ext.getCmp('cboKodeMenu').setValue('');
					Ext.getCmp('txtNamaMenu').setValue('');
					Ext.getCmp('txtHarga').setValue('');

					xtotal = grupOrderDetail.getCount() - 1;
					gridOrderDetail.getSelectionModel().select(xtotal);
				}
			},{
				iconCls: 'icon-delete',
				itemId: 'removeData',
				text: 'Delete',
				handler: function() {
					var sm = gridOrderDetail.getSelectionModel();
					grupOrderDetail.remove(sm.getSelection());
					gridOrderDetail.getView().refresh();
					if (grupOrderDetail.getCount() > 0) {
						sm.select(0);
					}
					gridOrderDetail.getView().refresh();
					fnTotalBill();
				},
				disabled: true
			}]
		}],
		bbar: [{
			flex: 1,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				id: 'txtToolTip',
				labelWidth: 65,
				name: 'txtToolTip',
				value: '<* Double click on the Qty>',
				xtype: 'displayfield'
			}]
		}],
		plugins: [
			cellEditingQty
		],
		listeners: {
			selectionchange: function(view, records) {
				gridOrderDetail.down('#removeData').setDisabled(!records.length);
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		}
	});

	// GRID HISTORY
	var gridOrderHistory = Ext.create('Ext.grid.Panel', {
		anchor: '100%',
		defaultType: 'textfield',
		height: 400,
		sortableColumns: false,
		store: grupOrderHeader,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'No. Order',
			dataIndex: 'fs_no_order',
			menuDisabled: true,
			flex: 0.5
		},{
			text: 'Tanggal',
			dataIndex: 'fd_tanggal_buat',
			menuDisabled: true,
			flex: 0.5,
			renderer: Ext.util.Format.dateRenderer('d-m-Y')
		},{
			text: 'Nama Tamu',
			dataIndex: 'fs_nama_tamu',
			menuDisabled: true,
			flex: 1.2
		},{
			text: 'No. Meja',
			dataIndex: 'fs_no_meja',
			menuDisabled: true,
			flex: 0.5
		},{
			text: 'Sub. Total',
			dataIndex: 'fn_subtotal',
			menuDisabled: true,
			flex: 0.5,
			renderer: Ext.util.Format.numberRenderer('0,000,000')
		},{
			text: 'Serv. Charge',
			dataIndex: 'fn_serv_charge',
			menuDisabled: true,
			flex: 0.5,
			renderer: Ext.util.Format.numberRenderer('0,000,000')
		},{
			text: 'PPN',
			dataIndex: 'fn_ppn',
			menuDisabled: true,
			flex: 0.5,
			renderer: Ext.util.Format.numberRenderer('0,000,000')
		},{
			text: 'Total',
			dataIndex: 'fn_total_bill',
			menuDisabled: true,
			flex: 1,
			renderer: Ext.util.Format.numberRenderer('0,000,000')
		},{
			width: 80,
			align: 'center',
			renderer: function(val, meta, rec) {
				var id = Ext.id();
				Ext.defer(function() {
					Ext.widget('button', {
						renderTo: id,
						text: 'REPRINT',
						scale: 'small',
						handler: function() {
							var xorder = rec.get('fs_no_order');
							// CALL BACK
							fnRePrint(xorder);
						}
					});
				}, 50);
				return Ext.String.format('<div id="{0}"></div>', id);
			}
		}],
		tbar: [{
			flex: 2.8,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'No. Order / Nama Tamu',
				id: 'txtCari',
				name: 'txtCari',
				xtype: 'textfield'
			}]
		},{
			flex: 0.5,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
					grupOrderHeader.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupOrderHeader
		}),
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		}
	});


	// FUNCTIONS
	function fnReset() {
		Ext.getCmp('txtNoOrder').setValue('');
		Ext.getCmp('txtNamaTamu').setValue('');
		Ext.getCmp('cboMeja').setValue('');
		Ext.getCmp('txtJumlahTamu').setValue('');
		Ext.getCmp('cboPembayaran').setValue('');
		Ext.getCmp('txtSubTotal').setValue(0);
		Ext.getCmp('txtServCharge').setValue(0);
		Ext.getCmp('txtPPN').setValue(0);
		Ext.getCmp('txtTotalBill').setValue(0);
		Ext.getCmp('txtUangBayar').setValue(0);
		Ext.getCmp('txtUangKembali').setValue(0);

		// LOAD DATA DETAIL
		grupOrderDetail.load();
	}

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'order/ceksave',
				params: {
					'fs_no_order': Ext.getCmp('txtNoOrder').getValue()
				},
				success: function(response) {
					var xtext = Ext.decode(response.responseText);
					if (xtext.sukses === false) {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.MessageBox.INFO,
							msg: xtext.hasil,
							title: 'RESTO'
						});
					} else {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.YESNO,
							closable: false,
							icon: Ext.Msg.QUESTION,
							msg: xtext.hasil,
							title: 'RESTO',
							fn: function(btn) {
								if (btn == 'yes') {
									fnSave();
								}
							}
						});
					}
				},
				failure: function(response) {
					var xtext = Ext.decode(response.responseText);
					Ext.MessageBox.show({
						buttons: Ext.MessageBox.OK,
						closable: false,
						icon: Ext.MessageBox.INFO,
						msg: 'Saving Failed, Connection Failed!!',
						title: 'RESTO'
					});
					fnMaskHide();
				}
			});
		}
	}

	function fnSave() {
		xkode = '';
		xqty = '';
		xharga = '';
		xitemtotal = '';

		var store = gridOrderDetail.getStore();
		store.each(function(record, idx) {
			xkode = xkode +'|'+ record.get('fs_kode_menu');
			xqty = xqty +'|'+ record.get('fn_qty');
			xharga = xharga +'|'+ record.get('fn_harga');
			xitemtotal = xitemtotal +'|'+ record.get('fn_itemtotal');
		});

		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);

		Ext.Ajax.request({
			method: 'POST',
			url: 'order/save',
			params: {
				'fs_no_order': Ext.getCmp('txtNoOrder').getValue(),
				'fs_nama_tamu': Ext.getCmp('txtNamaTamu').getValue(),
				'fs_no_meja': Ext.getCmp('cboMeja').getValue(),
				'fn_jumlah_tamu': Ext.getCmp('txtJumlahTamu').getValue(),
				'fs_kode_pembayaran': Ext.getCmp('cboPembayaran').getValue(),
				'fn_subtotal': Ext.getCmp('txtSubTotal').getValue(),
				'fn_serv_charge': Ext.getCmp('txtServCharge').getValue(),
				'fn_ppn': Ext.getCmp('txtPPN').getValue(),
				'fn_total_bill': Ext.getCmp('txtTotalBill').getValue(),
				'fn_uang_bayar': Ext.getCmp('txtUangBayar').getValue(),
				'fn_uang_kembali': Ext.getCmp('txtUangKembali').getValue(),
				'fs_kode_menu': xkode,
				'fn_qty': xqty,
				'fn_harga': xharga,
				'fn_itemtotal': xitemtotal
			},
			success: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: xtext.hasil,
					title: 'RESTO'
				});
				fnReset();
				// LOAD DATA
				grupOrderHeader.load();
				// SET NO ORDER
				Ext.getCmp('txtNoOrder').setValue(xtext.counter);
			},
			failure: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: 'Saving Failed, Connection Failed!!',
					title: 'RESTO'
				});
				fnMaskHide();
			}
		});
	}

	function fnRePrint(xorder) {
		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);

		Ext.Ajax.request({
			method: 'POST',
			url: 'order/printall/' + xorder,
			success: function(response) {
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: 'Cetak Billing, Sukses!!',
					title: 'RESTO'
				});
			},
			failure: function(response) {
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					message: 'Load default value Failed, Connection Failed!!',
					title: 'RESTO'
				});
			}
		});
	}

	var frmOrder = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Order',
		width: 930,
		items: [{
			activeTab: 0,
			bodyStyle: 'padding: 5px; background-color: '.concat(gBasePanel),
			border: false,
			plain: true,
			xtype: 'tabpanel',
			items: [{
				id: 'tab1',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'Form Order',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 130,
						msgTarget: 'side'
					},
					xtype: 'fieldset',
					title: 'Form Order',
					style: 'padding: 5px;',
					items: [
						gridOrderDetail
					]
				},{
					xtype: 'fieldset',
					style: 'padding: 5px;',
					items: [{
						anchor: '100%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [
								txtNoOrder,
								txtNamaTamu,
								cboMeja,
								txtJumlahTamu,
								cboPembayaran
							]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [
								txtSubTotal,
								txtServCharge,
								{
									anchor: '100%',
									layout: 'hbox',
									xtype: 'container',
									items: [{
										flex: 1,
										layout: 'anchor',
										xtype: 'container',
										items: [
											checkPajak
										]
									},{
										flex: 2,
										layout: 'anchor',
										xtype: 'container',
										items: [
											txtPPN
										]
									}]
								},
								txtTotalBill,
								txtUangBayar,
								txtUangKembali
							]
						}]
					}]
				}],
				buttons: [{
					iconCls: 'icon-print',
					id: 'btnSave',
					name: 'btnSave',
					text: 'Save & Print',
					scale: 'medium',
					handler: fnCekSave
				},{
					iconCls: 'icon-reset',
					text: 'Reset',
					scale: 'medium',
					handler: fnReset
				}]
			},{
				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'Order History',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					anchor: '100%',
					xtype: 'fieldset',
					title: 'Order History',
					style: 'padding: 5px;',
					items: [
						gridOrderHistory
					]
				}]
			}]
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmOrder
	});

	function fnMaskShow() {
		frmOrder.mask('Please wait...');
	}

	function fnMaskHide() {
		frmOrder.unmask();
	}
	
	frmOrder.render(Ext.getBody());
	Ext.get('loading').destroy();
});