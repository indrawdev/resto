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

	var vLevel = '';
	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

	var grupLevel = Ext.create('Ext.data.Store', {
		autoLoad: false,
		fields: [
			'fs_kd_parent','fs_kd_parent',
			'fs_level','fs_index'
		],
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
			url: 'masteruser/gridlevel'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
				});
			}
		}
	});

	var winGrid2 = Ext.create('Ext.grid.Panel',{
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 550,
		sortableColumns: false,
		store: grupLevel,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "Nama Level", dataIndex: 'fs_level', menuDisabled: true, flex: 1}
		],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupLevel,
			items:[
				'-', {
				text: 'Exit',
				handler: function() {
					winCari2.hide();
				}
			}]
		}),
		listeners: {
			itemdblclick: function(grid, record)
			{
				Ext.getCmp('cboLevel1').setValue(record.get('fs_level'));
				winCari2.hide();
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false
		}
	});

	var winCari2 = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Searching...',
		items: [
			winGrid2
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupLevel.load();
				vMask.show();
			}
		}
	});

	var grupCabang = Ext.create('Ext.data.Store', {
		autoLoad: false,
		fields: [
			'fs_kode_cabang','fs_nama_cabang',
			'fs_alamat_cabang','fs_no_tlp'
		],
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
			url: 'masteruser/gridcabang'
		},
		listeners: {
			beforeload: function(store) {
			}
		}
	});

	var winGrid3 = Ext.create('Ext.grid.Panel',{
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 550,
		sortableColumns: false,
		store: grupCabang,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "Kode Cabang", dataIndex: 'fs_kode_cabang', menuDisabled: true, width: 80},
			{text: "Nama Cabang", dataIndex: 'fs_nama_cabang', menuDisabled: true, width: 250}
		],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupCabang,
			items:[
				'-', {
				text: 'Exit',
				handler: function() {
					winCari3.hide();
				}
			}]
		}),
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('cboKodeCabang').setValue(record.get('fs_kode_cabang'));
				Ext.getCmp('txtNamaCabang').setValue(record.get('fs_nama_cabang'));
				winCari3.hide();
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false
		}
	});

	var winCari3 = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Searching...',
		items: [
			winGrid3
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupCabang.load();
				vMask.show();
			}
		}
	});

	Ext.define('DatagridAksesCabang', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_kode_cabang', type: 'string'},
			{name: 'fs_nama_cabang', type: 'string'}
		]
	});

	var grupAksesCabang = Ext.create('Ext.data.Store', {
		autoLoad: false,
		model: 'DatagridAksesCabang',
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
			url: 'masteruser/gridAksesCabang'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_username': Ext.getCmp('txtUser').getValue()
				});
			}
		}
	});

	var gridAksesCabang = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: grupAksesCabang,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Kode Cabang',
			dataIndex: 'fs_kode_cabang',
			menuDisabled: true,
			flex: 1
		},{
			text: 'Nama Cabang',
			dataIndex: 'fs_nama_cabang',
			menuDisabled: true,
			flex: 2
		}],
		listeners: {
			selectionchange: function(view, records) {
				gridAksesCabang.down('#removeData').setDisabled(!records.length);
			}
		},
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupAksesCabang
		}),
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		},
		tbar: [{
			flex: 0.5,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '95%',
				emptyText: 'Kode Cabang',
				editable: true,
				id: 'cboKodeCabang',
				name: 'cboKodeCabang',
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
							winCari3.show();
							winCari3.center();
						}
					}
				}
			}]
		},{
			flex: 1.2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '95%',
				emptyText: 'Nama Cabang',
				fieldStyle: 'background-color: #eee; background-image: none;',
				readOnly: true,
				id: 'txtNamaCabang',
				name: 'txtNamaCabang',
				xtype: 'textfield',
			}]
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
					var total = grupAksesCabang.getCount();

					var data = Ext.create('DatagridAksesCabang', {
						fs_kode_cabang: Ext.getCmp('cboKodeCabang').getValue(),
						fs_nama_cabang: Ext.getCmp('txtNamaCabang').getValue()
					});

					grupAksesCabang.insert(total, data);

					Ext.getCmp('cboKodeCabang').setValue('');
					Ext.getCmp('txtNamaCabang').setValue('');

					total = grupAksesCabang.getCount() - 1;
					gridAksesCabang.getSelectionModel().select(total);
				}
			},{
				iconCls: 'icon-delete',
				itemId: 'removeData',
				text: 'Delete',
				handler: function() {
					var sm = gridAksesCabang.getSelectionModel();
					grupAksesCabang.remove(sm.getSelection());
					gridAksesCabang.getView().refresh();

					if (grupAksesCabang.getCount() > 0) {
						sm.select(0);
					}
				},
				disabled: true
			}]
		}]
	});

	var cboNIK = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		emptyText: 'Nomor Induk Karyawan',
		fieldLabel: 'NIK',
		editable: false,
		id: 'cboNIK',
		name: 'cboNIK',
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
					winCari1.show();
					winCari1.center();
				}
			}
		}
	};

	var txtUser = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Username',
		emptyText: 'HURUF KAPITAL',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtUser',
		name: 'txtUser',
		xtype: 'textfield',
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtPass = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		emptyText: 'HURUF KAPITAL',
		fieldLabel: 'Password',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtPass',
		name: 'txtPass',
		inputType: 'password',
		value: '',
		xtype: 'textfield',
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtConfPass = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		emptyText: 'HURUF KAPITAL',
		fieldLabel: 'Confirm Password',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtConfPass',
		name: 'txtConfPass',
		inputType: 'password',
		value: '',
		xtype: 'textfield',
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var cboLevel1 = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		emptyText: 'Level User',
		fieldLabel: 'Level',
		editable: false,
		id: 'cboLevel1',
		name: 'cboLevel1',
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
					winCari2.show();
					winCari2.center();
				}
			}
		}
	};

	var txtPIN = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'PIN',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtPIN',
		name: 'txtPIN',
		value: '1234',
		xtype: 'textfield',
		maxLength: 4,
		maskRe: /[0123456789]/,
		enforceMaxLength: true
	};

	// COMPONENT FORM SETUP LEVEL
	Ext.define('DataGridLevelMenu', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_nm_menu', type: 'string'},
			{name: 'fs_kd_induk', type: 'string'},
			{name: 'fs_kd_menu', type: 'string'},
			{name: 'fb_tambah', type: 'bool'}
		]
	});

	var grupLevelMenu = Ext.create('Ext.data.TreeStore', {
		autoLoad: true,
		model: 'DataGridLevelMenu',
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json'
			},
			type: 'ajax',
			url: 'masteruser/ambilnodes'
		},
		rootProperty: {
			expanded: true
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_level': vLevel	
				});
			}
		}
	});

	var gridlevelMenu = Ext.create('Ext.tree.Panel', {
		anchor: '100%',
		autoDestroy: true,
		height: 400,
		rootVisible: false,
		sortableColumns: false,
		store: grupLevelMenu,
		columns: [{
			dataIndex: 'fs_nm_menu',
			flex: 1.5,
			menuDisabled: true,
			text: 'Menu',
			xtype: 'treecolumn'
		},{
			dataIndex: 'fs_kd_child',
			hidden: true,
			menuDisabled: true,
			text: 'Kode'
		},{
			align: 'center',
			dataIndex: 'fb_tambah',
			flex: 0.25,
			menuDisabled: true,
			stopSelection: false,
			text: 'Add',
			xtype: 'checkcolumn',
			listeners: {
				checkchange: function(grid, rowIndex, checked) {
					var store = gridlevelMenu.getStore();
					var record = store.getAt(rowIndex);
					var total = grupLevelMenu.getCount();

					var kode = record.get('fs_kd_menu').trim();
					var cek = record.get('fb_tambah');
					var len = 0;
					len = kode.length;
					var j = 0;
					var ada = false;

					if (cek === true) {
						if (len === 0) {
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								if (len === 0 && i !== rowIndex) {
									break;
								} else {
									record.set('fb_tambah','1');
								}
							}
						} else if (len === 4) {
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								if ((len === 0) || (len === 4 && i !== rowIndex)) {
									break;
								} else {
									record.set('fb_tambah','1');
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								if (len === 0) {
									record.set('fb_tambah','1');
									break;
								}
							}
						} else if (len === 6) {
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if ((len === 0) || (len === 4) || (len === 6 && i !== rowIndex)) {
									break;
								} else {
									record.set('fb_tambah','1');
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 4) {
									record.set('fb_tambah','1');
									break;
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0) {
									record.set('fb_tambah','1');
									break;
								}
							}
						} else if (len === 8) {
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if ((len === 0) || (len === 4) || (len === 6) || (len === 8 && i !== rowIndex)) {
									break;
								} else {
									record.set('fb_tambah','1');
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 6) {
									record.set('fb_tambah','1');
									break;
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 4) {
									record.set('fb_tambah','1');
									break;
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0) {
									record.set('fb_tambah','1');
									break;
								}
							}
						} else if (len === 10) {
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if ((len === 0) || (len === 4) || (len === 6) || (len === 8) || (len === 10 && i !== rowIndex)) {
									break;
								} else {
									record.set('fb_tambah','1');
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 8) {
									record.set('fb_tambah','1');
									break;
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 6) {
									record.set('fb_tambah','1');
									break;
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 4) {
									record.set('fb_tambah','1');
									break;
								}
							}

							for (i = rowIndex; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0) {
									record.set('fb_tambah','1');
									break;
								}
							}
						}
					}
					else {
						// UNCHECK
						if (len === 0) {
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0 && i !== rowIndex) {
									break;
								} else {
									record.set('fb_tambah','0');
								}
							}
						} else if (len === 4) {
							// UNCHECK 4
							j = 0;
							ada = false;

							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if ((len === 0) || (len === 4 && i !== rowIndex)) {
									break;
								} else if (len === 6 || len === 8) {
									record.set('fb_tambah','0');
								}
							}

							// UNCHECK 2
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								cek = record.get('fb_tambah');
								if (len === 0) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 4 && cek === true) {
										ada = true;
									}
								}
							}
						} else if (len === 6) {
							// UNCHECK 6
							j = 0;
							ada = false;

							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if ((len === 0) || (len === 4) || (len === 6 && i !== rowIndex)) {
									break;
								} else if (len === 8) {
									record.set('fb_tambah','0');
								}
							}

							// UNCHECK 4
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0 || len === 4) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 4) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 6 && cek === true) {
										ada = true;
									}
								}
							}

							// UNCHECK 2
							j = 0;
							ada = false;

							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 0) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 4 && cek === true) {
										ada = true;
									}
								}
							}
						} else if (len === 8) {
							// UNCHECK 8
							j = 0;
							ada = false;
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if ((len === 0) || (len === 4) || (len === 6) || (len === 8 && i !== rowIndex)) {
									break;
								} else if (len === 10) {
									record.set('fb_tambah','0');
								}
							}

							// UNCHECK 6
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0 || len === 4 || len === 6) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 6) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 8 && cek === true) {
										ada = true;
									}
								}
							}

							// UNCHECK 4
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0 || len === 4) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 4) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 6 && cek === true) {
										ada = true;
									}
								}
							}

							// UNCHECK 2
							j = 0;
							ada = false;
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 0) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 4 && cek === true) {
										ada = true;
									}
								}
							}
						} else if (len === 10) {
							// UNCHECK 10
							j = 0;
							ada = false;

							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if ((len === 0) || (len === 4) || (len === 6) || (len === 8) || (len === 10 && i !== rowIndex)) {
									break;
								} else if (len === 12) {
									record.set('fb_tambah','0');
								}
							}

							// UNCHECK 8
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0 || len === 4 || len === 6 || len === 8) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 8) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 10 && cek === true) {
										ada = true;
									}
								}
							}

							// UNCHECK 6
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0 || len === 4 || len === 6) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 6) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 8 && cek === true) {
										ada = true;
									}
								}
							}

							// UNCHECK 4
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0 || len === 4) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 4) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 6 && cek === true) {
										ada = true;
									}
								}
							}

							// UNCHECK 2
							j = 0;
							ada = false;
							for (i = rowIndex; i < total; i++) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;

								if (len === 0) {
									j = i - 1;
									break;
								} else if (i === total - 1) {
									j = i;
									break;
								}
							}

							ada = false;
							for (i = j; i >= 0; i--) {
								record = store.getAt(i);
								kode = record.get('fs_kd_menu').trim();
								len = kode.length;
								cek = record.get('fb_tambah');

								if (len === 0) {
									if (ada === false) {
										record.set('fb_tambah','0');
									}
									break;
								} else {
									if (len === 4 && cek === true) {
										ada = true;
									}
								}
							}
						}
					}
				}
			}
		}],
		tbar: [{
			flex: 2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				afterLabelTextTpl: required,
				allowBlank: false,
				anchor: '95%',
				fieldStyle: 'text-transform: uppercase;',
				editable: true,
				fieldLabel: 'Nama Level',
				id: 'cboLevel2',
				name: 'cboLevel2',
				xtype: 'textfield',
				labelAlign: 'top',
				listeners: {
					change: function(field, newValue) {
						field.setValue(newValue.toUpperCase());
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
							winCari4.show();
							winCari4.center();
						}
					}
				}
			}]
		}],
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false,
			stripeRows: true
		}
	});

	var winGrid4 = Ext.create('Ext.grid.Panel',{
		anchor: '100%',
		autoDestroy: true,
		height: 450,
		width: 550,
		sortableColumns: false,
		store: grupLevel,
		columns: [
			{xtype: 'rownumberer', width: 45},
			{text: "Nama Level", dataIndex: 'fs_level', menuDisabled: true, flex: 1}
		],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupLevel,
			items:[
				'-', {
				text: 'Exit',
				handler: function() {
					winCari4.hide();
				}
			}]
		}),
		listeners: {
			itemdblclick: function(grid, record)
			{
				Ext.getCmp('cboLevel2').setValue(record.get('fs_level'));
				vLevel = record.get('fs_level').trim();
				grupLevelMenu.load();
				winCari4.hide();
			}
		},
		viewConfig: {
			getRowClass: function() {
				return 'rowwrap';
			},
			markDirty: false
		}
	});

	var winCari4 = Ext.create('Ext.window.Window', {
		border: false,
		closable: false,
		draggable: true,
		frame: false,
		layout: 'fit',
		plain: true,
		resizable: false,
		title: 'Searching...',
		items: [
			winGrid4
		],
		listeners: {
			beforehide: function() {
				vMask.hide();
			},
			beforeshow: function() {
				grupLevel.load();
				vMask.show();
			}
		}
	});
	

	// COMPONENT FORM SETUP LEVEL
	var gridLevel = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: '',
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Nama Level',
			dataIndex: 'fs_level',
			menuDisabled: true,
			width: 320
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: ''
		}),
		listeners: {
			itemdblclick: function(grid, record) {

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

	// COMPONENT FORM DAFTAR USER
	Ext.define('DataGridUser', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fs_username', type: 'string'},
			{name: 'fs_level_user', type: 'string'},
			{name: 'fs_user_buat', type: 'string'},
			{name: 'fd_tanggal_buat', type: 'string'},
			{name: 'fd_last_login', type: 'string'},
			{name: 'fs_aktif', type: 'string'}
		]
	});

	var grupUser = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridUser',
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
			url: 'masteruser/griduser'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari3').getValue()
				});
			}
		}
	});

	var gridUser = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: grupUser,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Username',
			dataIndex: 'fs_username',
			menuDisabled: true,
			width: 120
		},{
			text: 'Level User',
			dataIndex: 'fs_level_user',
			menuDisabled: true,
			width: 150
		},{
			text: 'Tanggal Login',
			dataIndex: 'fd_last_login',
			menuDisabled: true,
			width: 150
		},{
			text: 'Tanggal Dibuat',
			dataIndex: 'fd_tanggal_buat',
			menuDisabled: true,
			width: 150
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupUser
		}),
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama User',
				id: 'txtCari3',
				name: 'txtCari3',
				xtype: 'textfield'
			}]
		},{
			flex: 0.2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
					grupUser.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		listeners: {
			itemdblclick: function(grid, record) {
				Ext.getCmp('txtUser').setValue(record.get('fs_username'));
				Ext.getCmp('cboLevel1').setValue(record.get('fs_level_user'));

				// RELOAD AKSES LOKASI
				grupAksesCabang.load();
				
				// CHANGE TAB
				var tabPanel = Ext.ComponentQuery.query('tabpanel')[0];
				tabPanel.setActiveTab('tab1');
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

	// COMPONENT FORM USER ACTIVITY
	Ext.define('DataGridActivity', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'fd_time', type: 'string'},
			{name: 'fs_log', type: 'string'},
			{name: 'fs_user', type: 'string'},
			{name: 'fs_message', type: 'string'}
		]
	});

	var grupActivity = Ext.create('Ext.data.Store', {
		autoLoad: true,
		model: 'DataGridActivity',
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
			url: 'masteruser/gridactivity'
		},
		listeners: {
			beforeload: function(store) {
				Ext.apply(store.getProxy().extraParams, {
					'fs_cari': Ext.getCmp('txtCari4').getValue()
				});
			}
		}
	});
	
	var gridActivity = Ext.create('Ext.grid.Panel', {
		defaultType: 'textfield',
		height: 450,
		sortableColumns: false,
		store: grupActivity,
		columns: [{
			xtype: 'rownumberer',
			width: 25
		},{
			text: 'Waktu Log',
			dataIndex: 'fd_time',
			menuDisabled: true,
			width: 130,
			locked: true
		},{
			text: 'Nama Log',
			dataIndex: 'fs_log',
			menuDisabled: true,
			width: 120,
			locked: true
		},{
			align: 'center',
			text: 'Nama User',
			dataIndex: 'fs_user',
			menuDisabled: true,
			width: 90
		},{
			text: 'Aktifitas',
			dataIndex: 'fs_message',
			menuDisabled: true,
			width: 280
		}],
		bbar: Ext.create('Ext.PagingToolbar', {
			displayInfo: true,
			pageSize: 25,
			plugins: Ext.create('Ext.ux.ProgressBarPager', {}),
			store: grupActivity
		}),
		tbar: [{
			flex: 1.4,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '98%',
				emptyText: 'Nama User',
				id: 'txtCari4',
				name: 'txtCari4',
				xtype: 'textfield'
			}]
		},{
			flex: 0.2,
			layout: 'anchor',
			xtype: 'container',
			items: [{
				anchor: '100%',
				text: 'Search',
				xtype: 'button',
				handler: function() {
					grupActivity.load();
				}
			}]
		},{
			flex: 0.1,
			layout: 'anchor',
			xtype: 'container',
			items: []
		}],
		listeners: {
			itemdblclick: function(grid, record) {

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

	// FUNCTION RESET
	function fnResetUser() {
		Ext.getCmp('txtUser').setValue('');
		Ext.getCmp('txtPass').setValue('');
		Ext.getCmp('txtConfPass').setValue('');
		Ext.getCmp('cboLevel1').setValue('');
		grupAksesCabang.removeAll();
		gridAksesCabang.getView().refresh();
	}

	function fnResetLevel() {
		Ext.getCmp('cboLevel2').setValue('');
		vLevel = '';
		grupLevelMenu.load();
	}

	// FUNCTION SAVE USER
	function fnCekSaveUser() {
		if (this.up('form').getForm().isValid()) {

			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'masteruser/ceksaveuser',
				params: {
					'fs_username': Ext.getCmp('txtUser').getValue(),
					'fs_password': Ext.getCmp('txtPass').getValue(),
					'fs_confpass': Ext.getCmp('txtConfPass').getValue()
				},
				success: function(response) {
					var xtext = Ext.decode(response.responseText);
					if (xtext.sukses === false) {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.MessageBox.INFO,
							msg: xtext.hasil,
							title: 'REPORT'
						});
					} else {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.YESNO,
							closable: false,
							icon: Ext.MessageBox.QUESTION,
							msg: xtext.hasil,
							title: 'REPORT',
							fn: function(btn) {
								if (btn == 'yes') {
									fnSaveUser();
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
						msg: 'Simpan Gagal, Koneksi Gagal',
						title: 'REPORT'
					});
					fnMaskHide();
				}
			});
		}
	}	

	function fnSaveUser() {
		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);

		Ext.Ajax.request({
			method: 'POST',
			url: 'masteruser/saveuser',
			params: {
				'fs_username': Ext.getCmp('txtUser').getValue(),
				'fs_password': Ext.getCmp('txtPass').getValue(),
				'fs_level_user': Ext.getCmp('cboLevel1').getValue()
			},
			success: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: xtext.hasil,
					title: 'REPORT'
				});
				fnResetUser();

				// REFRESH AFTER SAVE
				grupUser.load();
				grupActivity.load();
			},
			failure: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: 'Saving Failed, Connection Failed!!',
					title: 'REPORT'
				});
				fnMaskHide();
			}
		});
	}

	// FUNCTION SAVE LEVEL USER
	function fnCekSaveLevel() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'masteruser/ceksavelevel',
				params: {
					'fs_level': Ext.getCmp('cboLevel2').getValue()
				},
				success: function(response) {
					var xtext = Ext.decode(response.responseText);
					if (xtext.sukses === false) {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.OK,
							closable: false,
							icon: Ext.MessageBox.INFO,
							msg: xtext.hasil,
							title: 'REPORT'
						});
					} else {
						Ext.MessageBox.show({
							buttons: Ext.MessageBox.YESNO,
							closable: false,
							icon: Ext.MessageBox.QUESTION,
							msg: xtext.hasil,
							title: 'REPORT',
							fn: function(btn) {
								if (btn == 'yes') {
									fnSaveLevel();
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
						msg: 'Simpan Gagal, Koneksi Gagal',
						title: 'REPORT'
					});
					fnMaskHide();
				}
			});
		}
	}

	function fnSaveLevel() {
		var xkdinduk = '';
		var xkdmenu = '';
		var store = gridlevelMenu.getStore();

		store.each(function(record, idx) {
			if (record.get('fb_tambah') === true) {
				xkdinduk = xkdinduk +'|'+ record.get('fs_kd_induk');
				xkdmenu = xkdmenu +'|'+ record.get('fs_kd_menu');
			}
		});
		
		Ext.Ajax.on('beforerequest', fnMaskShow);
		Ext.Ajax.on('requestcomplete', fnMaskHide);
		Ext.Ajax.on('requestexception', fnMaskHide);

		Ext.Ajax.request({
			method: 'POST',
			url: 'masteruser/savelevel',
			params: {
				'fs_level': Ext.getCmp('cboLevel2').getValue(),
				'fs_kd_induk': xkdinduk,
				'fs_kd_menu': xkdmenu
			},
			success: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: xtext.hasil,
					title: 'REPORT'
				});
				fnResetLevel();
			},
			failure: function(response) {
				var xtext = Ext.decode(response.responseText);
				Ext.MessageBox.show({
					buttons: Ext.MessageBox.OK,
					closable: false,
					icon: Ext.MessageBox.INFO,
					msg: 'Saving Failed, Connection Failed!!',
					title: 'REPORT'
				});
				fnMaskHide();
			}
		});
	}

	var frmMasterUser = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Master User',
		width: 630,
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
				title: 'Setup User',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					anchor: '100%',
					xtype: 'fieldset',
					title: 'Form Setup User',
					style: 'padding: 5px;',
					items: [{
						anchor: '90%',
						layout: 'hbox',
						xtype: 'container',
						items: [{
							flex: 2,
							layout: 'anchor',
							xtype: 'container',
							items: [{
								anchor: '98%',
								border: false,
								xtype: 'fieldset',
								items: [
									txtUser,
									txtPass,
									txtConfPass,
									cboLevel1
								]
							}]
						}]
					}]
				}],
				buttons: [{
					iconCls: 'icon-save',
					id: 'btnSaveUser',
					name: 'btnSaveUser',
					text: 'Save',
					scale: 'medium',
					handler: fnCekSaveUser
				},{
					iconCls: 'icon-reset',
					text: 'Reset',
					scale: 'medium',
					handler: fnResetUser
				}]
			},{
				id: 'tab2',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'Setup Level',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					anchor: '100%',
					style: 'padding: 5px;',
					title: 'Setup User',
					xtype: 'fieldset',
					items: [
						gridlevelMenu
					]
				}],
				buttons: [{
					iconCls: 'icon-save',
					id: 'btnSaveLevel',
					name: 'btnSaveLevel',
					text: 'Save',
					scale: 'medium',
					handler: fnCekSaveLevel
				},{
					iconCls: 'icon-reset',
					text: 'Reset',
					scale: 'medium',
					handler: fnResetLevel
				}]
			},{
				id: 'tab3',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'Daftar User',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					anchor: '100%',
					style: 'padding: 5px;',
					title: 'Daftar User',
					xtype: 'fieldset',
					items: [
						gridUser
					]
				}]
			},{
				id: 'tab4',
				bodyStyle: 'background-color: '.concat(gBasePanel),
				border: false,
				frame: false,
				xtype: 'form',
				title: 'User Activity',
				items: [{
					fieldDefaults: {
						labelAlign: 'right',
						labelSeparator: '',
						labelWidth: 120,
						msgTarget: 'side'
					},
					anchor: '100%',
					style: 'padding: 5px;',
					title: 'User Activity',
					xtype: 'fieldset',
					items: [
						gridActivity
					]
				}]
			}]
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmMasterUser
	});

	function fnMaskShow() {
		frmMasterUser.mask('Please wait...');
	}

	function fnMaskHide() {
		frmMasterUser.unmask();
	}
	
	frmMasterUser.render(Ext.getBody());
	Ext.get('loading').destroy();

});