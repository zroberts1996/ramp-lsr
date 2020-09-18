import { TABLE_LOADING_TEMPLATE2 } from './table-template';
import { GRID_TEMPLATE, TABS_TEMPLATE, zoom_BUTTON, ZOOM_TEMPLATE } from '../templates/template';
import { Grid } from 'ag-grid-community';
import { PanelStateManager } from './panel-state-manager'
import { ZoomToElement } from './button-test'

export class TableLoader {

    constructor(mapApi: any, legendBlock) {
        this.mapApi = mapApi;
        this.legendBlock = legendBlock;   
        this.createPanel()
        //this.hidden = true;
        this.panelManager = new PanelStateManager('tableLoaderId', this.legendBlock);  
    }

    set panelStateManager(newPanelStateManager: PanelStateManager) {
        // store the column state before replacing the state manager
        //if (this._panelStateManager && this.tableOptions) {
        //    this._panelStateManager.columnState = this.tableOptions.columnApi.getColumnState();
        //}
        this._panelStateManager = newPanelStateManager;
    }

    get panelStateManager() {
        return this._panelStateManager;
    }

    createPanel() {
        this.panel = this.mapApi.panels.create('tableLoaderId');
        this.panel.element.css({top: '50%', left: '20%', right: '52px',});
        this.panel.element.addClass('ag-theme-material mobile-fullscreen tablet-fullscreen');
        this.panel.allowUnderlay = true;
        this.prepareHeader(this.mapApi);
        this.prepareBody();
        //this.hidden = true;
        this.open()
    }

    setSize(maximized) {
        if (maximized) {
            this.panel.element.css({ bottom: '0' });;
        } else {
            this.panel.element.css({ bottom: '50%' });;
        }
    }

    prepareHeader(mapApi) {
        //this.panel.header.toggleButton
        this.panel.header.title = this.legendBlock.name;
        
        /*
        const customBtn2 = new this.panel.Button('Parcel');
        customBtn2.$.on('click', function() { });
        this.panel.header.append(customBtn2);
        */
        this.panel.header.closeButton;
    }

    open() {
        this.panel.open();
        this.hidden = false;
    }

    prepareBody() {
        let template = TABLE_LOADING_TEMPLATE2(this.legendBlock);
        this.panel.body = template;
    }

    setSpatialGrid(results) {
        this.panel.body = this.compileTemplate(GRID_TEMPLATE);
        let gridDiv = <HTMLElement>document.querySelector('#plan')


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
        
        results.forEach(function(result) {
            gridOptions.rowData.push({
                parcelDesignator: result.attributes['PARCELDESIGNATOR'], 
                planNumber: result.attributes['PLANNO'],
                planDetail: result.attributes['PARCELFC_ENG'],
                remainder: result.attributes['REMAINDERIND_ENG'],
           })
        })

        new Grid(gridDiv, gridOptions);
    }

    setResultsGrid(results, mapApi) {
        const self = this;
        this.panel.body = this.compileTemplate(GRID_TEMPLATE);
        
        let tabElement = document.getElementsByName('plan')[0]

        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }
        

        let gridOptions = {
            columnDefs: [
                {
                    headerName: 'Plan Number', 
                    field:'planNumber',
                    headerTooltip: 'Plan Number', 
                    cellRenderer: function (cell) {
                        return cell.value
                    },
                },
                {headerName: 'Description', field:'description', headerTooltip: 'Description'},
                {headerName: 'Date of Survey', field:'dateSurvey', headerTooltip: 'Date of Survey'},
                {headerName: 'Plan Detail', field:'planDetail', headerTooltip: 'Plan Detail'},
                {headerName: 'LTO', field:'lto', headerTooltip: 'List of survey document (plan) results from the attributes and map searches'},
            ],

            rowData:[],

            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            },

            rowStyle: {
                background: 'white'
            },

            pagination: true,

