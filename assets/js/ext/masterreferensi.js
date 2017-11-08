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

	Ext.define('DataGridReferensi', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_referensi', type: 'string'},
			{name: 'fs_nilai1_referensi', type: 'string'},
			{name: 'fs_nilai2_referensi', type: 'string'},
			{name: 'fs_nama_referensi', type: 'string'}
		]
	});

	var grupReferensi = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridReferensi',
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
			url: 'masterreferensi/grid'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari').getValue()
				});
			}
		}
	});

	var gridReferensi = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: grupReferensi,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Kode Referensi',
			dataIndex: 'fs_kode_referensi',
			menuDisabled: true,
			width: 130
		},{
			text: 'Nilai 1',
			dataIndex: 'fs_nilai1_referensi',
			menuDisabled: true,
			width: 50
		},{
			text: 'Nilai 2',
			dataIndex: 'fs_nilai2_referensi',
			menuDisabled: true,
			width: 50
		},{
			text: 'Nama Referensi',
			dataIndex: 'fs_nama_referensi',
			menuDisabled: true,
			width: 200
		},{
			xtype:'actioncolumn',
			width: 20,
			items: [{
				iconCls: 'icon-delete',
				tooltip: 'Delete',
				handler: function(grid, rowIndex, colIndex, e) {
					var str1 = grid.getStore().getAt(rowIndex).get('fs_kode_referensi');
					var str2 = grid.getStore().getAt(rowIndex).get('fs_nilai1_referensi');
					if (str1 && str2) {
						Ext.MessageBox.show({
							title:'Delete record',
							msg: 'Would you like to delete?',
							buttons: Ext.Msg.YESNO,
							icon: Ext.Msg.QUESTION,
							fn: function(btn) {
								if (btn == "yes") {
									Ext.Ajax.request({
										url : 'masterreferensi/remove/',
			            				params : {
											'fs_kode_referensi': str1,
											'fs_nilai1_referensi': str2
										},
										success: function(response) {
											var xtext = Ext.decode(response.responseText);
											Ext.MessageBox.show({
												buttons: Ext.MessageBox.OK,
												closable: false,
												icon: Ext.MessageBox.INFO,
												message: xtext.hasil,
												title: 'HRD'
											});
											fnReset();
											grupReferensi.load();  
										},
										failure: function(response) {
											var xtext = Ext.decode(response.responseText);
											Ext.MessageBox.show({
												buttons: Ext.MessageBox.OK,
												closable: false,
												icon: Ext.MessageBox.INFO,
												message: xtext.hasil,
												title: 'HRD'
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
				emptyText: 'Kode Referensi / Nama Referensi',
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
					grupReferensi.load();
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
			store: grupReferensi
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtKodeRef').setValue(record.get('fs_kode_referensi'));
				Ext.getCmp('txtNilai1').setValue(record.get('fs_nilai1_referensi'));
				Ext.getCmp('txtNilai2').setValue(record.get('fs_nilai2_referensi'));
				Ext.getCmp('txtNamaRef').setValue(record.get('fs_nama_referensi'));
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

	// COMPONENT FORM REFERENSI
	var txtKodeRef = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Kode Referensi',
		fieldStyle: 'text-transform: lowercase;',
		id: 'txtKodeRef',
		name: 'txtKodeRef',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 30,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toLowerCase());
			}
		}
	};

	var txtNilai1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nilai 1',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNilai1',
		name: 'txtNilai1',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 16,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNilai2 = {
		allowBlank: true,
		anchor: '100%',
		fieldLabel: 'Nilai 2',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNilai2',
		name: 'txtNilai2',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 16,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNamaRef = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Nama Referensi',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNamaRef',
		name: 'txtNamaRef',
		xtype: 'textfield',
		minValue: 0,
		maxLength: 100,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
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
		Ext.getCmp('txtKodeRef').setValue('');
		Ext.getCmp('txtNilai1').setValue('');
		Ext.getCmp('txtNilai2').setValue('');
		Ext.getCmp('txtNamaRef').setValue('');
	}

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'masterreferensi/ceksave',
				params: {
					'fs_kode_referensi': Ext.getCmp('txtKodeRef').getValue(),
					'fs_nilai1_referensi': Ext.getCmp('txtNilai1').getValue()
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
			url: 'masterreferensi/save',
			params: {
				'fs_kode_referensi': Ext.getCmp('txtKodeRef').getValue(),
				'fs_nilai1_referensi': Ext.getCmp('txtNilai1').getValue(),
				'fs_nilai2_referensi': Ext.getCmp('txtNilai2').getValue(),
				'fs_nama_referensi': Ext.getCmp('txtNamaRef').getValue()
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
				grupReferensi.load();
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

	var frmMasterReferensi = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Master Referensi',
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
							title: 'Form Data Referensi',
							xtype: 'fieldset',
							items: [
								txtKodeRef,
								txtNilai1,
								txtNilai2,
								txtNamaRef
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
							title: 'Data Referensi',
							xtype: 'fieldset',
							items: [
								gridReferensi
							]
						}]
					}]
				}]
			}]
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmMasterReferensi
	});

	function fnMaskShow() {
		frmMasterReferensi.mask('Please wait...');
	}

	function fnMaskHide() {
		frmMasterReferensi.unmask();
	}
	
	frmMasterReferensi.render(Ext.getBody());
	Ext.get('loading').destroy();
});