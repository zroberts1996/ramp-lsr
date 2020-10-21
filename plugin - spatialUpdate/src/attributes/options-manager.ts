import { SEARCH_TEMPLATE, PROVINCE, TYPE } from '../templates/template';
import { PROVINCE_NAME, SEARCH_OPTIONS } from '../templates/constants';
import { TableLoader } from './table-loader';
import { MakeQuery } from './layer-query';
import * as adminData from '../resources/admin_area.json'
import { queue } from 'rxjs/internal/scheduler/queue';
//import Provinces from './provinces';

const ADMIN = adminData
const Draggabilly = require('draggabilly');
const PANEL_OPTIONS_CSS = {top: '50px', width:'400px', height: '150px'}

let lastQuery: string;


export class OptionsManager {
    docFrag: DocumentFragment;
    resultContainer: HTMLElement;
    featureContainer: HTMLElement;

    private _mapApi: any;
    private _language: any;
    private panel: any;

    private uiManager;
    private isPanelActive: boolean;
    private baseURL: string = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
    private queryResults;
    private mainType: any;


    constructor (mapApi: any, language: any) {
        this._mapApi = mapApi;
        this._language = language
    }

    get panelState(): boolean {
        return this.isPanelActive;
    }

    set panetState(state: boolean) {
        this.isPanelActive = state;
    }

    addButton() {

        let appBar = document.getElementsByClassName("main-appbar")[0];
        let element = `
        <div class="rv-clss-top-filters" ng-controller="barPanel as ctrl" id="clssOptionsPlugin">
            <span class="rv-button-divider ng-scope"></span>
            <button type="button" aria-label="CLSS Search" ng-click="ctrl.openOptions()" id = "clssButton">
                <md-tooltip md-direction="bottom">Open</md-tooltip>
                CLSS
            </button>
        </div>`;

        let clssDiv = document.getElementById("clssOptionsPlugin");
        if (clssDiv) {
            clssDiv.hidden=false;
        } else {
            this.setButtonController();
            appBar.append(this.compileTemplate(element)[0]);
        }
    }

    removeButton() {
        let clssDiv = document.getElementById("clssOptionsPlugin");
        clssDiv.hidden = true;
    }

    ui(input) {
        input = document.createElement('input');
        input.onkeyup = this.inputChanged.bind(this);

        this.docFrag = document.createDocumentFragment();
        this.resultContainer = document.createElement('div');
        this.resultContainer.classList.add('geosearch-ui');
        this.featureContainer.classList.add('geosearch-ui');
        return this;
    }

    inputChanged(evt: KeyboardEvent) {
        const qValue = (<HTMLInputElement>evt.target).value;

        if (qValue.length > 2 && qValue !== lastQuery) {
            lastQuery = qValue;

            while (this.resultContainer.firstChild) {
                this.resultContainer.removeChild(this.resultContainer.firstChild);
            }

            while (this.featureContainer.firstChild) {
                this.featureContainer.removeChild(this.featureContainer.firstChild);
            }

            //this.query(qValue)
        }
    }
    query(value) {

        let type = "plan";
        let layer = 0;
        let outFields = ["PLANNO", "P2_DESCRIPTION", "GlobalID", "PROVINCE", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO"];
        let orderByField= ['planno'];
        let whereClause= "planno like '%" + value.toUpperCase().replace("'", "''") + "%'";

        let queryResults=[];

        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let curProv = 'CA';
        let queryURL = this.baseURL + "WMB_Query_" + curProv + "/MapServer/" + layer;
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL)

        query.where = whereClause;
        query.returnGeometry = false;
        query.outFields = outFields
        query.orderByFields = orderByField;
        queryTask.execute(query, this.getResults)

    }
    getResults(q) {
        if (q.features) {
            let a=1
            
            //this.featureContainer.appendChild(this.featureHandler(q.featureResults));
        }
        let b=2
        //this.resultContainer.appendChild(this.resultHandler(q.results));
    }
  

