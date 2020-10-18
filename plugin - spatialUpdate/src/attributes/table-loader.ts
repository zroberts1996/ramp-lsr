import { TABLE_LOADING_TEMPLATE2 } from './table-template';
import { GRID_TEMPLATE, MENU_BUTTON_RESULT } from '../templates/template';
import { Grid } from 'ag-grid-community';
import { PanelStateManager } from './panel-state-manager'
import { ZoomToElement } from './button-test'
import { ZoomNoProv } from './zoom-no-prov'

const Draggabilly = require('draggabilly');

export class TableLoader {
    private panelId: string;

    constructor(mapApi: any, legendBlock) {
        this.mapApi = mapApi;
        this.legendBlock = legendBlock;   
        this.resetPanel();
        this.createPanel('resultsPanel');
    }

    set panelStateManager(newPanelStateManager: PanelStateManager) {
        this._panelStateManager = newPanelStateManager;
    }

    get panelStateManager() {
        return this._panelStateManager;
    }

    onHideResultPanel(e) {
        const { panel, code } = e;
        panel.element.addClass('hidden');
        panel.destroy();
    }

    createPanel(panelID) {
        this.panelId = panelID;
        this.panel = this.mapApi.panels.create(panelID);
        this.panel.element.css({top: '55%', left: '410px', bottom: '0', right: '45px',});  // left: '410px', bottom: '32px
        this.panel.element.addClass('ag-theme-material mobile-fullscreen tablet-fullscreen');
        this.panel.allowUnderlay = true;
        this.panel.allowOffscreen = true;

        this.panel.closing.subscribe(this.onHideResultPanel.bind(this));

        this.open()
    }

    setSize(maximized) {
        if (maximized) {
            this.panel.element.css({ bottom: '0' });;
        } else {
            this.panel.element.css({ bottom: '50%' });;
        }
    }

    prepareHeader(mapApi) {
        const headerClass =  this.panel.header._header;
        const titleElem = headerClass.find('header').first();
        const panelElem = document.getElementById(this.panelId);
        const newID = 'grid-header-custom';
        panelElem.getElementsByClassName('rv-header')[0].setAttribute("id", newID);

        const headerElem = document.getElementById(newID);
        headerElem.getElementsByClassName("tagline")[0].remove();
        headerElem.getElementsByClassName("md-title")[0].remove();

        /*this.mapApi.agControllerRegister('MenuPanel2', ['$scope','$mdSidenav', function($scope ,$mdSidenav) {
            
            $scope.openSideMenu = buildToggler('sideMenu');

            function buildToggler(componentId) {
                return function() {
                    $mdSidenav(componentId).toggle();
                }
            }
        }])*/
        //titleElem.append(this.compileTemplate(MENU_BUTTON_RESULT));

        this.mapApi.agControllerRegister('TabController', ['$scope', function($scope) {
            
            $scope.openSelectedTab = function(tabName) {

                let tabContent = <HTMLElement>document.getElementById(tabName);
                let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>
                tabContent.classList.remove("hidden");

                if (tabContentActive.length >0) {
                    tabContentActive[0].style.display = "none";
                    tabContentActive[0].classList.remove("active")
                }

                tabContent.className += ' active';
                tabContent.style.display = "block";
            }
        }])

        const test1 = `<md-button id='parcelTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('parcel')"; name="test1" style="">Parcel</md-button>`
        const test2 = `<md-button id='surveyTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('survey')"; name="test2" style="">Survey Project</md-button>`
        const test3 = `<md-button id='planTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('plan')";name="test3" style="">Survey Plan</md-button>`;
        const test4 = `<md-button id='townTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('town')";name="test4" style="">Township</md-button>`;
        const test5 = `<md-button id='adminTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('admin')";name="test5" style="padding:0px 6px 0px 20px; margin:0px;">Administrative</md-button>`;
        //const test6 = `<md-button ng-controller="TabController as ctrl"; ng-click="openSelectedTab('projectGrid')";name="test6" style="">Info</md-button>`;

        titleElem.append(this.compileTemplate(test1));
        titleElem.append(this.compileTemplate(test2));
        titleElem.append(this.compileTemplate(test3));
        titleElem.append(this.compileTemplate(test4));
        titleElem.append(this.compileTemplate(test5));

        this.panel.element.addClass('draggable');
        const draggable = new Draggabilly(this.panel.element.get(0), {handle: '.rv-header'});
        
        const close = this.panel.header.closeButton;
        close.removeClass('primary');
        close.addClass('black md-ink-ripple');
    }

