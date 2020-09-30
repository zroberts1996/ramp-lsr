import { PROVINCE } from '../templates/template';
import * as data from '../resources/admin_area.json'
const DATA = data


export class MakeQuery2 {
    private _mapApi: any;
    private _language: any;
    private query: any;
    private curProv: any;
    private queryURL: any;
    private queryTask: any;
    private whereclause: any;
    private loadingPanel: any;
    private _province: string ;
    private _reserve_name: any;

    constructor(mapApi, configLang, province) {
        this._mapApi = mapApi;
        this._province = province
        this._language = configLang;
        //this._configLang = configLang;
        this.getReservesQuery()
    }

    getReservesQuery() {
        /*
        const queryURL= "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/WMB_Query_CA/MapServer/3/query";
        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL)
        let province = PROVINCE['en-CA'][this._province]
        this.whereclause = "PROVINCE like '%" + province + "%'"
        query.where = this.whereclause;
        query.returnGeometry = false;
        query.outFields = (this._language === 'en-CA') ?  ["ENGLISHNAME"]:["FRENCHNAME"];
        queryTask.execute(query, this.getResults)
        */

        let province = PROVINCE['en-CA'][this._province]
        console.log(DATA[this._language][province])

        this._mapApi.agControllerRegister('SearchPanel', ['$scope', function($scope) {
            
            $scope.reserves = DATA[this._language][province].map(function(reserve) {
                return {canada:reserve}
            })
        }])
        
    }


    getResults(result) {
        let reserve_name = []
        let features = result.features;
        let outField = Object.keys(features[0].attributes)[0];

        features.map(function(element) {
            reserve_name.push(element.attributes[outField]);
        })
    }
}