    createPanel() {
        let language = this._language;
        let mapApi = this._mapApi;

        this.panel = this._mapApi.panels.create('optionsPanel');
        //this.panel.element.addClass('ag-theme-material mobile-fullscreen tablet-fullscreen');
        //this.panel.element.addClass('mobile-fullscreen-new');

        this.panel.element.css(PANEL_OPTIONS_CSS);
        this.panel.allowOffscreen = true;
        
        this.panel._body[0].className = "options-body";
        this.panel._body[0].style.padding = '0px';
        this.setPanelController();
        this.panel.body.empty();
        this.panel.body.prepend(this.compileTemplate(SEARCH_TEMPLATE));

        const searchBar = document.getElementById('inputClss');
        searchBar.onkeyup = this.inputChanged.bind(this);
        /*searchBar.addEventListener("keyup", function(event) {
            if (event.key === 'Enter') {
                let input = searchBar.innerText;
                let province = document.getElementById('selectProvince').innerText;
                let type = document.getElementById('selectType').innerText;
                let reserve = document.getElementById('selectReserve').innerText;
                let info = {input: input, type: type, province:province, reserve:reserve}
                new MakeQuery(mapApi, language, info)
            }
        });*/

        this.docFrag = document.createDocumentFragment();
        this.featureContainer = document.createElement('div');
        this.docFrag.appendChild(this.featureContainer);

        this.resultContainer = document.createElement('div');
        this.docFrag.appendChild(this.resultContainer);

        this.resultContainer.classList.add('geosearch-ui');
        this.featureContainer.classList.add('geosearch-ui');

        return this.panel;
    }

    removePanel() {
        this.panel.destroy();
    }

    setButtonController() {
        let panel = this.panel;
        this._mapApi.agControllerRegister('barPanel',  ['$scope', function($scope) {
            this.openOptions = function() {
                if (panel.isOpen) {
                    panel.close();
                }
                else {
                    panel.open()
                }
            }
        }])
    }

    setPanelController() {
        let language = this._language;
        let mapApi = this._mapApi;        

        this._mapApi.agControllerRegister('SearchPanel',  ['$scope', function($scope) {
            this.provinces = Object.keys(PROVINCE_NAME[language]);

            this.options = SEARCH_OPTIONS[language];

            this.isDisabled = true;

            this.updateReserveBox = function(province) {

                this.isDisabled = false;

                if (province == this.selectedProvince) {
                    console.log('Same province clicked')
                } 
                else {
                    this.selectedProvince = province;
                    this.abbrevProvince = PROVINCE_NAME[language][province];
                    
                    let reserveBox = <HTMLElement>document.getElementById("selectReserve");
                    
                    if (reserveBox) {
                        this.reserves = ADMIN[language][this.abbrevProvince];
                    }
                }
            }

            this.setSelectedReserve = function(reserve) {
                this.selectedReserve = reserve;
            }

            this.resetFunction = function() {
                if ($scope.user) {
                    $scope.user = {};
                    this.isDisabled = true; 
                }

                let resultsGrid =  <HTMLElement>document.getElementById("resultsPanel");
                if (resultsGrid) {
                    resultsGrid.remove();
                }
            }
            this.setMainType = function(main) {
                this.mainType = main;
            }

            this.setSearchType = function(search) {
                $scope.user.type = search;
            }

            this.launchSearchAction = function(searchType:string) {
                if ($scope.user.type) {
                    if (Object.keys($scope.user).length!=0) {
                        $scope.user.main = "";
                        this.user = $scope.user;
                        $scope.user.type = searchType;
                        $scope.user.main = this.mainType;

                        
                        this.loadingPanel = new TableLoader(mapApi, 'Test');
                        this.loadingPanel.prepareHeader(mapApi);
                        this.loadingPanel.prepareBody();

                        if ($scope.user.type == 'plan') {
                            $scope.user.other = 'parcel';
                            const queryPlan = new MakeQuery(mapApi, language, $scope.user, this.loadingPanel);
                        }
                        else {
                            $scope.user.other = '';
                            const query = new MakeQuery(mapApi, language, $scope.user, this.loadingPanel);
                        }
                    }
                }
            }
        }])

    }

    compileTemplate(template: string): JQuery<HTMLElement> {
        let temp = $(template);
        this._mapApi.$compile(temp);
        return temp;
    }

}