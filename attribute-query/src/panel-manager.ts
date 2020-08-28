import { SEARCH_PANEL_TEMPLATE, TAB_TEMPLATE, PROVINCE, SIDE_NAV_TEMPLATE, PLAN_SEARCH } from './template';
import { MakeQuery } from './layer-query';

const Draggabilly = require('draggabilly');
const PANEL_OPTIONS_CSS = {top: '50%', left: '20%', right: '52px',}
const SIDEPANEL_OPTIONS_CSS = {top: '10%', left: '20%',  right: '52px', height: '360px',};

export class PlanPanel {

    private mapApi: any;
    private configLang: any;
    public planPanel: any;
    
    constructor (mapApi: any, configLang: any) {
        this.mapApi = mapApi;
        this.configLang = configLang
        this.createPanel(this.mapApi, this.configLang)
    }

    createPanel(mapApi, configLang) {

        const planPanel = this.mapApi.panels.create('searchPlanPanel');
        planPanel.header.title = this.mapApi.getTranslatedText('plugins.searchPlugin.pluginName');
        planPanel.element.addClass('ag-theme-material mobile-fullscreen tablet-fullscreen rv-plan-dialog-hidden');
        planPanel.element.css(PANEL_OPTIONS_CSS);
        planPanel.allowOffscreen = true;

        const sidePanel = this.mapApi.panels.create('SidePanel');
        sidePanel.element.css(SIDEPANEL_OPTIONS_CSS);
        sidePanel.allowOffscreen = true;
        sidePanel.header.toggleButton
        const close2 = sidePanel.header.closeButton;

        //Close button
        const close = planPanel.header.closeButton;
        close.removeClass('primary');
        close.addClass('black md-ink-ripple');

        // Make panel draggable
        planPanel.element.addClass('draggable');
        const draggable = new Draggabilly(planPanel.element.get(0), {handle: '.rv-header'});

        this.planPanel = planPanel

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
            }

            $scope.provinces = Object.keys(PROVINCE[configLang]).map(function(province) {
                return {canada:province}
            })

        }]);

        this.mapApi.agControllerRegister('ResultsTabsCtrl', ['$scope','$mdSidenav', function($scope, $mdSidenav) {
        
            this.tabs = {
                parcel: {
                    name: 'parcel',
                    title: 'plugins.searchPlugin.tabs.parcelTab'
                },
                survey: {
                    name: 'survey',
                    title: 'plugins.searchPlugin.tabs.surveyTab'
                },
                plan: {
                    name: 'plan',
                    title: 'plugins.searchPlugin.tabs.planTab'
                },
                township: {
                    name: 'township',
                    title: 'plugins.searchPlugin.tabs.townshipTab'
                },
                administrative: {
                    name: 'admin',
                    title: 'plugins.searchPlugin.tabs.adminTab'
                },
                additionnalInfo: {
                    name: 'info',
                    title: 'plugins.searchPlugin.tabs.infoTab'
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

            $scope.toggleLeft = buildToggler('leftPanel');

            function buildToggler(componentId) {
              return function() {
                $mdSidenav(componentId).toggle();
              }
            }

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

        let panelTemplate = $(SEARCH_PANEL_TEMPLATE);
        this.mapApi.$compile(panelTemplate);
        planPanel.body.empty();
        planPanel.body.prepend(panelTemplate);

        let sideTemplate = $(SIDE_NAV_TEMPLATE);
        this.mapApi.$compile(sideTemplate);
        sidePanel.body.empty();
        sidePanel.body.prepend(sideTemplate);
        sidePanel.open();
    }

    showPanel() {
        this.planPanel.open()
    }

    closePanel() {
        this.planPanel.close()
    }
}
