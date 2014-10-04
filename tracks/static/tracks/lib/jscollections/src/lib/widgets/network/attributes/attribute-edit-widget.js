/*
 * Copyright (c) 2012 Francisco Salavert (ICM-CIPF)
 * Copyright (c) 2012 Ruben Sanchez (ICM-CIPF)
 * Copyright (c) 2012 Ignacio Medina (ICM-CIPF)
 *
 * This file is part of JS Common Libs.
 *
 * JS Common Libs is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * JS Common Libs is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with JS Common Libs. If not, see <http://www.gnu.org/licenses/>.
 */

function AttributeEditWidget(args) {
    var _this = this;
    _.extend(this, Backbone.Events);
    this.id = Utils.genId('AttributeEditWidget');

    this.window;
    this.grid;
    this.accordionPanel;

    this.attrMan;
    this.type;

    this.selectedFilter = new Ext.util.Filter({
        filterFn: function (item) {
            return item.data['Selected'] === true;
        }
    });

    //set instantiation args, must be last
    _.extend(this, args);

    this.on(this.handlers);

    if (this.autoRender) {
        this.render();
    }
};

AttributeEditWidget.prototype = {
    render: function () {
        var _this = this;

        this.attrMan.on('change:attributes', function () {
            _this.reconfigureComponents();
        });

        this.comboStore = Ext.create('Ext.data.Store', {
            fields: ['name'],
            data: this.attrMan.attributes
        });

        /****** UI ******/

        var modifyRowsFormPanel = Ext.create('Ext.form.Panel', {
            title: 'Edit multiple values',
            bodyPadding: 10,
            layout: 'vbox',
            border: 0,
//            flex: 1,
            defaults: {
                width: '100%',
                labelWidth: 55
            },
            dockedItems: [
                {
                    xtype: 'toolbar',
                    dock: 'top',
                    items: [
                        {
                            text: 'Select all rows',
                            handler: function () {
                                _this.grid.getSelectionModel().selectAll();
                            }
                        },
                        {
                            text: 'Deselect all rows',
                            handler: function () {
                                _this.grid.getSelectionModel().deselectAll();
                            }
                        }
                    ]
                }
            ],
            items: [
                this.createAttributesCombo(),
                this.createValueField(),
                {
                    xtype: 'button',
                    text: 'Apply on selected rows',
                    formBind: true, // only enabled if the form is valid
                    disabled: true,
                    handler: function (bt) {
                        var newValue = bt.prev().getValue();
                        var selectedAttr = bt.prev().prev().getValue();
                        var selectedRecords = _this.grid.getSelectionModel().getSelection();
                        _this.attrMan.setRecordsAttribute(selectedRecords, selectedAttr, newValue);
                    }
                }
            ]
        });
        var addAttributeFormPanel = Ext.create('Ext.form.Panel', {
            title: 'Add attribute',
            bodyPadding: 10,
            layout: 'vbox',
            border: 0,
//            flex: 1,
            style: {
                borderTopColor: 'lightgray',
                borderTopStyle: 'solid',
                borderTopWidth: '1px'
            },
            defaults: {
                width: '100%',
                labelWidth: 55
            },
            items: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'Name',
                    allowBlank: false
                },
                {
                    xtype: 'combo',
                    hidden: true,
                    store: ['string', 'int', 'float'],
                    value: 'string',
                    fieldLabel: 'Type',
                    editable: false,
                    queryMode: 'local',
                    allowBlank: false
                },
//                {
//                    xtype: 'textfield',
//                    width: 170,
//                    value: '',
//                    fieldLabel: 'Default value',
//                    labelWidth: 50
//                },
                {
                    xtype: 'button',
                    text: 'Apply',
                    formBind: true, // only enabled if the form is valid
                    disabled: true,
                    handler: function (bt) {
                        var name = bt.previousSibling('textfield[fieldLabel=Name]').getValue();
                        var type = bt.previousSibling('combo[fieldLabel=Type]').getValue();
//                        var defaultValue = bt.prev().getValue();
                        var created = _this.attrMan.addAttribute({name: name, type: type, defaultValue: ''});
                        var msg = (created === false) ? '<span class="err">Name already exists.</span>' : '';
                        bt.next().update(msg);
                    }
                },
                {
                    xtype: 'box',
                    margin: '10 0 0 0',
                    html: ''
                }
            ]
        });

        var removeAttributeFormPanel = Ext.create('Ext.form.Panel', {
            title: 'Remove attribute',
            bodyPadding: 10,
            layout: 'vbox',
            border: 0,
//            flex: 1,
            style: {
                borderTopColor: 'lightgray',
                borderTopStyle: 'solid',
                borderTopWidth: '1px'
            },
            defaults: {
                width: '100%',
                labelWidth: 55
            },
            items: [
                this.createAttributesCombo(),
                {
                    xtype: 'button',
                    text: 'Apply',
                    formBind: true, // only enabled if the form is valid
                    disabled: true,
                    handler: function (bt) {
                        var attributeName = bt.prev().getValue();
                        var removed = _this.attrMan.removeAttribute(attributeName);
                        var msg = (removed === false) ? '<span class="err">Impossible to remove.</span>' : '';
                        bt.next().update(msg);
                    }
                },
                {
                    xtype: 'box',
                    margin: "10 0 0 0"
                }
            ]
        });

        var toolbar = Ext.create('Ext.toolbar.Toolbar', {
            dock: 'top',
            items: [
                {
                    xtype: 'button',
                    text: '<span style="font-size: 12px">Columns <span class="caret"></span></span>',
                    handler: function (bt, e) {
                        var menu = _this.grid.headerCt.getMenu().down('menuitem[text=Columns]').menu;
                        menu.showBy(bt);
                    }
                },
                '-',
                {
//                    toolbar.down('radiogroup').getValue() --> {selection: "all"}
                    xtype: 'radiogroup',
                    id: this.id + 'selectMode',
                    fieldLabel: 'Show',
                    labelWidth: 30,
                    width:230,
                    margin: '0 0 0 10',
                    defaults: {
                        margin: '0 0 0 10'
                    },
                    layout: 'hbox',
                    items: [
                        {
                            boxLabel: 'All',
                            checked: true,
                            name: this.id + 'selection',
                            inputValue: 'all'
                        },
                        {
                            boxLabel: 'Network selection',
                            name: this.id + 'selection',
                            inputValue: 'selected'
                        }
                    ],
                    listeners: {
                        change: function (radiogroup, newValue, oldValue, eOpts) {
                            _this.checkSelectedFilter();
                        }
                    }
                },
                '->',
                {
                    xtype: 'tbtext',
                    text: '<span style="color:gray">Use double-click to edit</span>'
                },
                {
                    xtype: 'button',
                    text: '<i class="fa fa-download"></i> Download as file',
                    handler: function (bt, e) {
                        var a = bt.getEl();
                        var string = _this.attrMan.getAsFile();
                        var blob = new Blob([string], {type: "data:text/tsv"});
                        var url = URL.createObjectURL(blob);
                        var link = document.createElement('a');
                        link.href = url;
                        link.download = _this.type + ".attr"
                        var event = new MouseEvent('click', {
                            'view': window,
                            'bubbles': true,
                            'cancelable': true
                        });
                        link.dispatchEvent(event);
                    }
                }
            ]
        });

        this.grid = Ext.create('Ext.grid.Panel', {
            store: this.attrMan.store,
            columns: this.attrMan.columnsGrid,
            flex: 1,
            border: 0,
            selModel: {
                selType: 'rowmodel',
                mode: 'MULTI'
            },
            loadMask: true,
            plugins: ['bufferedrenderer',
                Ext.create('Ext.grid.plugin.CellEditing', {
                    // double click to edit cell
                    clicksToEdit: 2
                })
            ],
            listeners: {
//                selectionchange: function (model, selected) {
//                    console.log('selection change')
//                    var nodeList = [];
//                    for (var i = 0; i < selected.length; i++) {
//                        nodeList.push(selected[i].getData().Id);
//                    }
//                }
            },
            dockedItems: [toolbar]

        });

        this.accordionPanel = Ext.create('Ext.container.Container', {
            layout: {
                type: 'vbox',
                align: 'stretch'
            },
            width: 230,
            border: '0 1 0 0',
            style: {
                borderColor: 'lightgray',
                borderStyle: 'solid',
                backgroundColor: '#ffffff'
            },
            items: [
                modifyRowsFormPanel,
                addAttributeFormPanel,
                removeAttributeFormPanel,
//                editAttrFormPanel
            ]
        });

        this.window = Ext.create('Ext.window.Window', {
            id: "edit" + this.type + "AttrWindow",
            title: "Edit " + this.type.toLowerCase() + " attributes",
            width: 850,
            height: 600,
            closable: false,
            minimizable: true,
            maximizable: true,
            constrain: true,
            collapsible: true,
            layout: {
                type: 'hbox',
                align: 'stretch'
            },
            renderTo: Ext.getBody(),
            items: [this.accordionPanel, this.grid],
            listeners: {
                minimize: function () {
                    this.hide();
                }
            }
        });
    },
    draw: function () {
        this.window.show();
        this.checkSelectedFilter();
    },
    show: function () {
        this.window.show();
    },
    hide: function () {
        this.window.hide();
    },
//    setAttributeManager: function (attrMan) {
//        var _this = this;
//        this.attrMan = attrMan;
//        this.attrMan.on('change:attributes', function () {
//            _this.reconfigureComponents();
//        });
//        this.reconfigureComponents();
//    },
    reconfigureComponents: function () {
        this.grid.reconfigure(this.attrMan.store, this.attrMan.columnsGrid);

        this.reloadComboStore();
    },
    reloadComboStore: function () {
        this.comboStore.loadData(this.attrMan.attributes);
    },
    checkSelectedFilter: function () {
        this.attrMan.store.clearFilter();
        var value = Ext.getCmp(this.id + 'selectMode').getValue();
        if (value[this.id + 'selection'] === 'selected') {
            this.attrMan.store.setFilters(this.selectedFilter);
        }
    },


    /** Create components **/
    createAttributesCombo: function () {
        return {
            xtype: 'combo',
            store: this.comboStore,
            displayField: 'name',
            valueField: 'name',
            allowBlank: false,
            fieldLabel: 'Attribute',
            editable: false,
            queryMode: 'local'
        }
    },
    createValueField: function () {
        return {
            xtype: 'textfield',
            fieldLabel: 'Value',
            allowBlank: false
        }
    }


}