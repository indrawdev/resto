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

	Ext.define('DataGridMenu', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_menu', type: 'string'},
			{name: 'fs_nama_menu', type: 'string'},
			{name: 'fs_kategori_menu', type: 'string'},
			{name: 'fn_harga', type: 'string'}
		]
	});

	var grupMenu = Ext.create('Ext.data.Store', {
		autoLoad: true,
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
			url: 'masterharga/grid'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}
	});

	var grupKategori = Ext.create('Ext.data.Store', {
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
			url: 'masterharga/select'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_kode_referensi': 'kategori_menu'
				});
			}
		}
	});

	var gridMenu = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: grupMenu,
		columns: [{
			xtype: 'rownumberer',
			width: 45
		},{
			text: 'Kode Menu',
			dataIndex: 'fs_kode_menu',
			menuDisabled: true,
			flex: 1
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
		},{
			text: 'Kategori',
			dataIndex: 'fs_kategori_menu',
			menuDisabled: true,
			hidden: true
		}],
		tbar: [{
			flex: 2.8,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Kode Menu / Nama Menu',
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
			store: grupMenu
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtKodeMenu').setValue(record.get('fs_kode_menu'));
				Ext.getCmp('txtNamaMenu').setValue(record.get('fs_nama_menu'));
				Ext.getCmp('cboKategori').setValue(record.get('fs_kategori_menu'));
				Ext.getCmp('txtHarga').setValue(record.get('fn_harga'));
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

	// COMPONENT FORM MASTER HARGA
	var txtKodeMenu = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Kode Menu',
		id: 'txtKodeMenu',
		name: 'txtKodeMenu',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 30,
		enforceMaxLength: true
	};

	var txtNamaMenu = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nama Menu',
		id: 'txtNamaMenu',
		name: 'txtNamaMenu',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 100,
		enforceMaxLength: true
	};

	var cboKategori = {
		//afterLabelTextTpl: required,
		//allowBlank: false,
		anchor: '100%',
		displayField: 'fs_nama',
		editable: false,
		fieldLabel: 'Kategori',
		id: 'cboKategori',
		name: 'cboKategori',
		store: grupKategori,
		valueField: 'fs_kode',
		xtype: 'combobox'
	};

	var txtHarga = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Harga',
		id: 'txtHarga',
		name: 'txtHarga',
		xtype: 'textfield',
		minLength: '0',
		maxLength: '10',
		maskRe: /[0-9]/,
		enforceMaxLength: true
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
		Ext.getCmp('txtKodeMenu').setValue('');
		Ext.getCmp('txtNamaMenu').setValue('');
		Ext.getCmp('cboKategori').setValue('');
		Ext.getCmp('txtHarga').setValue('');
	}

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'masterharga/ceksave',
				params: {
					'fs_kode_menu': Ext.getCmp('txtKodeMenu').getValue()
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
						if (xtext.sukses === true) {
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
			url: 'masterharga/save',
			params: {
				'fs_kode_menu': Ext.getCmp('txtKodeMenu').getValue(),
				'fs_nama_menu': Ext.getCmp('txtNamaMenu').getValue(),
				'fs_kategori_menu': Ext.getCmp('cboKategori').getValue(),
				'fn_harga': Ext.getCmp('txtHarga').getValue()
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

	var frmMasterHarga = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Master Harga',
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
							title: 'Form Menu',
							xtype: 'fieldset',
							items: [
								txtKodeMenu,
								txtNamaMenu,
								cboKategori,
								txtHarga
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
							title: 'Data Menu',
							xtype: 'fieldset',
							items: [
								gridMenu
							]
						}]
					}]
				}]
			}]
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmMasterHarga
	});

	function fnMaskShow() {
		frmMasterHarga.mask('Please wait...');
	}

	function fnMaskHide() {
		frmMasterHarga.unmask();
	}
	
	frmMasterHarga.render(Ext.getBody());
	Ext.get('loading').destroy();
});