    open() {
        this.panel.open();
        this.hidden = false;
    }

    resetPanel() {
        let panelID = 'resultsPanel';
        let resultsGrid = <HTMLElement>document.getElementById(panelID);

        if (resultsGrid) {
            resultsGrid.remove()
        }
    }; 

    changeBody() {
        this.panel.body = this.compileTemplate(GRID_TEMPLATE)
    }

    prepareBody() {
        let template = TABLE_LOADING_TEMPLATE2(this.legendBlock);
        this.panel.body = template;
    }

    setSpatialGrid(results) {
        let mapApi = this.mapApi;
        let tabElement = document.getElementById('parcelTab')
        
        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }

        let isValidDiv = this.validateDiv("parcel");
        
        if (!isValidDiv) {
            this.changeBody();
        }

        let gridOptions = {
            columnDefs: [
                {headerName: 'Designator', field:'parcelDesignator', headerTooltip: 'Parcel Designator', cellRenderer: function(cell){return cell.value}},
                {headerName: 'Plan Number', field:'planNumber', headerTooltip: 'Plan Number'},
                {headerName: 'Detail', field:'planDetail', headerTooltip: 'Plan Detail'},
                {headerName: 'Remainder', field:'remainder', headerTooltip: 'Remainder'},
                {headerName: 'Type', field:'parceltype', headerTooltip: 'Parcel Type'},
            ],

            rowData: [],

            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            },

            rowStyle: {
                background: 'white'
            },

