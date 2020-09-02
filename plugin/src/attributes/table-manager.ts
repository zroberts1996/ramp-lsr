import { PRINT_TABLE} from './table-template';


export class TableManager {
    constructor(mapApi: any) {
        this.mapApi = mapApi;
        this.panel = this.mapApi.panels.create('testTable');
        //this.setListeners();
        //this.prepListNavigation();
        this.panel.body = $(`<div rv-focus-exempt></div>`);
        this.panel.element.addClass('ag-theme-material mobile-fullscreen tablet-fullscreen');
        this.panel.element.css({
            top: '410px',
            left: '410px'
        });
        this.panel.allowUnderlay = false;

        const close = this.panel.header.closeButton;
        close.removeClass('primary');
        close.addClass('black md-ink-ripple');
        this.setSize();

        //destroy the table properly whenever the panel is closed
        this.panel.closing.subscribe(() => {
            this.cleanUp();
        });
    }

    /*angularHeader() {
        const that = this;
        this.mapApi.agControllerRegister('MenuCtrl', function () {
            this.appID = that.mapApi.id;
            this.maximized = that.maximized ? 'true' : 'false';
            this.showFilter = that.panelStateManager.colFilter;
            this.filterByExtent = that.panelStateManager.filterByExtent;
            this.printEnabled = that.configManager.printEnabled;
            this.lazyFilter = that.panelStateManager.lazyFilter;
            this.startsWithFilter = !that.panelStateManager.lazyFilter;

            // sets the table size, either split view or full height
            // saves the set size to PanelStateManager
            this.setSize = function (value) {
                that.panelStateManager.maximized = value === 'true' ? true : false;
                that.maximized = value === 'true' ? true : false;
                that.setSize();
                that.panelStatusManager.getScrollRange();
            };

            // print button has been clicked
            this.print = function () {
                that.onBtnPrint();
            };
        });
    };


    onBtnPrint() {
        let win = window.open('../print-table.html', '_blank');
        win.document.write(this.createHTMLTable());
    }*/

    setSize() {
        if (this.maximized) {
            this.panel.element.css({ bottom: '0' });
        } else {
            this.panel.element.css({ bottom: '50%' });
        }
    }

    cleanUp() {
        //this.panelStateManager.sortModel = this.tableOptions.api.getSortModel();

        //if (this.gridBody !== undefined) {
        //    removeAccessibilityListeners(this.panel.element[0], this.gridBody);
        //}
        //this.panelStateManager.isOpen = false;
        //this.panelRowsManager.destroyObservers();
        //if (this.toastInterval !== undefined) {
        //    clearInterval(this.toastInterval);
        //}
        //this.currentTableLayer = undefined;

        // if enhancedTable closes, set focus to close button
        const mapNavContent = $('#' + this.mapApi.id).find('.rv-mapnav-content');
        mapNavContent.find('button')[0].focus();
    }

    createHTMLTable() {
        // make a dictionary of column keys with header names
        let columns = {};
        this.tableOptions.columnApi.columnController.allDisplayedCenterVirtualColumns.map(col => {
            if (col.colDef.field !== 'rvSymbol' && col.colDef.field !== 'rvInteractive' && col.colDef.field !== 'zoom') {
                columns[col.colDef.field] = col.colDef.headerName;
            }
        });

        // get displayed rows
        const rows = this.tableOptions.api.rowModel.rowsToDisplay;

        // create a printable HTML table with only rows and columns that
        // are currently displayed.
        return PRINT_TABLE(this.configManager.title, columns, rows);
    }
}

export interface TableManager {
    panel: any;
    mapApi: any;
    _id: string;
    currentTableLayer: any;
    maximized: boolean;
    tableOptions: any;
    legendBlock: any;
    //panelRowsManager: PanelRowsManager;
    //panelStatusManager: PanelStatusManager;
    lastFilter: HTMLElement;
    gridBody: HTMLElement;
    configManager: any;
    //mobileMenuScope: MobileMenuScope;
    //recordCountScope: RecordCountScope;
    //_panelStateManager: PanelStateManager;
    searchText: string;
    filterByExtent: boolean;
    filtersChanged: boolean;
    hiddenColumns: any;
    columnMenuCtrl: any;
    clearGlobalSearch: Function;
    reload: Function;
    toastInterval: any;
    showToast: Function;
}

TableManager.prototype.maximized = false;