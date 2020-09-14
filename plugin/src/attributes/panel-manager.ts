import { SEARCH_PLAN_TEMPLATE, PROTECTED_AREA_TEMPLATE, COMMUNITY_TEMPLATE, PROVINCE, MENU_BUTTON } from '../templates/template';
import { MakeQuery } from './layer-query';
import * as data from '../resources/admin_area.json'
const ADMIN_DATA = data

const Draggabilly = require('draggabilly');
const PANEL_OPTIONS_CSS = {top: '35%', left: '35%', width:'550px', height: '400px', right: '52px',}
//const SIDEPANEL_OPTIONS_CSS = {top: '10%', left: '20%',  right: '52px', height: '360px',};

export class PanelManager {

    private mapApi: any;
    private configLang: any;
    public customPanel: any;
    private template: any;

    constructor (mapApi: any, configLang: any) {
        this.mapApi = mapApi;
        this.configLang = configLang
        this.createPanel(this.mapApi, this.configLang)
    }

    createPanel(mapApi, configLang) {

        const customPanel = this.mapApi.panels.create('searchPlanPanel');
        customPanel.element.addClass('ag-theme-material mobile-fullscreen tablet-fullscreen');
        customPanel.element.css(PANEL_OPTIONS_CSS);
        customPanel.allowOffscreen = true;
        this.setHeader(customPanel, "searchPlanPanel");

        /*const sidePanel = this.mapApi.panels.create('SidePanel');
        sidePanel.element.css(SIDEPANEL_OPTIONS_CSS);
        sidePanel.allowOffscreen = true;
        sidePanel.header.toggleButton
        const close2 = sidePanel.header.closeButton;*/

        this.customPanel = customPanel


        this.mapApi.agControllerRegister('SelectTabMenu', ['$scope', '$mdSidenav', function($scope, $mdSidenav) {
            $scope.toggleLeft = buildToggler('leftPanel');

            function buildToggler(componentId) {
              return function() {
                $mdSidenav(componentId).toggle();
              }
            }

            $scope.getSearchInfo = function(tabName) {
                
                let tabContent = <HTMLElement>document.getElementById(tabName);
                let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>

                if (tabContentActive.length >0) {
                    tabContentActive[0].style.display = "none";
                    tabContentActive[0].classList.remove("active")
                }

                tabContent.className += ' active';
                tabContent.style.display = "block";
            }
            
        }])

        this.mapApi.agControllerRegister('SearchPanel', ['$scope', function($scope) {
            $scope.searchFunction = function() {

                let inputBox = <HTMLInputElement>document.getElementById("planInput");
                if (inputBox.checkValidity()) {
                    let query = new MakeQuery(mapApi, configLang);
                } else {
                    inputBox.style.borderColor = 'red'
                }
            }

            $scope.resetFunction = function() {

                let inputBox = <HTMLInputElement>document.getElementById("planInput");
                inputBox.value = ''
                inputBox.style.borderColor = ''

                let resultsGrid =  <HTMLElement>document.getElementById("tableLoaderId");

                if (resultsGrid) {
                    resultsGrid.remove()
                }

                if ($scope.user) {
                    $scope.user.province = ''
                    $scope.user.reserve = ''
                }
                $scope.disableSelectProvince = true;

            }

            $scope.provinces = Object.keys(PROVINCE[configLang]).map(function(province) {
                return {canada:province}
            })

            $scope.disableSelectProvince = true;

            $scope.checkProvince = function() {

                if (typeof $scope.user.province=== "string") {
                    
                    let province = PROVINCE[configLang][$scope.user.province]
                    $scope.reserves = ADMIN_DATA[configLang][province].map(function(reserve) {
                        return {canada:reserve}
                    })
                    $scope.disableSelectProvince = false;
                }
            };
        }]);

        this.mapApi.agControllerRegister('ResultsTabsCtrl', ['$scope','$mdSidenav', function($scope, $mdSidenav) {
        
            this.tabs = {
                parcel: {
                    name: 'parcel',
                    title: 'plugins.clssPlugin.tabs.parcelTab'
                },
                survey: {
                    name: 'survey',
                    title: 'plugins.clssPlugin.tabs.surveyTab'
                },
                plan: {
                    name: 'plan',
                    title: 'plugins.clssPlugin.tabs.planTab'
                },
                township: {
                    name: 'township',
                    title: 'plugins.clssPlugin.tabs.townshipTab'
                },
                administrative: {
                    name: 'admin',
                    title: 'plugins.clssPlugin.tabs.adminTab'
                },
                additionnalInfo: {
                    name: 'info',
                    title: 'plugins.clssPlugin.tabs.infoTab'
                }
            };

            this.sideTab = {}


            $scope.openTab = function(tabName) {

                let tabContent = <HTMLElement>document.getElementById(tabName);
                let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>

                if (tabContentActive.length >0) {
                    tabContentActive[0].style.display = "none";
                    tabContentActive[0].classList.remove("active")
                }

                tabContent.className += ' active';
                tabContent.style.display = "block";
            }

            /*$scope.toggleLeft = buildToggler('leftPanel');

            function buildToggler(componentId) {
              return function() {
                $mdSidenav(componentId).toggle();
              }
            }*/

            $scope.getSearchInfo = function(tabName) {
                console.log('a')
                let tabContent = <HTMLElement>document.getElementById(tabName);
                let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>

                if (tabContentActive.length >0) {
                    tabContentActive[0].style.display = "none";
                    tabContentActive[0].classList.remove("active")
                }

                tabContent.className += ' active';
                tabContent.style.display = "block";
            }
        }])

        //let panelTemplate = $(SEARCH_PANEL_TEMPLATE);
        //this.mapApi.$compile(panelTemplate);
        //customPanel.body.empty();
        //customPanel.body.prepend(panelTemplate);
        this.setBody(customPanel)
        

        //let sideTemplate = $(SIDE_NAV_TEMPLATE);
        //this.mapApi.$compile(sideTemplate);
        //sidePanel.body.empty();
        //sidePanel.body.prepend(sideTemplate);
        //sidePanel.open();
    }
 

