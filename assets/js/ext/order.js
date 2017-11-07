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

	Ext.define('DataGridOrderHeader', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_order', type: 'string'},
			{name: 'fd_tanggal_order', type: 'string'},
			{name: 'fs_nama_tamu', type: 'string'},
			{name: 'fs_no_meja', type: 'string'},
			{name: 'fn_jumlah_tamu', type: 'string'},
			{name: 'fn_subtotal', type: 'string'},
			{name: 'fn_serv_charge', type: 'string'},
			{name: 'fn_ppn', type: 'string'},
			{name: 'fn_total_bill', type: 'string'}
		]
	});

	Ext.define('DataGridOrderDetail', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_no_order', type: 'string'},
			{name: 'fs_kode_menu', type: 'string'},
			{name: 'fn_harga', type: 'string'}
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
		model: 'DataGridOrderHeader',
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
			url: 'order/gridorderheader'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					//'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}
	});

	var grupOrderDetail = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridOrderDetail',
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
			renderer: Ext.util.Format.numberRenderer('0,000,000,-')
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
	var txtNoOrder = {
		id: 'txtNoOrder',
		name: 'txtNoOrder',
		xtype: 'textfield',
		hidden: true
	};

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
		anchor: '98%',
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
		enforceMaxLength: true
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

	// GRID ORDER
	var gridOrder = Ext.create('Ext.grid.Panel', {
		anchor: '100%',
		defaultType: 'textfield',
		height: 225,
		sortableColumns: false,
		store: '',
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
			menuDisabled: true
		},{
			dataIndex: 'fn_harga',
			text: 'Harga',
			flex: 0.8,
			menuDisabled: true,
			renderer: Ext.util.Format.numberRenderer('0,000,000,-')
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
				id: 'cboKodeMenu',
				name: 'cboKodeMenu',
				xtype: 'textfield',
				listeners: {
					change: function(field, newValue) {

					}
				},
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
					//value: 0,
					listeners: {
						change: function(value) {
							if (Ext.isEmpty(Ext.getCmp('txtHarga').getValue())) {
								Ext.getCmp('txtHarga').setValue(0);
							}
							else {
								//LuxTax();
								//return value;
							}
						}
					}
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

					var xdata = Ext.create('DataGridOrderDetail', {
						fs_kode_menu: Ext.getCmp('cboKodeMenu').getValue(),
						fs_nama_menu: Ext.getCmp('txtNamaMenu').getValue(),
					});
				}
			},{
				iconCls: 'icon-delete',
				itemId: 'removeData',
				text: 'Delete',
				handler: function() {

				},
				disabled: true
			}]
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: ''
		}),
		listeners: {
			selectionchange: function(view, records) {
				gridOrder.down('#removeData').setDisabled(!records.length);
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
	var gridHistory = Ext.create('Ext.grid.Panel', {
		anchor: '100%',
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: '',
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'No. Order',
			dataIndex: 'fs_kode_referensi',
			menuDisabled: true,
			width: 130
		},{
			text: 'Tanggal',
			dataIndex: 'fd_tanggal_order',
			menuDisabled: true,
			width: 50
		},{
			text: 'Nama Tamu',
			dataIndex: 'fs_nama_tamu',
			menuDisabled: true,
			width: 50
		},{
			text: 'No. Meja',
			dataIndex: 'fs_no_meja',
			menuDisabled: true,
			width: 200
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: ''
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
		Ext.getCmp('txtNamaTamu').setValue('');
		Ext.getCmp('cboMeja').setValue('');
		Ext.getCmp('txtJumlahTamu').setValue('');
		Ext.getCmp('txtSubTotal').setValue(0);
		Ext.getCmp('txtServCharge').setValue(0);
		Ext.getCmp('txtPPN').setValue(0);
		Ext.getCmp('txtTotalBill').setValue(0);
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
		xkodemenu = '';
		xhargamenu = '';

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
				'fn_subtotal': Ext.getCmp('txtSubTotal').getValue(),
				'fn_serv_charge': Ext.getCmp('txtServCharge').getValue(),
				'fn_ppn': Ext.getCmp('txtPPN').getValue(),
				'fn_total_bill': Ext.getCmp('txtTotalBill').getValue(),
				'fs_kode_menu': '',
				'fn_harga': '',
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
						gridOrder
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
								txtJumlahTamu
							]
						},{
							flex: 1,
							layout: 'anchor',
							xtype: 'container',
							items: [
								txtSubTotal,
								txtServCharge,
								txtPPN,
								txtTotalBill
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
						gridHistory
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