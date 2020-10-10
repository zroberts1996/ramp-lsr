import { TableLoader } from './table-loader';
import { TableManager } from './table-manager';
import { PROVINCE } from '../templates/template';

const PROXY_SEARCH_URL = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_@{Province}/MapServer/@{layer}";

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

        this.openLoadingPanel();
        this.setQueryInfo(this.queryType);
        
        this.executeQuery();
    }

    getProvinceAbrev() {
        let selectProvinceHTML = <HTMLInputElement>document.getElementById("selectProvince1");
        let selectProvinceText = selectProvinceHTML.innerText;

        if (selectProvinceText === 'Province') {return 'CA';} 
        else { return PROVINCE[this._configLang][selectProvinceText];}

    }
    getProvinceAbrev2() {
        let selectProvinceHTML = <HTMLInputElement>document.getElementById("selectProvince");
        let selectProvinceText = selectProvinceHTML.innerText;

        if (selectProvinceText === 'Province') {return 'CA';} 
        else { return PROVINCE[this._configLang][selectProvinceText];}

    }

    openLoadingPanel() {
        const mapApi = this._mapApi;
        let headerTitle = {name: this.queryType};
        this.loadingPanel = new TableLoader(mapApi, headerTitle);

        if (this.queryType) {
            if (this.queryType == "10") {
                this.setQueryAdmin()
            }
            else if (this.queryType == "3") {
                this.setQueryProject()
            }
            else if (this.queryType == "2") {
                this.setQueryPlan()
            }
            else if (this.queryType == "8") {
                this.setQueryParcel()
            }
        }
        else {
            this.setQueryAdmin()
            this.setQueryProtected()
            this.setQueryPlan()
            this.setQueryProject()
            this.setQueryParcel()
        }
    };


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
    }
    setQueryProject() {
        let type = "survey";
        let layer = 9;
        let outFields = ["PROJECTNUMBER", "DESCRIPTION", "PROVINCE", "URL", "GlobalID"];
        let orderByField= ['PROJECTNUMBER'];
        let whereClause= "projectNumber like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'";
        this.executeQuery2(whereClause, outFields, orderByField, layer, [type]) 
    }
    setQueryParcel() {
        let type = "parcel";
        let layer = 1;
        let outFields = ["PARCELDESIGNATOR", "PLANNO", "PARCELFC_ENG", "REMAINDERIND_ENG", "GlobalID_PAR", "GlobalID_PLA", "PROVINCE"];
        let orderByField= ['PARCELDESIGNATOR'];
        let whereClause= "PARCELDESIGNATOR like '%" + this._searchInfo.input.toUpperCase().replace("'", "''") + "%'";
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

    }
    executeQuery2(whereClause, outFields, orderByField, layer, type) {
        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let curProv = this.getProvinceAbrev2();
        let queryURL = this.baseURL + "WMB_Query_" + curProv + "/MapServer/" + layer;
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL)

        query.where = whereClause;
        query.returnGeometry = false;
        query.outFields = outFields
        query.orderByFields = orderByField;
        queryTask.execute(query, this.createTable(this.loadingPanel, type))
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
        let type = [this.queryType]
        //queryTask.execute(query, this.createTable)
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
