import { TableLoader } from './table-loader';
import { TableManager } from './table-manager';
import { GRID_TEMPLATE } from '../templates/template';
import { PROVINCE_NAME, PROXY_FIELDS, SEARCH_LAYERS } from '../templates/constants'

//const PROXY_SEARCH_URL = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_@{Province}/MapServer/@{layer}";

export class MakeQuery {
    private _mapApi: any;
    private _configLang: any;
    private whereclause: any;
    private loadingPanel: any;
    private queryOptions: string;
    
    //private outFields: any;
    private orderByField: any;
    private baseURL: string = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";

    private layer: any;
    private result: any;
    private province: any;
    private fields: any;
    private clause: any;

    constructor(mapApi: any, configLang: any, searchInfo, panel: any) {
        this._mapApi = mapApi;
        this._configLang = configLang;
        this._searchInfo = searchInfo;
        this.queryOptions = searchInfo.option;
        this.loadingPanel = panel;
        this.result = null;

        if (searchInfo.other == 'parcel') {
            this._searchInfo.main = 'plan'
            this.setquery(this._searchInfo);

            this._searchInfo.type = 'parcel'
            this._searchInfo.main = 'parcel'

            this.setquery(this._searchInfo);
        }
        else {
           this.setquery(this._searchInfo); 
        }
        
        //this.openLoadingPanel();
        //this.setQueryInfo(this.queryOptions);
        //this.setQueryPlan();
        //this.setQueryPlan()
        //this.executeQuery();
    }

    getResult() {
        return this.result;
    }

    setResult(result) {
        this.result = result.features;
    }

    getProvince() {
        return this.province;
    }

    setProvince(province) {
        if (!province) {
            this.province = 'CA';
        }
        else {
            this.province = PROVINCE_NAME[this._configLang][province];
        }
    }

    setWhereClause(type, other) {
        if (type == 'reserve' || type == 'community' || type == 'park' || type == 'cree' || type == 'municipal') {
            return "ENGLISHNAME like '%@input%'";
        }
        //if (type == 'admin') {
        //    return "ENGLISHNAME like '%@input%'";
        //}
        else if (type == 'parcel') {
            if (other == 'parcel') {
                return "planno like '%@input%'" ;
            }
            else {
                return "PARCELDESIGNATOR like '%@input%'";
            }
        }
        else if (type == 'plan') {
            return "planno like '%@input%'" 
        }
        else if (type == 'project') {
            return "projectNumber like '%@input%'";
        }
    }

    setquery(info) {

        this.layer = SEARCH_LAYERS[info.type];
        this.fields =  PROXY_FIELDS[info.type];
        this.orderByField = this.fields[0];

        this.clause = this.setWhereClause(info.type, info.other).replace('@input', (info.input).toUpperCase());

        if (info.reserve) {
            if (info.type == 'plan' || info.type == 'parcel' ) {
                this.clause += " AND GEOADMINCODE LIKE '%" + info.reserve + "%'";
            }
            else {
                this.clause += " AND ADMINAREAID LIKE '%" + info.reserve + "%'";
            }
            
        }
        if (info.band) {
            this.clause += " AND FIRSTNATION like '%" + info.band + "%'";
        }

        this.setProvince(this._searchInfo.province);
        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let queryURL = this.baseURL + "WMB_Query_" + this.getProvince() + "/MapServer/" + this.layer;
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL);

        query.where = this.clause;
        query.returnGeometry = false;
        query.outFields = this.fields;
        query.orderByFields = [this.orderByField];
        queryTask.execute(query, this.createTable(this.loadingPanel, [info.main]));
    };

    /*executeQuery() {
        this.setProvince(this._searchInfo.province);

        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let queryURL = this.baseURL + "WMB_Query_" + this.getProvince() + "/MapServer/" + this.layer;
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL);

        query.where = this.whereclause;
        query.returnGeometry = false;
        query.outFields = this.outFields
        query.orderByFields = this.orderByField;
        let type = [this.queryOptions];
        
        queryTask.execute(query, this.createTable(this.loadingPanel, type))

    }*/

    createTable(panel, type) {
        const mapApi = this._mapApi;
        return function(queryResults) {
            panel.setResultsGrid(queryResults.features, mapApi, type);
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