            enableColResize: true,
        }
        
        results.forEach(function(result) {
            let date = result.attributes['P3_DATESURVEYED'];
            let year = date.substr(0,4);
            let month = date.substr(4,2);
            let day = date.substr(6,2);
            let newDate = new Date(year, month, day).toLocaleString();

            gridOptions.rowData.push({
                planNumber: result.attributes['PLANNO'],
                description: result.attributes['P2_DESCRIPTION'],
                dateSurvey: newDate,
                planDetail: result.attributes[''],
                lto: result.attributes['ALTERNATEPLANNO'],
                globalid: result.attributes['GlobalID'],
                province:result.attributes['PROVINCE']
            })
        })

        gridOptions.columnDefs[0].cellRenderer = function(params) {
            var eDiv = document.createElement('div');
            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            //eDiv.innerHTML = '<span class="my-css-class"><button class="btn-simple">Push Me</button></span>';
            //var eButton = eDiv.querySelectorAll('.btn-simple')[0];
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseover', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover')
                //mapApi.esriMap.graphics.clear();
            });
            eDiv.addEventListener('mouseout', function() {
                
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }

        let gridDiv = <HTMLElement>document.querySelector('#plan')
        new Grid(gridDiv, gridOptions);
    }

    compileTemplate(template): JQuery<HTMLElement> {
        let temp = $(template);
        this.mapApi.$compile(temp);
        return temp;
    }

    close() {
        this.panel.close();
    }
    
}

function setUpSymbolsAndInteractive(columnName: string, colDef: any, cols: any, mapApi: any, layerProxy: any) {
    if (columnName === 'rvSymbol' || columnName === 'rvInteractive') {
        // symbols and interactive columns don't have options for sort, filter and have default widths
        colDef.suppressSorting = true;
        colDef.suppressFilter = true;
        colDef.lockPosition = true;

        if (columnName === 'rvSymbol') {
            colDef.maxWidth = 82;
            // set svg symbol for the symbol column
            colDef.cellRenderer = function (cell) {
                return cell.value;
            };
            colDef.cellStyle = function (cell) {
                return {
                    paddingTop: '7px'
                };
            };
        } else if (columnName === 'rvInteractive') {
            colDef.maxWidth = 40;
            // sets details and zoom buttons for the row
            let zoomDef = (<any>Object).assign({}, colDef);
            zoomDef.field = 'zoom';
            zoomDef.cellRenderer = function (params) {
                var eSpan = $(ZOOM_TEMPLATE(params.data[layerProxy.oidField]));
                mapApi.$compile(eSpan);
                params.eGridCell.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        eSpan.click();
                    }
                });
                params.eGridCell.style.padding = 0;
                return eSpan[0];
            };
            cols.splice(0, 0, zoomDef);
            /*
            colDef.cellRenderer = function (params) {
                var eSpan = $(DETAILS_TEMPLATE(params.data[layerProxy.oidField]));
                mapApi.$compile(eSpan);
                params.eGridCell.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        eSpan.click();
                    }
                });
                params.eGridCell.style.padding = 0;
                return eSpan[0];
            };*/
        }
        cols.splice(0, 0, colDef);
    } else {
        cols.push(colDef);
    }
}
interface ColumnDefinition {
    headerName: string;
    headerTooltip: string;
    minWidth?: number;
    maxWidth?: number;
    width?: number;
    field: string;
    //headerComponent?: { new(): CustomHeader };
    //headerComponentParams?: HeaderComponentParams;
    //filter: string;
    //filterParams?: any;
    //floatingFilterComponent?: undefined;
    //floatingFilterComponentParams: FloatingFilterComponentParams;
    cellRenderer?: (cellParams: any) => string | Element;
    //suppressSorting: boolean;
    //suppressFilter: boolean;
    lockPosition?: boolean;
    getQuickFilterText?: (cellParams: any) => string;
    sort?: string;
    hide?: boolean;
    cellStyle?: any;
    suppressMovable?: any;
}


export interface TableLoader {
    mapApi: any;
    panel: any;
    hidden: boolean;
    legendBlock: any;
    _panelStateManager: PanelStateManager;
    panelManager: any;
}
