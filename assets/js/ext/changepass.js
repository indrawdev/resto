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
		url: 'changepass/username',
		success: function(response) {
			var xtext = Ext.decode(response.responseText);
			if (xtext.sukses === true) {
				Ext.getCmp('txtUser').setValue(xtext.fs_username);
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

	// COMPONENT FORM CHANGE PASSWORD
	var txtUser = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		fieldLabel: 'Username',
		fieldStyle: 'background-color: #eee; background-image: none;',
		readOnly: true,
		id: 'txtUser',
		name: 'txtUser',
		xtype: 'textfield'
	};

	var txtOldPass = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		emptyText: 'HURUF KAPITAL',
		fieldLabel: 'Old Password',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtOldPass',
		name: 'txtOldPass',
		xtype: 'textfield',
		maxLength: 10,
		maskRe: /[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]/,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	var txtNewPass = {
		afterLabelTextTpl: required,
		allowBlank: false,
		anchor: '100%',
		emptyText: 'HURUF KAPITAL',
		fieldLabel: 'New Password',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtNewPass',
		name: 'txtNewPass',
		xtype: 'textfield',
		maxLength: 10,
		maskRe: /[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]/,
		enforceMaxLength: true,
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
		xtype: 'textfield',
		maxLength: 10,
		maskRe: /[abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789]/,
		enforceMaxLength: true,
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};

	// FUNCTION FORM CHANGE PASSWORD
	function fnReset() {
		Ext.getCmp('txtOldPass').setValue('');
		Ext.getCmp('txtNewPass').setValue('');
		Ext.getCmp('txtConfPass').setValue('');
	}

	function fnCekSave() {
		if (this.up('form').getForm().isValid()) {
			Ext.Ajax.on('beforerequest', fnMaskShow);
			Ext.Ajax.on('requestcomplete', fnMaskHide);
			Ext.Ajax.on('requestexception', fnMaskHide);

			Ext.Ajax.request({
				method: 'POST',
				url: 'changepass/ceksave',
				params: {
					'fs_username': Ext.getCmp('txtUser').getValue(),
					'fs_old_pass': Ext.getCmp('txtOldPass').getValue(),
					'fs_new_pass': Ext.getCmp('txtNewPass').getValue(),
					'fs_conf_pass': Ext.getCmp('txtConfPass').getValue()
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
			url: 'changepass/save',
			params: {
				'fs_username': Ext.getCmp('txtUser').getValue(),
				'fs_old_pass': Ext.getCmp('txtOldPass').getValue(),
				'fs_new_pass': Ext.getCmp('txtNewPass').getValue()
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

	var frmChangePass = Ext.create('Ext.form.Panel', {
		border: false,
		frame: true,
		region: 'center',
		title: 'Change Password',
		width: 450,
		items: [{
			fieldDefaults: {
				labelAlign: 'right',
				labelSeparator: '',
				labelWidth: 130,
				msgTarget: 'side'
			},
			anchor: '100%',
			style: 'padding: 5px;',
			title: 'User',
			xtype: 'fieldset',
			items: [
				txtUser
			]
		},{
			fieldDefaults: {
				labelAlign: 'right',
				labelSeparator: '',
				labelWidth: 130,
				msgTarget: 'side'
			},
			anchor: '100%',
			style: 'padding: 5px;',
			title: 'Change Password',
			xtype: 'fieldset',
			items: [
				txtOldPass,
				txtNewPass,
				txtConfPass
			]
		}],
		buttons: [{
			iconCls: 'icon-save',
			id: 'btnSave',
			name: 'btnSave',
			text: 'Save',
			scale: 'medium',
			handler: fnCekSave
		},{
			iconCls: 'icon-reset',
			text: 'Reset',
			scale: 'medium',
			handler: fnReset
		}]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: frmChangePass
	});

	function fnMaskShow() {
		frmChangePass.mask('Please wait...');
	}

	function fnMaskHide() {
		frmChangePass.unmask();
	}
	
	frmChangePass.render(Ext.getBody());
	Ext.get('loading').destroy();

});