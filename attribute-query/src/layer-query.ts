import { TableLoader } from './table-loader';
import { TableManager } from './table-manager';
import { PROVINCE } from './template';


export class MakeQuery {
    private _mapApi: any;
    private _configLang: any;

    private query: any;
    private curProv: any;
    private queryURL: any;
    private queryTask: any;
    private whereclause: any;
    private loadingPanel: any;

    private baseURL: string = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";


    constructor(mapApi: any, configLang: any) {
        this._mapApi = mapApi;
        this._configLang = configLang;

        this.openLoadingPanel(mapApi)

    }

    getProvinceAbrev() {

        let selectProvinceHTML = <HTMLInputElement>document.getElementById("selectInput");
        let selectProvinceText = selectProvinceHTML.innerText;

        if (selectProvinceText === 'Province') {
            return 'CA';
        } else {
            return PROVINCE[this._configLang][selectProvinceText];
        }
    }

    openLoadingPanel(mapApi) {

        let legendBlock = {
            name: "Survey Plan Results",
            loadingPanel: {},
            formattedData:''
        }

        this.loadingPanel = new TableLoader(mapApi, legendBlock);

        /*let loadingTimeout = setTimeout(() => {
            legendBlock.loadingPanel = this.loadingPanel;
            legendBlock.formattedData;
        }, 200);*/

        let restLayerNumber = 0
        let planInputID = "planInput"
        this.executeQuery(restLayerNumber, planInputID);

    }; 

    executeQuery(layerNumber, inputBoxID) {

        this.query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        this.curProv = this.getProvinceAbrev();
        this.queryURL = this.baseURL + "WMB_Query_" + this.curProv + "/MapServer/" + layerNumber;
        this.queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(this.queryURL)

        let htmlInputBox = <HTMLInputElement>document.getElementById(inputBoxID)

        if (htmlInputBox && htmlInputBox.value != "") {
            this.whereclause = "planno like '%" + htmlInputBox.value.toUpperCase().replace("'", "''") + "%'";
        }
    
        this.query.where = this.whereclause;
        this.query.returnGeometry = false;
        this.query.outFields = ["PLANNO", "P2_DESCRIPTION", "GlobalID", "PROVINCE", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO"];
        this.queryTask.execute(this.query, this.createTable(this.loadingPanel))
    }

    createTable(panel) {
        return function(queryResults) {
            const columns = ['Plan Number', 'Description', 'Date of Survey','Plan Detail', 'LTO']
            panel.setResultsGrid(queryResults.features);
        }
    }
}

export interface MakeQuery {
    feature: string;
    id: string;
    _name: string;
    mapApi: any;
    translations: any;
    legendBlock: any;
    changeBody: TableLoader;
    loadingTimeout: any;
    layerAdded: any;
    tableManager: TableManager;
}


interface ColumnDefinition {
    //headerName: string;
    //headerTooltip: string;
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
    suppressSorting: boolean;
    suppressFilter: boolean;
    lockPosition?: boolean;
    getQuickFilterText?: (cellParams: any) => string;
    sort?: string;
    hide?: boolean;
    cellStyle?: any;
    suppressMovable: any;
}