import { TABLE_LOADING_TEMPLATE2 } from './table-template';
import { GRID_TEMPLATE, TABS_TEMPLATE } from './template';
import { Grid } from 'ag-grid-community';

export class TableLoader {

    constructor(mapApi: any, legendBlock) {
        this.mapApi = mapApi;
        this.legendBlock = legendBlock;
        this.panel = this.mapApi.panels.create('tableLoaderId');
        this.panel.element.css({top: '50%', left: '20%', right: '52px',});
        this.panel.allowUnderlay = true;
        this.prepareHeader();
        this.prepareBody();
        //this.hidden = true;
        this.open()
    }

    setSize(maximized) {
        if (maximized) {
            this.panel.element.css({ bottom: '0' });;
        } else {
            this.panel.element.css({ bottom: '50%' });;
        }
    }

    prepareHeader() {
        //this.panel.header.toggleButton
        //this.panel.header.title = this.legendBlock.name;
        
        const customBtn2 = new this.panel.Button('Parcel');

        customBtn2.$.on('click', function() {
    
                let tabContent = <HTMLElement>document.getElementById('info');
                let tabContentActive = document.getElementsByClassName(' active') as HTMLCollectionOf<HTMLElement>

                if (tabContentActive.length >0) {
                    tabContentActive[0].style.display = "none";
                    tabContentActive[0].classList.remove("active")
                }

                tabContent.className += ' active';
                tabContent.style.display = "block";

        });

        this.panel.header.append(customBtn2);

        
        this.panel.header.closeButton;

        this.mapApi.ui.configLegend.elementRemoved.subscribe(legendBlock => {
            if (legendBlock === this.panel.legendBlock) {
                this.panel.panel.close();
            }
        });
    }

    open() {
        this.panel.open();
        this.hidden = false;
    }

    prepareBody() {
        let template = TABLE_LOADING_TEMPLATE2(this.legendBlock);
        this.panel.body = template;
    }

    setResultsGrid(results) {
        
        this.panel.body = this.compileTemplate(GRID_TEMPLATE);
        
        let tabElement = document.getElementsByName('plan')[0]

        if (results.length >= 1000) {
            tabElement.innerHTML = tabElement.innerText + ' (1000+) '
        } else {
            tabElement.innerHTML = tabElement.innerText + ' (' + results.length + ')';
        }

        let gridOptions = {
            columnDefs: [
                {headerName: 'Plan Number', field:'planNumber', headerTooltip: 'Plan Number', 
                    cellRenderer: function(params){
                        return '<a href="https://www.google.com" target="_blank" rel="noopener">' + params.value + '</a>'
                        //return "<a title='Click to zoom to " + params.attributes['PLANNO'] + "' href=javascript:zoomFeature('" + params.attributes["GlobalID"] + "','" + escape(params.attributes["PROVINCE"]) + "'); onmouseover=javascript:highlightFeature('" + params.attributes["GlobalID"] + "') onmouseout=javascript:map.graphics.clear() onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + params.attributes["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + params.attributes["PROJECTNUMBER"] + "</a>"
                    }
                },
                {headerName: 'Description', field:'description', headerTooltip: 'Description'},
                {headerName: 'Date of Survey', field:'dateSurvey', headerTooltip: 'Date of Survey'},
                {headerName: 'Plan Detail', field:'planDetail', headerTooltip: 'Plan Detail'},
                {headerName: 'LTO', field:'lto', headerTooltip: 'List of survey document (plan) results from the attributes and map searches'}
            ],

            rowData: [],

            onGridReady: function(params) {
                params.api.sizeColumnsToFit();
            },

            rowStyle: {
                background: 'white'
            },

            pagination: true,

            enableColResize: true,

        }
        
        results.forEach(function(result) {
            let date = result.attributes['P3_DATESURVEYED'];
            let year = date.substr(0,4);
            let month = date.substr(4,2);
            let day = date.substr(6,2);
            let newDate = new Date(year, month, day).toLocaleString();

            gridOptions.rowData.push({
                planNumber: result.attributes['PLANNO'],
                description: result.attributes['P2_DESCRIPTION'],
                dateSurvey: newDate,
                planDetail: result.attributes[''],
                lto: result.attributes['ALTERNATEPLANNO']
            })
        })
        
        let gridDiv = <HTMLElement>document.querySelector('#plan')
        new Grid(gridDiv, gridOptions);
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
}
