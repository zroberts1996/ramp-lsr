import { TABLE_LOADING_TEMPLATE2 } from './table-template';
import { GRID_TEMPLATE, MENU_BUTTON_RESULT } from '../templates/template';
import { Grid } from 'ag-grid-community';
import { PanelStateManager } from './panel-state-manager'
import { ZoomToElement } from './button-test'

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
        this.panel.element.css({top: '50%', left: '20%', right: '52px', bottom: '30px'});  //
        this.panel.element.addClass('ag-theme-material mobile-fullscreen tablet-fullscreen');
        this.panel.allowUnderlay = true;
        this.panel.allowOffscreen = true;

        this.panel.closing.subscribe(this.onHideResultPanel.bind(this));
        
        this.prepareHeader(this.mapApi);
        this.prepareBody();
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

        this.mapApi.agControllerRegister('MenuPanel2', ['$scope','$mdSidenav', function($scope ,$mdSidenav) {
            
            $scope.openSideMenu = buildToggler('sideMenu');

            function buildToggler(componentId) {
                return function() {
                    $mdSidenav(componentId).toggle();
                }
            }
        }])
        titleElem.append(this.compileTemplate(MENU_BUTTON_RESULT));


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

        const test1 = `<md-button id='parcelTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('parcel')"; name="test1" style="padding:0px; margin:0px;">Parcel</md-button>`
        const test2 = `<md-button id='surveyTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('survey')"; name="test2" style="padding:0px; margin:0px;">Survey</md-button>`
        const test3 = `<md-button id='planTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('plan')";name="test3" style="padding:0px; margin:0px;">Plan</md-button>`;
        const test4 = `<md-button id='townTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('town')";name="test4" style="padding:0px; margin:0px;">Township</md-button>`;
        const test5 = `<md-button id='adminTab' ng-controller="TabController as ctrl"; ng-click="openSelectedTab('admin')";name="test5" style="padding:0px 6px 0px 20px; margin:0px;">Administrative</md-button>`;
        const test6 = `<md-button ng-controller="TabController as ctrl"; ng-click="openSelectedTab('projectGrid')";name="test6" style="padding:0px; margin:0px;">Info</md-button>`;


        titleElem.append(this.compileTemplate(test1));
        titleElem.append(this.compileTemplate(test2));
        titleElem.append(this.compileTemplate(test3));
        titleElem.append(this.compileTemplate(test4));
        titleElem.append(this.compileTemplate(test5));
        titleElem.append(this.compileTemplate(test6));

        //titleElem.append(this.compileTemplate(titleText));
        //this.panel.header.toggleButton
        //this.panel.header.title = this.legendBlock.name;
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

    prepareBody() {
        let template = TABLE_LOADING_TEMPLATE2(this.legendBlock);
        this.panel.body = template;
        this.panel.body = this.compileTemplate(GRID_TEMPLATE);
    }



    setSpatialGrid(results) {
        let mapApi = this.mapApi;
        //this.panel.body = this.compileTemplate(GRID_TEMPLATE);
        let tabElement = document.getElementById('parcelTab')
        
        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }
        let gridDiv = <HTMLElement>document.querySelector('#parcel')

        let gridOptions = {
            columnDefs: [
                {headerName: 'Plan Designator', field:'parcelDesignator', headerTooltip: 'Plan Designator', cellRenderer: function(cell){return cell.value}},
                {headerName: 'Plan Number', field:'planNumber', headerTooltip: 'Plan Number'},
                {headerName: 'Plan Detail', field:'planDetail', headerTooltip: 'Plan Detail'},
                {headerName: 'Remainder', field:'remainder', headerTooltip: 'Remainder'},
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
                planDetail: result.attributes['PARCELFC_ENG'],
                remainder: result.attributes['REMAINDERIND_ENG'],
                globalid: result.attributes['GlobalID'],

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

        new Grid(gridDiv, gridOptions);
    }

    setSpatialGridSIP(results) {
        let mapApi = this.mapApi;
        //this.panel.body = this.compileTemplate(GRID_TEMPLATE);
        let tabElement = document.getElementById('surveyTab')
        
        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }

        let gridDiv = <HTMLElement>document.querySelector('#survey')

        let gridOptions = {
            columnDefs: [
                {headerName: 'Project Number', field:'projectNumber', headerTooltip: 'Project Number', cellRenderer: function(cell){return cell.value}},
                {headerName: 'Description', field:'description', headerTooltip: 'Description'},
                //{headerName: 'Global ID', field:'globalID', headerTooltip: 'Global ID'},
                {headerName: 'Project Detail', field:'url', headerTooltip: 'Project Detail'},
                //{headerName: 'Province', field:'province', headerTooltip: 'Province'},
            ],

            rowData: [],

            //onGridReady: function(params) {
            //    params.api.sizeColumnsToFit();
            //},

            rowStyle: {
                background: 'white'
            },

            //pagination: true,
            enableColResize: true,
            enableSorting: true,
        };
        
        results.forEach(function(result) {
            gridOptions.rowData.push({
                projectNumber: result.attributes['PROJECTNUMBER'], 
                description: result.attributes['DESCRIPTION'],
                globalid: result.attributes['GlobalID'],
                url: result.attributes['URL'],
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

        new Grid(gridDiv, gridOptions);
    }
    
    setSpatialGridPlan(results) {
        let mapApi = this.mapApi;
                //const self = this;
                //this.panel.body = this.compileTemplate(GRID_TEMPLATE);
        
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
                        {headerName: 'Date of Survey', field:'dateSurvey', headerTooltip: 'Date of Survey',  width: 150},
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
        
                    //allowContextMenuWithControlKey: true,
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
                            console.log('a')
                        }, 500);
                        eDiv.onmouseout = function() {clearTimeout(delay);
                        };
                    };
                    
                    eDiv.innerHTML = '<span class="my-css-class" style="cursor:pointer"><a href="#">' + params.value + '</a></span>';
                    //eDiv.innerHTML = '<span class="my-css-class"><button class="btn-simple">Push Me</button></span>';
                    //var eButton = eDiv.querySelectorAll('.btn-simple')[0];
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
        
                let gridDiv = <HTMLElement>document.querySelector('#plan')
                //let gridDiv1 = <HTMLElement>document.querySelector('#admin')
        
                new Grid(gridDiv, gridOptions);
                //new Grid(gridDiv1, gridOptions);
            }

            setSpatialGridTown(results) {
                let mapApi = this.mapApi;
                //this.panel.body = this.compileTemplate(GRID_TEMPLATE);
                let tabElement = document.getElementById('townTab')
        
                if (results.length >= 1000) {
                    tabElement.innerHTML = tabElement.innerText + ' (1000+) '
                } else {
                    tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
                }

                let gridDiv = <HTMLElement>document.querySelector('#town')
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
                        township: result.attributes['TOWNSHIP'],
                        range: result.attributes['RANGE'],
                        //direction: result.attributes['DIRECTION'],
                        meridian: result.attributes['MERIDIAN'],
                        //globalid: result.attributes['GlobalID'],
                        //province: result.attributes['PROVINCE'],
        
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
        
                new Grid(gridDiv, gridOptions);
            }
        
            setSpatialGridAdminArea(results) {
                let mapApi = this.mapApi;
                //this.panel.body = this.compileTemplate(GRID_TEMPLATE);
                let tabElement = document.getElementById('adminTab')
        
                if (results.length >= 1000) {
                    tabElement.innerHTML = tabElement.innerText + ' (1000+) '
                } else {
                    tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
                }
                let gridDiv = <HTMLElement>document.querySelector('#admin')
                let gridOptions = {
                    columnDefs: [
                        {headerName: 'Name', field:'name', headerTooltip: 'name', cellRenderer: function(cell){return cell.value}},
                       // {headerName: 'Province', field:'province', headerTooltip: 'Province'},
                       // {headerName: 'Global ID', field:'globalID', headerTooltip: 'Global ID'},
                    ],
        
                    rowData: [],
        
                    //onGridReady: function(params) {
                    //    params.api.sizeColumnsToFit();
                    //},
        
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
                        province: result.attributes['PROVINCE'],
                        globalid: result.attributes['GlobalID'],
                   })
                })
        
                gridOptions.columnDefs[0].cellRenderer = function(params) {
                    
                    var eDiv = document.createElement('div');
                    eDiv.onmouseover=function() {
                        let delay = setTimeout(function() {
                            new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'mouseover');
                            console.log('a')
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
        
                new Grid(gridDiv, gridOptions);
            }

    setFieldInfo(value) {

        let fieldInfo = {
            additionalinfo: {headerName: "Additional Info", field: "additionalinfo", headerToolTip: "Additional Info"},
            dateofsurvey: {headerName: "Date of Survey", field: "dateSurvey",headerToolTip: "Date of Survey"},
            description: {headerName: "Description", field: "description", headerToolTip: "Description"},
            lto: {headerName: "LTO", field: "lto", headerToolTip: "LTO"},
            meridian: {headerName: "Meridian", field: "meridian", headerToolTip: "Meridian"},
            name: {headerName: "Name", field: "name", headerToolTip: "Name"},
            parceldesignator: { headerName: "Parcel Designator", field: "parceldesignator", headerToolTip: "Parcel Designator"},
            parceltype: {headerName: "Parcel Type", field: "parceltype", headerToolTip: "Parcel Type"},
            plandetail: { headerName: "Plan Detail", field: "planDetail", headerToolTip: "Plan Detail"},
            plannumber: {headerName: "Plan Number", field: "planNumber", headerToolTip: "Plan Number", cellRenderer: function (cell) {return cell.value}},
            projectdetail: {headerName: "Project Detail", field: "projectdetail", headerToolTip: "Project Detail"},
            projectnumber: {headerName: "Project Number", field: "projectnumber", headerToolTip: "Project Number"},
            province: {headerName: "Province", field: "province", headerToolTip: "Province"},
            range: { headerName: "Range", field: "range", headerToolTip: "Range"},
            remainder: { headerName: "Remainder", field: "remainder", headerToolTip: "Remainder"},
            section: { headerName: "Section", field: "section", headerToolTip: "Section"},
            township: { headerName: "Township", field: "township", headerToolTip: "Township"}
        };

        
        /*const FIELD_LIST = [
            'Parcel Designator', 
            'Remainder',
            'Plan Number', 
            'Plan Detail', 
            'Parcel Type', 
            'Project Number',
            'Description', 
            'Project Detail', 
            'Date of Survey', 
            'LTO', 
            'Section', 
            'Township', 
            'Range',
            'Meridian', 
            'Name', 
            'Additional Info'
        ];*/

        /*let field_object = {};
        FIELD_LIST.forEach(function(element,i) {
            let name = element.replace(/\s/g, '').toLowerCase()
            field_object[name] = {headerName:element, field:element.replace(/\s/g, '').toLowerCase(), headerToolTip:element}
        })*/

        //let value = 'plan';
        let columnDefs =[];
        switch(value) {
            case 'parcel':
                //columnDefs["parceldesignator"] =  { headerName: "Parcel Designator", field: "parceldesignator", headerToolTip: "Parcel Designator"};
                //columnDefs["remainder"] = {headerName: "Remainder", field: "remainder", headerToolTip: "Remainder"};
                //columnDefs["plannumber"] = {headerName: "Plan Number", field: "plannumber", headerToolTip: "Plan Number", cellRenderer: function (cell) {return cell.value}};
                //columnDefs["plandetail"] = {headerName: "Plan Detail", field: "plandetail", headerToolTip: "Plan Detail"};
                //columnDefs["parceltype"] = {headerName: "Parcel Type", field: "parceltype", headerToolTip: "Parcel Type"};
                columnDefs.push(fieldInfo['parceldesignator']);
                columnDefs.push(fieldInfo['remainder']);
                columnDefs.push(fieldInfo['plannumber']);
                columnDefs.push(fieldInfo['plandetail']);
                columnDefs.push(fieldInfo['parceltype']);
                break;
            case 'survey':
                //columnDefs["projectnumber"] = {headerName: "Project Detail", field: "projectdetail", headerToolTip: "Project Detail"};
                //columnDefs["description"] = {headerName: "Description", field: "description", headerToolTip: "Description"};
                //columnDefs["projectdetail"] = {headerName: "Project Detail", field: "projectdetail", headerToolTip: "Project Detail"};
                columnDefs.push(fieldInfo['projectnumber']);
                columnDefs.push(fieldInfo['description']);
                columnDefs.push(fieldInfo['projectdetail']);
                break;
            case 'plan':
                //columnDefs["plannumber"] = {headerName: "Plan Number", field: "plannumber", headerToolTip: "Plan Number", cellRenderer: function (cell) {return cell.value}};
                //columnDefs["description"] = {headerName: "Description", field: "description", headerToolTip: "Description"};
                //columnDefs["dateofsurvey"] = {headerName: "Date of Survey", field: "dateofsurvey",headerToolTip: "Date of Survey"};
               // columnDefs["plandetail"] = {headerName: "Plan Detail", field: "plandetail", headerToolTip: "Plan Detail"};
                //columnDefs["lto"] = {headerName: "LTO", field: "lto", headerToolTip: "LTO"};
                columnDefs.push(fieldInfo['plannumber']);
                columnDefs.push(fieldInfo['description']);
                columnDefs.push(fieldInfo['dateofsurvey']);
                columnDefs.push(fieldInfo['plandetail']);
                columnDefs.push(fieldInfo['lto']);
                break;
            case 'town': 
                //columnDefs["section"] = {headerName: "Section", field: "section", headerToolTip: "Section"};
                //columnDefs["township"] = {headerName: "Township", field: "township", headerToolTip: "Township"};
                //columnDefs["range"] = {headerName: "Range", field: "range", headerToolTip: "Range"};
                //columnDefs["meridian"] = {headerName: "Meridian", field: "meridian", headerToolTip: "Meridian"};
                columnDefs.push(fieldInfo['section']);
                columnDefs.push(fieldInfo['township']);
                columnDefs.push(fieldInfo['ranger']);
                columnDefs.push(fieldInfo['meridian']);
                break;
            case 'admin':
                //columnDefs["name"] = {headerName: "Name", field: "name", headerToolTip: "Name"};
                columnDefs.push(fieldInfo['name']);
                columnDefs.push(fieldInfo["description"]);
                columnDefs.push(fieldInfo["province"]);
                break;
            case 'info':
                /*columnDefs["additionalinfo"]= {headerName: "Additional Info", field: "additionalinfo", headerToolTip: "Additional Info"};
                columnDefs.push(fieldInfo['additionalinfo']);*/
                break;
        }
        return columnDefs;
    }

    setResultsGrid(results, mapApi, type) {

        let fieldInfo = this.setFieldInfo(type[0]);

        let tabElement = document.getElementById(type[0] + 'Tab')
        
        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }

        let gridDiv = <HTMLElement>document.querySelector('#' + type[0])


        //this.panel.body = this.compileTemplate(GRID_TEMPLATE);
        /*let tabElement = document.getElementsByName('plan')[0]

        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }*/

        /*width: 300*width: 150;width: 100*/
        
        let gridOptions = {
            columnDefs: [],
            /*columnDefs: [
                {headerName: 'Plan Number', field:'planNumber', headerTooltip: 'Plan Number', cellRenderer: function (cell) {return cell.value}},
                {headerName: 'Description', field:'description', headerTooltip: 'Description', },
                {headerName: 'Date of Survey', field:'dateSurvey', headerTooltip: 'Date of Survey',},
                {headerName: 'Detail', field:'planDetail', headerTooltip: 'Detail'},
                {headerName: 'LTO', field:'lto', headerTooltip: 'List of survey document (plan) results from the attributes and map searches'},
            ],*/

            rowSelection: 'multiple',

            rowData:[],

            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
                params.api.refreshCells(params);
                
            },

            rowStyle: {
                background: 'white'
            },

            //pagination: true,
            
            enableColResize: true,
            enableSorting: true,

            //allowContextMenuWithControlKey: true,
        }

        fieldInfo.forEach(function (elem) {
            if (elem.cellRenderer) {

                gridOptions.columnDefs.push({
                    headerName: elem.headerName,
                    field: elem.field,
                    headerTooltip:elem.headerToolTip,
                    cellRenderer: elem.cellRenderer
                });
            } else {
                gridOptions.columnDefs.push({
                    headerName: elem.headerName,
                    field: elem.field,
                    headerTooltip:elem.headerToolTip,
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
                eDiv.innerHTML= '<span class="my-css-class"><a href="' + 'https://clss.nrcan-rncan.gc.ca/plan-fra.php?id=' + params.data.planNumber.replace(/\s/g, '%20') + '"target=_blank>' + params.value + '</a></span>';
                return eDiv
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

            //eDiv.innerHTML = '<span class="my-css-class"><button class="btn-simple">Push Me</button></span>';
            //var eButton = eDiv.querySelectorAll('.btn-simple')[0];
            eDiv.addEventListener('click', function() {
                new ZoomToElement(mapApi, params.data.globalid, params.data.province, 'click')
            });
            eDiv.addEventListener('mouseout', function() {
                mapApi.esriMap.graphics.clear();
            });
            return eDiv;
        }

        /*gridOptions.columnDefs[3].cellRenderer = function(params) {
            let eDiv = document.createElement('div');
            eDiv.innerHTML= '<span class="my-css-class"><a href="' + 'https://clss.nrcan-rncan.gc.ca/plan-fra.php?id=' + params.data.planNumber.replace(/\s/g, '%20') + '"target=_blank>' + params.value + '</a></span>';
            return eDiv
        }*/

        //let gridDiv = '<div id ="planGrid" class="hidden" style="height: 100%;"></div>';
        //let gridDiv2 = '<div id ="projectGrid" class="hidden" style="height: 100%;"></div>';
        

        //this.panel.body = this.compileTemplate(gridDiv);
        //this.panel.body.append(this.compileTemplate(gridDiv2));
        //let gridDivHtml = <HTMLElement>document.querySelector('#planGrid')
        //let gridDivHtml2 = <HTMLElement>document.querySelector('#projectGrid')


        new Grid(gridDiv, gridOptions);
        //new Grid(gridDivHtml2, gridOptions);


        //let gridDiv = <HTMLElement>document.querySelector('#plan')
        //let gridDiv1 = <HTMLElement>document.querySelector('#admin')
        //new Grid(gridDiv, gridOptions);

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
