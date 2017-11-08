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

	Ext.define('DataGridPembayaran', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_pembayaran', type: 'string'},
			{name: 'fs_nama_pembayaran', type: 'string'},
			{name: 'fs_aktif', type: 'string'}
		]
	});

	var grupPembayaran = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridPembayaran',
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
			url: 'masterpembayaran/grid'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}
	});

	var grupAktif = Ext.create('Ext.data.Store', {
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
			url: 'masterpembayaran/combo'
		}
	});

	var gridPembayaran = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: grupPembayaran,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Kode Pembayaran',
			dataIndex: 'fs_kode_pembayaran',
			menuDisabled: true,
			flex: 1.2
		},{
			text: 'Nama Pembayaran',
			dataIndex: 'fs_nama_pembayaran',
			menuDisabled: true,
			flex: 3
		},{
			text: 'Aktif',
			dataIndex: 'fs_aktif',
			menuDisabled: true,
			flex: 0.8
		},{
			xtype:'actioncolumn',
			width: 20,
			items: [{
				iconCls: 'icon-delete',
				tooltip: 'Delete',
				handler: function(grid, rowIndex, colIndex, e) {
					var str = grid.getStore().getAt(rowIndex).get('fs_kode_pembayaran');
					if (str) {
						Ext.MessageBox.show({
							title:'Delete record',
							msg: 'Would you like to delete?',
							buttons: Ext.Msg.YESNO,
							icon: Ext.Msg.QUESTION,
							fn: function(btn) {
								if (btn == "yes") {
									Ext.Ajax.request({
										url : 'masterpembayaran/remove/',
			            				params : {
											'fs_kode_pembayaran': str
										},
										success: function(response) {
											var xtext = Ext.decode(response.responseText);
											Ext.MessageBox.show({
												buttons: Ext.MessageBox.OK,
												closable: false,
												icon: Ext.MessageBox.INFO,
												message: xtext.hasil,
												title: 'RESTO'
											});
											fnReset();
											grupPembayaran.load();  
										},
										failure: function(response) {
											var xtext = Ext.decode(response.responseText);
											Ext.MessageBox.show({
												buttons: Ext.MessageBox.OK,
												closable: false,
												icon: Ext.MessageBox.INFO,
												message: xtext.hasil,
												title: 'RESTO'
											});
										}
									});
								}
							}
						});
					}
				}
			}]
		}],
		tbar: [{
			flex: 2.8,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Kode Pembayaran / Nama Pembayaran',
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
					grupPembayaran.load();
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
			store: grupPembayaran
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtKodePembayaran').setValue(record.get('fs_kode_pembayaran'));
				Ext.getCmp('txtNamaPembayaran').setValue(record.get('fs_nama_pembayaran'));
				Ext.getCmp('cboAktif').setValue(record.get('fs_aktif'));
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

	// COMPONENT FORM MASTER PEMBAYARAN
	var txtKodePembayaran = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Kode Pembayaran',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtKodePembayaran',
		name: 'txtKodePembayaran',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 5,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNamaPembayaran = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nama Pembayaran',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNamaPembayaran',
		name: 'txtNamaPembayaran',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 20,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var cboAktif = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		displayField: 'fs_nama',
		editable: false,
		fieldLabel: 'Aktif',
		id: 'cboAktif',
		name: 'cboAktif',
		store: grupAktif,
		valueField: 'fs_kode',
		xtype: 'combobox',
	};

	var btnSave = {
		anchor: '90%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnSave',
		name: 'btnSave',
		text: 'Save',
		iconCls: 'icon-save',
		handler: fnCekSave
	};

	var btnReset = {
		anchor: '90%',
		scale: 'medium',
		xtype: 'button',
		id: 'btnReset',
		name: 'btnReset',
		text: 'Reset',
		iconCls: 'icon-reset',
		handler: fnReset
	};

	// FUNCTIONS
	function fnReset() {
		Ext.getCmp('txtKodePembayaran').setValue('');
		Ext.getCmp('txtNamaPembayaran').setValue('');
		Ext.getCmp('cboAktif').setValue('');
	}

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'masterpembayaran/ceksave',
				params: {
					'fs_kode_pembayaran': Ext.getCmp('txtKodePembayaran').getValue()
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
		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);

		Ext.Ajax.request({
			method: 'POST',
			url: 'masterpembayaran/save',
			params: {
				'fs_kode_pembayaran': Ext.getCmp('txtKodePembayaran').getValue(),
				'fs_nama_pembayaran': Ext.getCmp('txtNamaPembayaran').getValue(),
				'fs_aktif': Ext.getCmp('cboAktif').getValue()
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
				grupPembayaran.load();
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


	var frmMasterPembayaran = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Master Pembayaran',
		width: 930,
		items: [{
			bodyStyle: 'background-color: '.concat(gBasePanel),
			border: false,
			frame: false,
			xtype: 'form',
			items: [{
				fieldDefaults: {
					labelAlign: 'right',
					labelSeparator: '',
					labelWidth: 120,
					msgTarget: 'side'
				},
				xtype: 'fieldset',
				border: false,
				items: [{
					anchor: '100%',
					layout: 'hbox',
					xtype: 'container',
					items: [{
						flex: 1,
						layout: 'anchor',
						xtype: 'container',
						items: [{
							anchor: '98%',
							style: 'padding: 5px;',
							title: 'Form Data Pembayaran',
							xtype: 'fieldset',
							items: [
								txtKodePembayaran,
								txtNamaPembayaran,
								cboAktif
							]
						},{
							anchor: '100%',
							layout: 'hbox',
							xtype: 'container',
							items: [{
								flex: 2.2,
								layout: 'anchor',
								xtype: 'container',
								items: []
							},{
								flex: 2,
								layout: 'anchor',
								xtype: 'container',
								items: [
									btnSave
								]
							},{
								flex: 2,
								layout: 'anchor',
								xtype: 'container',
								items: [
									btnReset
								]
							}]
						}]
					},{
						flex: 1.5,
						layout: 'anchor',
						xtype: 'container',
						items: [{
							style: 'padding: 5px;',
							title: 'Data Pembayaran',
							xtype: 'fieldset',
							items: [
								gridPembayaran
							]
						}]
					}]
				}]
			}]
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmMasterPembayaran
	});

	function fnMaskShow() {
		frmMasterPembayaran.mask('Please wait...');
	}

	function fnMaskHide() {
		frmMasterPembayaran.unmask();
	}
	
	frmMasterPembayaran.render(Ext.getBody());
	Ext.get('loading').destroy();
});