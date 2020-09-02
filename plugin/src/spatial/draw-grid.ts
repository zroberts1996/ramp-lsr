
import { Grid } from 'ag-grid-community';
import { TabGroupAlignExample } from './draw-tab';
import { TAB } from '../templates/draw-template';
import { GRID_TEMPLATE, TABS_TEMPLATE } from '../templates/template';
import {Component} from '@angular/core';
const Draggabilly = require('draggabilly');

export class TableLoader {
    private _panelOptionsForm: object = { bottom: '0em', right: '450px', top: '50%', height: '360px', width: '650px', left: '50%', marginLeft: '-250px', marginTop: '-180px'};


    constructor(mapApi: any) {
        this.mapApi = mapApi;
        //this.panel = this.mapApi.panels.create('customForm');
        this.panel = this.mapApi.panels.create('tableLoaderId');
        this.panel.element.css(this._panelOptionsForm);
        //this.panel.tab = this.compileTemplate(TAB);
        this.panel.tab = this.compileTemplate(TABS_TEMPLATE);

        this.panel.header.title = 'Spatial Results';
        this.panel.header.closeButton;
        this.panel.allowOffscreen = true;

        // Make panel draggable
        this.panel.element.addClass('draggable');
        const draggable = new Draggabilly(this.panel.element.get(0), {
            handle: '.rv-header'
        });
        
    }
    /*
    makeTable(rows) {
        this.panel.open(); 
        this.panel.body = this.compileTemplate(GRID_TEMPLATE);
        let gridDiv = <HTMLElement>document.querySelector('#resultsGrid')


        let gridOptions = {
            columnDefs: [
                {headerName: 'Plan Designator', field:'parcelDesignator', sort:'asc', filter: 'agTextColumnFilter', headerTooltip: 'Plan Designator'},
                {headerName: 'Plan Number', field:'planNumber', headerTooltip: 'Plan Number'},
                {headerName: 'Plan Detail', field:'planDetail', headerTooltip: 'Plan Detail'},
                {headerName: 'Remainder', field:'remainder', headerTooltip: 'Remainder'},
            ],

            rowData: [],

            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            },

            rowStyle: {
                background: 'white'
            },

            pagination: true,
            enableColResize: true,

        }
        
        rows.forEach(function(result) {
            gridOptions.rowData.push({
                parcelDesignator: result.attributes['PARCELDESIGNATOR'], 
                planNumber: result.attributes['PLANNO'],
                planDetail: result.attributes['PARCELFC_ENG'],
                remainder: result.attributes['REMAINDERIND_ENG'],
           })
        })

        new Grid(gridDiv, gridOptions);
    }*/

    compileTemplate(template): JQuery<HTMLElement> {
        let temp = $(template);
        this.mapApi.$compile(temp);
        return temp;
    }
}

export interface TableLoader {
    mapApi: any;
    panel: any;
    hidden: boolean;
    legendBlock: any;
}