    setHeader(panel, id) {
        const headerClass =  panel.header._header
        const titleElem = headerClass.find('header').first()
        const titleText = `<h3 class="custom-title" style="display:none;">{{ 'plugins.clssPlugin.buttonName' | translate }}</h3>`

        const panelElem = document.getElementById(id)
        const newID = 'panel-header-custom'
        panelElem.getElementsByClassName('rv-header')[0].setAttribute("id", newID)

        const headerElem =  document.getElementById(newID)
        headerElem.getElementsByClassName("tagline")[0].remove()
        headerElem.getElementsByClassName("md-title")[0].remove()

        const close = panel.header.closeButton;
        close.removeClass('primary');
        close.addClass('black md-ink-ripple');

        panel.element.addClass('draggable');
        const draggable = new Draggabilly(panel.element.get(0), {handle: '.rv-header'});

        this.setAngular(this.mapApi, panel);
        titleElem.append(this.compileTemplate(MENU_BUTTON));
        titleElem.append(this.compileTemplate(titleText));
    }

    setBody(panel) {
        
        panel.body.empty();
        panel.body.prepend(this.compileTemplate(SEARCH_PLAN_TEMPLATE));
  
    }

    compileTemplate(template: string): JQuery<HTMLElement> {
        let temp = $(template);
        this.mapApi.$compile(temp);
        return temp;
    }

    setAngular(mapApi, customPanel) {
        this.mapApi.agControllerRegister('MenuPanel', ['$scope','$mdSidenav', function($scope ,$mdSidenav) {
            
            $scope.openSideMenu = buildToggler('sideMenu');

            function buildToggler(componentId) {
                return function() {
                    $mdSidenav(componentId).toggle();
                }
            }

            $scope.getSearchInfo = function(evt) {

                switch(evt) {
                    case 'protected': {
                        this.template = PROTECTED_AREA_TEMPLATE
                        break;
                    }
                    case 'community':{
                        this.template = COMMUNITY_TEMPLATE;
                        break;
                    }
                    case 'plan':{
                        this.template = SEARCH_PLAN_TEMPLATE;
                        break;
                    }
                }

                customPanel.body.empty()

                let temp = $(this.template);
                mapApi.$compile(temp);
                customPanel.body.prepend(temp)
                console.log('test')
            }
        }])
        
    }

    showPanel() {
        this.customPanel.open()
    }

    closePanel() {
        this.customPanel.close()
    }
}