            //pagination: true,
            enableColResize: true,
            enableSorting: true,
        };
        
        results.forEach(function(result) {
            gridOptions.rowData.push({
                parcelDesignator: result.attributes['PARCELDESIGNATOR'], 
                planNumber: result.attributes['PLANNO'],
                parceltype: result.attributes['PARCELFC_ENG'],
                planDetail: 'View',
                remainder: result.attributes['REMAINDERIND_ENG'],
                globalid: result.attributes['GlobalID'],
                province: result.attributes['PROVINCE'],
                globalidPLA: result.attributes['GlobalID_PLA'],

           })
        })

        gridOptions.columnDefs[2].cellRenderer = function(params) {
            let eDiv = document.createElement('div');
            eDiv.innerHTML= '<span class="my-css-class"><a href="' + 'https://clss.nrcan-rncan.gc.ca/plan-fra.php?id=' + params.data.planNumber.replace(/\s/g, '%20') + '"target=_blank>' + params.value + '</a></span>';
            return eDiv
        }

        gridOptions.columnDefs[0].cellRenderer = function(params) {
            
            var eDiv = document.createElement('div');
            
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);};
            };
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            
            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            
            return eDiv;
        }

        gridOptions.columnDefs[1].cellRenderer = function(params) {
            
            var eDiv = document.createElement('div');
            
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalidPLA, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);};
            };
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalidPLA, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            
            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            
            return eDiv;
        }

        const GRID = new Grid(this.getGridDiv('parcel'), gridOptions);
    }

    validateDiv(gridID) {
        let div = <HTMLElement>document.querySelector('#' + gridID);

        if (div == null) {
            return false;
        }
        else {
            return true;
        }
    }

    getGridDiv(gridID) {
        return <HTMLElement>document.querySelector('#' + gridID);
    }
    
    setSpatialGridSIP(results) {
        let mapApi = this.mapApi;
        let tabElement = document.getElementById('surveyTab')
        
        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }

        let isValidDiv = this.validateDiv("survey");
        
        if (!isValidDiv) {
            this.changeBody();
        }

        let gridOptions = {
            columnDefs: [
                {headerName: 'Project Number', field:'projectNumber', headerTooltip: 'Project Number', cellRenderer: function(cell){return cell.value}},
                {headerName: 'Description', field:'description', headerTooltip: 'Description'},
                {headerName: 'Detail', field:'detail', headerTooltip: 'Project Detail'},
            ],

            rowData: [],

            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            },

            rowStyle: {
                background: 'white'
            },

            enableColResize: true,

            enableSorting: true,
        };
        
        results.forEach(function(result) {
            gridOptions.rowData.push({
                projectNumber: result.attributes['PROJECTNUMBER'], 
                description: result.attributes['DESCRIPTION'],
                globalid: result.attributes['GlobalID'],
                urlUse: result.attributes['URL'],
                detail: "View",
                province: result.attributes['PROVINCE'],
           })
        })

        gridOptions.columnDefs[0].cellRenderer = function(params) {
            
            var eDiv = document.createElement('div');
            
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);};
            };
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            
            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            
            return eDiv;
        }
        gridOptions.columnDefs[2].cellRenderer = function(params) {
            let eDiv = document.createElement('div');
            eDiv.innerHTML= '<span class="my-css-class"><a href="' + 'https://clss.nrcan-rncan.gc.ca/project-projet/detail?id=' + params.data.urlUse + '"target=_blank>' + params.value + '</a></span>';
            return eDiv
        }

        const GRID = new Grid(this.getGridDiv("survey"), gridOptions);
    }
    
    setSpatialGridPlan(results) {
        let mapApi = this.mapApi;
        
        let tabElement = document.getElementById('planTab')
        
        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }
                
        let gridOptions = {
            columnDefs: [
                {
                    headerName: 'Plan Number', 
                    field:'planNumber',
                    headerTooltip: 'Plan Number', 
                    cellEditor: 'agRichSelectCellEditor',
                    unSortIcon: true,
                    width: 160,
                    cellRenderer: function (cell) {
                        return cell.value
                    },
                },
                {headerName: 'Description', field:'description', headerTooltip: 'Description', width: 300, },
                {headerName: 'Date', field:'dateSurvey', headerTooltip: 'Date of Survey',  width: 150},
                {headerName: 'Detail', field:'planDetail', headerTooltip: 'Detail', width: 100},
                {headerName: 'LTO', field:'lto', headerTooltip: 'List of survey document (plan) results from the attributes and map searches'},
            ],
        
            rowSelection: 'multiple',
        
            rowData:[],
        
            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
                //params.api.refreshCells(params);    
            },
        
            rowStyle: {
                background: 'white'
            },
        
            //pagination: true,
                    
            enableColResize: true,
            enableSorting: true,
        }
        
        results.forEach(function(result) {
            let date = result.attributes['P3_DATESURVEYED'];
            let newDate = date.substr(0,4) + '-' + date.substr(4,2) + '-' + date.substr(6,2);
        
            gridOptions.rowData.push({
                planNumber: result.attributes['PLANNO'],
                description: result.attributes['P2_DESCRIPTION'],
                dateSurvey: newDate,
                planDetail: 'View',
                lto: result.attributes['ALTERNATEPLANNO'],
                globalid: result.attributes['GlobalID'],
                province:result.attributes['PROVINCE']
            })
        })
        
        gridOptions.columnDefs[0].cellRenderer = function(params) {
            var eDiv = document.createElement('div');
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);
                };
            };
                    
            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';

            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }
        
        gridOptions.columnDefs[3].cellRenderer = function(params) {
            let eDiv = document.createElement('div');
            eDiv.innerHTML= '<span class="my-css-class"><a href="' + 'https://clss.nrcan-rncan.gc.ca/plan-fra.php?id=' + params.data.planNumber.replace(/\s/g, '%20') + '"target=_blank>' + params.value + '</a></span>';
            return eDiv
        }

        let isValidDiv = this.validateDiv("plan");
        
        if (!isValidDiv) {
            this.changeBody();
        }

        const GRID = new Grid(this.getGridDiv('plan'), gridOptions);
    }

    setSpatialGridTown(results) {
        let mapApi = this.mapApi;

        let tabElement = document.getElementById('townTab')

        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }

        let isValidDiv = this.validateDiv("town");
        
        if (!isValidDiv) {
            this.changeBody();
        }

        let gridOptions = {
            columnDefs: [
                {headerName: 'Section', field:'townshipSection', headerTooltip: 'Section', cellRenderer: function(cell){return cell.value}},
                {headerName: 'Township', field:'township', headerTooltip: 'Township'},
                //{headerName: 'TP', field:'tP', headerTooltip: 'TP'},
                {headerName: 'Range', field:'range', headerTooltip: 'Range'},
                //{headerName: 'Direction', field:'direction', headerTooltip: 'Direction'},
                {headerName: 'Meridian', field:'meridian', headerTooltip: 'Meridian'},
                //{headerName: 'Global ID', field:'globalID', headerTooltip: 'Global ID'},
                //{headerName: 'Province', field:'province', headerTooltip: 'Province'},
            ],

            rowData: [],

            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            },

            rowStyle: {
                background: 'white'
            },

            //pagination: true,
            enableColResize: true,
            enableSorting: true,
        };

        results.forEach(function(result) {
            gridOptions.rowData.push({
                townshipSection: result.attributes['TOWNSHIPSECTION'], 
                //tP: result.attributes['TP'],
                township: result.attributes['TP'],
                range: result.attributes['RANGE'],
                //direction: result.attributes['DIRECTION'],
                meridian: result.attributes['DIRECTION']+ result.attributes['MERIDIAN'],
                globalid: result.attributes['GlobalID'],
                province: result.attributes['PROVINCE'],

           })
        })

        gridOptions.columnDefs[0].cellRenderer = function(params) {
            var eDiv = document.createElement('div');
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);
                };
            };

            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }

        gridOptions.columnDefs[1].cellRenderer = function(params) {
            var eDiv = document.createElement('div');
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);
                };
            };

            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }

        gridOptions.columnDefs[2].cellRenderer = function(params) {
            var eDiv = document.createElement('div');
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);
                };
            };

            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }

        gridOptions.columnDefs[3].cellRenderer = function(params) {
            
            var eDiv = document.createElement('div');
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);
                };
            };

            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }
        
        const GRID = new Grid(this.getGridDiv('town'), gridOptions);
    }
        
    setSpatialGridAdminArea(results) {
        let mapApi = this.mapApi;
        let tabElement = document.getElementById('adminTab')
        
        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }

        let isValidDiv = this.validateDiv("admin");
        
        if (!isValidDiv) {
            this.changeBody();
        }

        let gridOptions = {
            columnDefs: [
                {headerName: 'Name', field:'name', headerTooltip: 'name', cellRenderer: function(cell){return cell.value}},
                {headerName: 'Description', field:'description', headerTooltip: 'Description'},
                {headerName: 'Province', field:'province', headerTooltip: 'Province'},
                //{headerName: 'Global ID', field:'globalID', headerTooltip: 'Global ID'},
            ],
        
            rowData: [],
        
            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            },
        
            rowStyle: {
                background: 'white'
            },
        
            //pagination: true,
            enableColResize: true,
            enableSorting: true,
        };
        results.forEach(function(result) {
            gridOptions.rowData.push({
                name: result.attributes['ENGLISHNAME'], 
                province: result.attributes['PROVINCE'].substr(0,2),
                globalid: result.attributes['GlobalID'],
                description: result.attributes['ADMINAREAID'],
            })
        })
        
        gridOptions.columnDefs[0].cellRenderer = function(params) {
            var eDiv = document.createElement('div');
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);
                };
            };
        
            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }
    
        const GRID = new Grid(this.getGridDiv('admin'), gridOptions);
    }

    setFieldInfo(value) {

        let fieldInfo = {
            additionalinfo: {headerName: "Additional Info", field: "additionalinfo", headerToolTip: "Additional Info"},
            dateofsurvey: {headerName: "Date", field: "dateSurvey", headerToolTip: "Date of Survey", width:117},
            description: {headerName: "Description", field: "description", headerToolTip: "Description", width:151},
            lto: {headerName: "LTO", field: "lto", headerToolTip: "LTO"},
            meridian: {headerName: "Meridian", field: "meridian", headerToolTip: "Meridian"},
            name: {headerName: "Name", field: "name", headerToolTip: "Name", width:316},
            parceldesignator: { headerName: "Designator", field: "parceldesignator", headerToolTip: "Parcel Designator"},
            parceltype: {headerName: "Type", field: "parceltype", headerToolTip: "Parcel Type"},
            plandetail: { headerName: "Detail", field: "planDetail", headerToolTip: "Plan Detail", width:100},
            plannumber: {headerName: "Plan Number", field: "planNumber", headerToolTip: "Plan Number", width:155}, //cellRenderer: function (cell) {return cell.value}
            projectdetail: {headerName: "Detail", field: "projectdetail", headerToolTip: "Project Detail", width:100},
            projectnumber: {headerName: "Project Number", field: "projectnumber", headerToolTip: "Project Number", width:158},
            province: {headerName: "Province", field: "province", headerToolTip: "Province"},
            range: { headerName: "Range", field: "range", headerToolTip: "Range"},
            remainder: { headerName: "Remainder", field: "remainder", headerToolTip: "Remainder", width:138},
            section: { headerName: "Section", field: "section", headerToolTip: "Section"},
            township: { headerName: "Township", field: "township", headerToolTip: "Township"}
        };

        let columnDefs =[];
        switch(value) {
            case 'parcel':
                columnDefs.push(fieldInfo['parceldesignator']);
                columnDefs.push(fieldInfo['plannumber']);
                columnDefs.push(fieldInfo['plandetail']);
                columnDefs.push(fieldInfo['remainder']);
                columnDefs.push(fieldInfo['parceltype']);
                break;
            case 'survey':
                columnDefs.push(fieldInfo['projectnumber']);
                columnDefs.push(fieldInfo['description']);
                columnDefs.push(fieldInfo['projectdetail']);
                break;
            case 'plan':
                columnDefs.push(fieldInfo['plannumber']);
                columnDefs.push(fieldInfo['description']);
                columnDefs.push(fieldInfo['dateofsurvey']);
                columnDefs.push(fieldInfo['plandetail']);
                columnDefs.push(fieldInfo['lto']);
                break;
            case 'town': 
                columnDefs.push(fieldInfo['section']);
                columnDefs.push(fieldInfo['township']);
                columnDefs.push(fieldInfo['ranger']);
                columnDefs.push(fieldInfo['meridian']);
                break;
            case 'admin':
                columnDefs.push(fieldInfo['name']);
                columnDefs.push(fieldInfo["description"]);
                columnDefs.push(fieldInfo["province"]);
                break;
            case 'info':
                columnDefs.push(fieldInfo['additionalinfo']);
                break;
        }
        return columnDefs;
    }

    setResultsGrid(results, mapApi, type) {

        let fieldInfo = this.setFieldInfo(type[0]);

        let tabElement = document.getElementById(type[0] + 'Tab')
        
        if (results.length >= 1000) {
            tabElement.innerHTML += ' (1000+) '
        } else {
            tabElement.innerHTML += ' (' + results.length + ')';
        }
        //let gridDiv = <HTMLElement>document.querySelector('#' + type[0])

        let isValidDiv = this.validateDiv(type[0]);
        
        if (!isValidDiv) {
            this.changeBody();
        }
        
        let gridOptions = {
            columnDefs: [],
            rowData:[],
            //onGridReady: function(params) {
            //    params.api.sizeColumnsToFit();
            //},
            rowStyle: {
                background: 'white'
            },
            //pagination: true,
            enableColResize: true,
            enableSorting: true,
        }

        fieldInfo.forEach(function (elem) {
            if (elem.cellRenderer) {

                gridOptions.columnDefs.push({
                    headerName: elem.headerName,
                    field: elem.field,
                    headerTooltip:elem.headerToolTip,
                    cellRenderer: elem.cellRenderer,
                    width: elem.width,
                });
            } else {
                gridOptions.columnDefs.push({
                    headerName: elem.headerName,
                    field: elem.field,
                    headerTooltip:elem.headerToolTip,
                    width: elem.width,
                });
            }
        })

        if (type == 'admin') {
            results.forEach(function(result) {

                gridOptions.rowData.push({
                    name: result.attributes['ENGLISHNAME'],
                    description: result.attributes['ADMINAREAID'],
                    globalid: result.attributes['GlobalID'],
                    province: result.attributes['PROVINCE'].substr(0,2)
                })
            })
        }
        else if (type=='plan') {

            results.forEach(function(result) {
                let date = result.attributes['P3_DATESURVEYED'];
                let newDate = date.substr(0,4) + '-' + date.substr(4,2) + '-' + date.substr(6,2);

                gridOptions.rowData.push({
                    planNumber: result.attributes['PLANNO'],
                    description: result.attributes['P2_DESCRIPTION'],
                    dateSurvey: newDate,
                    planDetail: 'View',
                    lto: result.attributes['ALTERNATEPLANNO'],
                    globalid: result.attributes['GlobalID'],
                    province:result.attributes['PROVINCE']
                })
            })
            gridOptions.columnDefs[3].cellRenderer = function(params) {
                let eDiv = document.createElement('div');
                //let eDiv1 = document.createElement('button');
                //eDiv1.innerHTML = '<md-icon class="ng-scope material-icons" role="img" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false"><g id="drawiconhelp" ng-init="control.createIcon()"><path id="pathhelp" d="M19 5v14H5V5h14m1.1-2H3.9c-.5 0-.9.4-.9.9v16.2c0 .4.4.9.9.9h16.2c.4 0 .9-.5.9-.9V3.9c0-.5-.5-.9-.9-.9zM11 7h6v2h-6V7zm0 4h6v2h-6v-2zm0 4h6v2h-6zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7z"></path></g></svg></md-icon>';
                //<button style="margin-bottom: 20px" class="md-icon-button black md-button ng-scope md-ink-ripple" type="button" aria-label="CLSS Search" ng-click="ctrl.launchSearchAction(user.type)">
                //    <md-tooltip md-direction="bottom">Find</md-tooltip>
                //    <md-icon md-svg-src="action:search" class="ng-scope" role="img" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false"><g id="search"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></g></svg></md-icon>
                //</button>
                
                eDiv.innerHTML= '<span class="my-css-class"><a href="' + 'https://clss.nrcan-rncan.gc.ca/plan-fra.php?id=' + params.data.planNumber.replace(/\s/g, '%20') + '"target=_blank>' + params.value + '</a></span>';
                return eDiv;
            }
        }
        else if (type=='survey') {

            results.forEach(function(result) {
                gridOptions.rowData.push({
                    projectnumber: result.attributes['PROJECTNUMBER'],
                    description: result.attributes['DESCRIPTION'],
                    projectdetail: 'View',
                    globalid: result.attributes['GlobalID'],
                    province:result.attributes['PROVINCE']
                })
            })
            gridOptions.columnDefs[2].cellRenderer = function(params) {
                let eDiv = document.createElement('div');
                eDiv.innerHTML= '<span class="my-css-class"><a href="' + 'https://clss.nrcan-rncan.gc.ca/plan-fra.php?id=' + params.data.projectnumber.replace(/\s/g, '%20') + '"target=_blank>' + params.value + '</a></span>';
                return eDiv
            }
        }
        else if (type=='parcel') {

            results.forEach(function(result) {
                gridOptions.rowData.push({
                    parceldesignator: result.attributes['PARCELDESIGNATOR'], 
                    planNumber: result.attributes['PLANNO'],
                    parceltype: result.attributes['PARCELFC_ENG'],
                    planDetail: "View",
                    remainder: result.attributes['REMAINDERIND_ENG'],
                    globalid: result.attributes['GlobalID_PAR'],
                    globalid_PLA: result.attributes['GlobalID_PLA'],
                    province: result.attributes['PROVINCE'],
                })
            })
            gridOptions.columnDefs[1].cellRenderer = function(params) {
                var eDiv = document.createElement('div');
                eDiv.onmouseover=function() {
                    let delay = setTimeout(function() {
                        new ZoomToElement(mapApi, params.data.globalid_PLA, params.data.province, 'mouseover');
                    }, 500);
                    eDiv.onmouseout = function() {clearTimeout(delay);
                    };
                };
                
                eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
    
                eDiv.addEventListener('click', function() {
                    new ZoomToElement(mapApi, params.data.globalid_PLA, params.data.province, 'click')
                });
                eDiv.addEventListener('mouseout', function() {
                    mapApi.esriMap.graphics.clear();
                });
                return eDiv;
            }
            gridOptions.columnDefs[2].cellRenderer = function(params) {
                let eDiv = document.createElement('div');
                eDiv.innerHTML= '<span class="my-css-class"><a href="' + 'https://clss.nrcan-rncan.gc.ca/plan-fra.php?id=' + params.data.planNumber.replace(/\s/g, '%20') + '"target=_blank>' + params.value + '</a></span>';
                return eDiv
            }
        }

        gridOptions.columnDefs[0].cellRenderer = function(params) {
            var eDiv = document.createElement('div');
            eDiv.onmouseover=function() {
                let delay = setTimeout(function() {
                    new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                }, 500);
                eDiv.onmouseout = function() {clearTimeout(delay);
                };
            };

            eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';

            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }

        const GRID = new Grid(this.getGridDiv(type[0]), gridOptions);
    }

    compileTemplate(template): JQuery<HTMLElement> {
        let temp = $(template);
        this.mapApi.$compile(temp);
        return temp;
    }

    close() {
        this.panel.close();
    }
    
}

export interface TableLoader {
    mapApi: any;
    panel: any;
    hidden: boolean;
    legendBlock: any;
    _panelStateManager: PanelStateManager;
    panelManager: any;
}

interface ColumnDefinition {
    headerName: string;
    headerTooltip: string;
    //minWidth?: number;
    //maxWidth?: number;
    //width?: number;
    field: string;
    //headerComponent?: { new(): CustomHeader };
    //headerComponentParams?: HeaderComponentParams;
    filter: string;
    //filterParams?: any;
    //floatingFilterComponent?: undefined;
    //floatingFilterComponentParams: FloatingFilterComponentParams;
    cellRenderer?: (cellParams: any) => string | Element;
    //suppressSorting: boolean;
    //suppressFilter: boolean;
    //lockPosition?: boolean;
    //getQuickFilterText?: (cellParams: any) => string;
    //sort?: string;
    //hide?: boolean;
    //cellStyle?: any;
    //suppressMovable: any;
}
