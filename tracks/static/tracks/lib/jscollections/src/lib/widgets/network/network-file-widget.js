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

function NetworkFileWidget(args) {
    var _this = this;
    _.extend(this, Backbone.Events);
    this.id = Utils.genId('NetworkFileWidget');

    this.targetId;
    this.title = 'Network widget abstract class';
    this.width = 600;
    this.height = 300;
    this.layoutSelector = true;

    //set instantiation args, must be last
    _.extend(this, args);

    this.dataAdapter;
    this.content;

    this.on(this.handlers);
};

NetworkFileWidget.prototype.getTitleName = function () {
    return Ext.getCmp(this.id + "_title").getValue();
};

NetworkFileWidget.prototype.getFileUpload = function () {
    /* to implemtent on child class */
};

NetworkFileWidget.prototype.addCustomComponents = function () {
    /* to implemtent on child class */
};

NetworkFileWidget.prototype.draw = function () {
    var _this = this;

    if (this.panel == null) {
        /** Bar for the file upload browser **/
        var browseBar = Ext.create('Ext.toolbar.Toolbar', {dock: 'top'});
        browseBar.add(this.getFileUpload());

        this.infoLabel = Ext.create('Ext.toolbar.TextItem', {text: 'Please select a network saved file'});
        this.countLabel = Ext.create('Ext.toolbar.TextItem');
        this.infobar = Ext.create('Ext.toolbar.Toolbar', {dock: 'bottom'});
        this.infobar.add(['->', this.infoLabel, this.countLabel]);

//		/** Container for Preview **/
//		var previewContainer = Ext.create('Ext.container.Container', {
//			id:this.previewId,
//			cls:'x-unselectable',
//			flex:1,
//			autoScroll:true
//		});


        /** Grid for Preview **/
        this.gridStore = Ext.create('Ext.data.Store', {
            pageSize: 50,
            proxy: {
                type: 'memory'
            },
            fields: ["0", "1", "2"]
        });
        this.grid = Ext.create('Ext.grid.Panel', {
            border: false,
            flex: 1,
            store: this.gridStore,
            loadMask: true,
            plugins: ['bufferedrenderer'],
            dockedItems: [
                this.infobar
            ],
            columns: [
                {"header": "Source node", "dataIndex": "0", flex: 1},
                {"header": "Relation", "dataIndex": "1", flex: 1, menuDisabled: true},
                {"header": "Target node", "dataIndex": "2", flex: 1}
            ]
        });

        var comboLayout;
        if (this.layoutSelector) {
            var comboLayout = Ext.create('Ext.form.field.ComboBox', {
                margin: "0 0 0 5",
                width: 240,
                editable: false,
                labelWidth: 90,
                fieldLabel: 'Apply layout',
                displayField: 'name',
                valueField: 'name',
                value: "Force directed",
                store: new Ext.data.SimpleStore({
                    fields: ['name'],
                    data: [
                        ["Force directed"],
                        ["Random"],
                        ["Circle"],
                        ["none"]
                    ]
                })
            });
        }

        this.panel = Ext.create('Ext.window.Window', {
            title: this.title,
            resizable: false,
            items: {
                border: false,
                width: this.width,
                height: this.height,
                layout: { type: 'vbox', align: 'stretch'},
                items: [
                    this.grid
                ],
                tbar: browseBar,
                bbar: {
                    defaults: {
                        width: 100
                    },
                    items: [
                        comboLayout,
                        '->',
                        {text: 'Ok', handler: function () {
                            var layout;
                            if (comboLayout) {
                                layout = comboLayout.getValue()
                            }
                            _this.trigger('okButton:click', {content: _this.content, layout: layout, sender: _this});
                            _this.panel.close();
                        }
                        },
                        {text: 'Cancel', handler: function () {
                            _this.panel.close();
                        }}
                    ]

                }
            },
            listeners: {
                scope: this,
                minimize: function () {
                    this.panel.hide();
                },
                destroy: function () {
                    delete this.panel;
                }
            }
        });
        this.addCustomComponents();

    }
    this.panel.show();
};
