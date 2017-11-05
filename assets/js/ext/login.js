Ext.Loader.setConfig({
	enabled: true
});

Ext.Loader.setPath('Ext.ux', gBaseUX);

Ext.require([
	'Ext.ux.LiveSearchGridPanel',
	'Ext.ux.ProgressBarPager'
]);

Ext.onReady(function() {
    Ext.QuickTips.init();
	

	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';

	function gridTooltipSearch(view) {
		view.tip = Ext.create('Ext.tip.ToolTip', {
			delegate: view.itemSelector,
			html: 'Double click on record to choose',
			target: view.el,
			trackMouse: true
		});
	}
	
	var txtUserName = {
		afterLabelTextTpl: required,
		allowBlank: false,
		emptyText: 'Username',
		fieldLabel: 'Username',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtUserName',
		name: 'txtUserName',
		value: '',
		width: '100%',
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};
	
	var txtUserPass = {
		afterLabelTextTpl: required,
		allowBlank: false,
		emptyText: 'Password',
		fieldLabel: 'Password',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtUserPass',
		inputType: 'password',
		name: 'txtUserPass',
		value: '',
		width: '100%',
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};
	
	var txtCaptcha = {
		afterLabelTextTpl: required,
		allowBlank: false,
		fieldLabel: 'Type Captcha',
		fieldStyle: 'text-transform: uppercase;',
		id: 'txtCaptcha',
		labelWidth: 90,
		name: 'txtCaptcha',
		width: '100%',
		listeners: {
			change: function(field, newValue) {
				field.setValue(newValue.toUpperCase());
			}
		}
	};
	
	Ext.define('Image', {
		extend: 'Ext.data.Model',
		fields: [
			{name: 'src', type: 'string'}
		]
	});

	var dataImg = Ext.create('Ext.data.Store', {
		autoLoad: true,
		id: 'imagesStore',
		model: 'Image',
		proxy: {
			actionMethods: {
				read: 'POST'
			},
			reader: {
				type: 'json'
			},
			type: 'ajax',
			url: 'login/buat_captcha'
		}
	});

	var imageTpl = new Ext.XTemplate(
		'<tpl for=".">',
			'<div style="margin-bottom: 10px;" class="thumb-wrap">',
				'<img src="{src}" />',
				'<br/><span>{caption}</span>',
			'</div>',
		'</tpl>'
	);
	
	var gambar = Ext.create('Ext.view.View', {
		itemSelector: 'div.thumb-wrap',
		store: dataImg,
		tpl: imageTpl
	});

	var cmdRefresh = {
		iconCls: 'icon-refresh',
		id: 'cmdRefresh',
		name: 'cmdRefresh',
		text: 'Refresh Captcha',
		xtype: 'button',
		handler: function() {
			dataImg.load();
		}
	};
	
	function fnReset() {
		Ext.getCmp('txtUserName').setValue('');
		Ext.getCmp('txtUserPass').setValue('');
		Ext.getCmp('txtCaptcha').setValue('');
	}

	function fnLogin() {
		var xForm = Ext.getCmp('frmLogin').getForm();
		if (xForm.isValid()) {
			xForm.submit({
			waitTitle: 'Connecting',
			waitMsg: 'Validate User and Password...',
			success: function() {
					window.location.href = 'mainmenu';
				},
			failure: function(form, action) {
					Ext.MessageBox.show({
						buttons: Ext.MessageBox.OK,
						closable: false,
						icon: Ext.MessageBox.INFO,
						// icon: Ext.Msg.QUESTION,
						// icon: Ext.Msg.ERROR,
						// icon: Ext.Msg.WARNING,
						msg: 'Login Failed, ' + action.response.responseText,
						title: 'HRD'
					});
					winLogin.unmask();
				}
			});
		}
	}

	var winLogin = Ext.create('Ext.window.Window', {
        closable: false,
        draggable: true,
        height: 280,
		id: 'winLogin',
        layout: 'border',
		name: 'winLogin',
        plain: true,
        resizable: false,
        title: 'Login Form',
        width: 400,
        items: [
			Ext.create('Ext.form.Panel', {
				bodyStyle: 'padding:15px 35px;',
				border: false,
				defaultType: 'textfield',
				fieldDefaults: {
					msgTarget: 'side',
					labelAlign: 'right',
					labelSeparator: '',
					labelWidth: 90
				},
				frame: false,
				id: 'frmLogin',
				method: 'POST',
				region: 'center',
				url: 'login/ceklogin',
				items:[
					txtUserName,
					txtUserPass,
					txtCaptcha,
					gambar,
					cmdRefresh
				],
				buttons: [{
					text: 'Login',
					handler: fnLogin
				},{
					text: 'Reset',
					handler: fnReset
				}]
			})
		]
	});

	var vMask = new Ext.LoadMask({
		msg: 'Please wait...',
		target: winLogin
	});
	
	function fnMaskShow() {
		winLogin.mask('Please wait...');
	}

	function fnMaskHide() {
		winLogin.unmask();
	}
	
	winLogin.show();
	Ext.get('loading').destroy();
});
