import { TableLoader } from './table-loader';
import { TableManager } from './table-manager';
import { GRID_TEMPLATE } from '../templates/template';
import { PROVINCE_NAME, PROXY_FIELDS, SEARCH_LAYERS } from '../templates/constants'

const PROXY_SEARCH_URL = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_@{Province}/MapServer/@{layer}";


export class MakeQuery {
    private _mapApi: any;
    private _configLang: any;
    private whereclause: any;
    private loadingPanel: any;
    private queryOptions: string;
    
    private outFields: any;
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
            //this._searchInfo.main = 'plan'
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

    /*changeObj = (obj, info) => {
        obj = {
            adminArea: {
                layer: 3,
                //field: ["ADMINAREAID", "FRENCHNAME", "ENGLISHNAME", "PROVINCE", "GlobalID"],
                field: PROXY_FIELDS.info,
                clause: "ENGLISHNAME like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'",
                optionClause: " AND FIRSTNATION like '%" + this._searchInfo.band + "%'",
            },
            protectedArea: {
                layer: 7,
                field: ["PLANNO", "P2_DESCRIPTION", "GlobalID", "PROVINCE", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO"],
                clause: "",
            },
            surveyPlan: {
                layer: 0,
                field: ["PROJECTNUMBER", "DESCRIPTION", "PROVINCE", "URL", "GlobalID"],
                clause: "planno like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'",
                optionClause: " AND GEOADMINCODE LIKE '%" + this._searchInfo.reserve + "%'"
            },
            surveyProject: {
                layer: 9,
                field:  ["PARCELDESIGNATOR", "PLANNO", "PARCELFC_ENG", "REMAINDERIND_ENG", "GlobalID_PAR", "GlobalID_PLA", "PROVINCE"],
                clause: "projectNumber like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'",
                optionClause: " AND GEOADMINCODE LIKE '%" + this._searchInfo.reserve + "%'"
            },
        }
    }*/
    
    /*
    setQueryAdmin() {
        let type = "admin";
        let layer = 3;
        let outFields = ["ADMINAREAID", "FRENCHNAME", "ENGLISHNAME", "PROVINCE", "GlobalID"];
        let orderByField= ['ENGLISHNAME'];
        let whereClause= "ENGLISHNAME like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'";
        this.executeQuery2(whereClause, outFields, orderByField, layer, [type]);
    }

    setQueryProtected() {
        let type = "admin";
        let layer = 7;
        let outFields = ["ADMINAREAID", "FRENCHNAME", "ENGLISHNAME", "PROVINCE", "GlobalID"];
        let orderByField= ['ENGLISHNAME'];
        let whereClause= "planno like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'";
        this.executeQuery2(whereClause, outFields, orderByField, layer, [type]) 
    }
    setQueryPlan() {
        let type = "plan";
        let layer = 0;
        let outFields = ["PLANNO", "P2_DESCRIPTION", "GlobalID", "PROVINCE", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO"];
        let orderByField= ['planno'];
        let whereClause= "planno like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'";
        this.executeQuery2(whereClause, outFields, orderByField, layer, [type]) 
        //this.setQueryParcel(whereClause);
    }

    setQueryProject() {
        let type = "survey";
        let layer = 9;
        let outFields = ["PROJECTNUMBER", "DESCRIPTION", "PROVINCE", "URL", "GlobalID"];
        let orderByField= ['PROJECTNUMBER'];
        let whereClause= "projectNumber like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'";
        this.executeQuery2(whereClause, outFields, orderByField, layer, [type]) 
    }

    setQueryParcel(whereClause) {
        let type = "parcel";
        let layer = 1;
        let outFields = ["PARCELDESIGNATOR", "PLANNO", "PARCELFC_ENG", "REMAINDERIND_ENG", "GlobalID_PAR", "GlobalID_PLA", "PROVINCE"];
        let orderByField= ['PARCELDESIGNATOR'];
        //let whereClause= "PARCELDESIGNATOR like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'";
        this.executeQuery2(whereClause, outFields, orderByField, layer, [type]) 
    }
    
    setQueryInfo(type) {

        if (type == 'admin') {
            this.layer = 2;
            this.outFields = ["ADMINAREAID", "FRENCHNAME", "ENGLISHNAME", "PROVINCE", "GlobalID"];
            this.orderByField = ['ENGLISHNAME'];
            this.whereclause = "ENGLISHNAME like '%" + this._searchInfo.admin.toUpperCase().replace("'", "''") + "%'" ;
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
            this.whereclause =  "planno like '%" + this._searchInfo.plan.toUpperCase().replace("'", "''") + "%'";
            if (this._searchInfo.reserve) {
                this.whereclause +=  "AND GEOADMINCODE LIKE '%" + this._searchInfo.reserve + "%'"
            }
        }
        else if (type == 'survey') {
            this.layer = 9;
            this.orderByField = ['PROJECTNUMBER'];
            this.outFields = ["PROJECTNUMBER", "DESCRIPTION", "PROVINCE", "URL", "GlobalID"];
            this.whereclause =  "projectNumber like '%" + this._searchInfo.survey.toUpperCase().replace("'", "''") + "%'";
            if (this._searchInfo.reserve) {
                this.whereclause +=  "AND GEOADMINCODE LIKE '%" + this._searchInfo.reserve + "%'"
            }
        }
        else if (type == 'parcel') {
            this.layer = 1;
            this.orderByField = ['PARCELDESIGNATOR'];
            this.outFields = ["PARCELDESIGNATOR", "PLANNO", "PARCELFC_ENG", "REMAINDERIND_ENG", "GlobalID_PAR", "GlobalID_PLA", "PROVINCE"];
            this.whereclause =  "PARCELDESIGNATOR like '%" + this._searchInfo.parcel.toUpperCase().replace("'", "''") + "%'";
            if (this._searchInfo.reserve) {
                this.whereclause +=  "AND GEOADMINCODE LIKE '%" + this._searchInfo.reserve + "%'"
            }
            if (this._searchInfo.plan) {
                this.whereclause +=  " AND PLANNO LIKE '%" + this._searchInfo.parcel + "%'"
            }
        }
    }*/
    /*
    executeQuery2(whereClause, outFields, orderByField, layer, type) {
        this.setProvince(this._searchInfo.province);

        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let queryURL = this.baseURL + "WMB_Query_" + this.getProvince() + "/MapServer/" + layer;
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL)

        query.where = whereClause;
        query.returnGeometry = false;
        query.outFields = outFields
        query.orderByFields = orderByField;
        queryTask.execute(query, this.createTable(this.loadingPanel, type))
    }*/
    executeQuery3() {
        this.setProvince(this._searchInfo.province);

        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let queryURL = this.baseURL + "WMB_Query_" + this.getProvince() + "/MapServer/" + this.layer;
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL);

        query.where = this.clause;
        query.returnGeometry = false;
        query.outFields = this.fields
        query.orderByFields = [this.orderByField];
        let type = [this.queryOptions];
        
        queryTask.execute(query, this.createTable(this.loadingPanel, type));

    }

    executeQuery() {
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

    }

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
