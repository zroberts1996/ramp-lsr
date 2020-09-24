import { TableLoader } from './table-loader';
import { TableManager } from './table-manager';
import { PROVINCE } from '../templates/template';


export class MakeQuery {
    private _mapApi: any;
    private _configLang: any;
    private whereclause: any;
    private loadingPanel: any;
    private queryType: string;
    private layer: any;
    private outFields: any;
    private orderByField: any;
    private baseURL: string = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";

    constructor(mapApi: any, configLang: any, searchInfo) {
        this._mapApi = mapApi;
        this._configLang = configLang;
        this._searchInfo = searchInfo;
        this.queryType = searchInfo.type;

        this.setQueryInfo(this.queryType);
        this.openLoadingPanel(mapApi)
        this.executeQuery();
    }

    getProvinceAbrev() {
        let selectProvinceHTML = <HTMLInputElement>document.getElementById("selectProvince");
        let selectProvinceText = selectProvinceHTML.innerText;

        if (selectProvinceText === 'Select Province or Territory') {
            return 'CA';
        } 
        else {
            return PROVINCE[this._configLang][selectProvinceText];
        }
    }

    openLoadingPanel(mapApi) {
        let headerTitle = {name: this.queryType};
        this.loadingPanel = new TableLoader(mapApi, headerTitle);
    };

    setQueryInfo(type) {

        if (type == 'community') {
            this.layer = 2;
            this.outFields = ["ADMINAREAID", "FRENCHNAME", "ENGLISHNAME", "PROVINCE", "GlobalID"];
            this.whereclause = "ENGLISHNAME like '%" + this._searchInfo.communityName.toUpperCase().replace("'", "''") + "%'"  //%' "FRENCHNAME like '%" +  this._searchInfo.communityName.toUpperCase().replace("'", "''") + "% OR ENGLISHNAME like '%" +  this._searchInfo.communityName.toUpperCase().replace("'", "''") + "%'";
        }
        else if (type == 'protected') {
            this.layer = 7;
            this.outFields = ["ADMINAREAID", "FRENCHNAME", "ENGLISHNAME", "PROVINCE", "GlobalID"];
            this.whereclause = "planno like '%" + this._searchInfo.protected.toUpperCase().replace("'", "''") + "%'";
        }
        else if (type == 'plan') {
            this.layer = 0;
            this.orderByField = ['planno'];
            this.outFields = ["PLANNO", "P2_DESCRIPTION", "GlobalID", "PROVINCE", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO"];
            this.whereclause =  "planno like '%" + this._searchInfo.planNumber.toUpperCase().replace("'", "''") + "%'";
            if (this._searchInfo.reserve) {
                this.whereclause +=  "AND GEOADMINCODE LIKE '%" + this._searchInfo.reserve + "%'"
            }
        }

    }

    executeQuery() {
        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let curProv = this.getProvinceAbrev();
        let queryURL = this.baseURL + "WMB_Query_" + curProv + "/MapServer/" + this.layer;
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL)

        query.where = this.whereclause;
        query.returnGeometry = false;
        query.outFields = this.outFields
        query.orderByFields = this.orderByField;
        queryTask.execute(query, this.createTable(this.loadingPanel, this._mapApi))
    }

    createTable(panel, mapApi) {
        return function(queryResults) {
            panel.setResultsGrid(queryResults.features, mapApi);
        }
    }

}

export interface MakeQuery {
    feature: string;
    id: string;
    _name: string;
    mapApi: any;
    _searchInfo: any;
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