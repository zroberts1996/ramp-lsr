
export const TABLE_LOADING_TEMPLATE = (legendEntry) =>
// hhite match parent
`<div class="rv-table-splash" style="position:inherit">
    <div class="rv-splash-count">
        <span class="rv-splash-count-current">${Math.floor(legendEntry.loadedFeatureCount)}</span>
            <svg class="rv-splash-count-slash" height="50" width="25">
                <line x1="0" y1="50" x2="25" y2="0"></line>
            </svg>
        <span class="rv-splash-count-total">${legendEntry.featureCount}</span>
    </div>
    <span class="rv-splash-message md-caption">{{ ${Math.floor(legendEntry.loadedFeatureCount)} < ${legendEntry.featureCount} ? 'table.splash.loadingdata' : 'table.splash.buildingtable' | translate }} </span>
    <md-progress-linear class="rv-progress-top" md-mode="indeterminate" ng-show="true"></md-progress-linear>
</div>`;


export const TABLE_LOADING_TEMPLATE2 = (legendEntry) =>
// hhite match parent
`
<div class="rv-table-splash" style="position:inherit">
    <span class="rv-splash-message md-caption">Loading data </span>
    <md-progress-linear class="rv-progress-top" md-mode="indeterminate" ng-show="true"></md-progress-linear>
</div>`;

export const PRINT_TABLE_NOT_ROWS = `

<div class="example-wrapper">
    <div id="myGrid" style="" class="ag-theme-material">
        <md-icon ng-if="sortAsc" class="rv-sort-arrow" md-svg-icon="navigation:arrow_upward" aria-label="{{ 'plugins.enhancedTable.columnHeader.sortAsc' | translate }}"></md-icon>
</div>
`;

export const CUSTOM_HEADER = `
<div class="column-header">
            <md-button class="custom-header-label">
                <span ref="eText" role="columnheader">TEST TEST2</span>
            </md-button>
            <md-icon ng-if="sortAsc" class="rv-sort-arrow" md-svg-icon="navigation:arrow_upward" aria-label="{{ 'plugins.enhancedTable.columnHeader.sortAsc' | translate }}"></md-icon>
            <md-icon ng-if="sortDesc" class="rv-sort-arrow" md-svg-icon="navigation:arrow_downward" aria-label="{{ 'plugins.enhancedTable.columnHeader.sortDsc' | translate }}"></md-icon>
            <div class="arrows"></div>
            <div class="reorder-icons">
                <md-button class="reorder-button md-icon-button move-left" ng-disabled="min" aria-label="{{ 'plugins.enhancedTable.columnHeader.reorderLeft' | translate }}">
                    <md-icon ng-style="{ 'font-size': '16px', height: '16px' }" md-svg-icon="hardware:keyboard_arrow_left"></md-icon>
                </md-button>
                <md-button class="reorder-button md-icon-button move-right" ng-disabled="max" aria-label="{{ 'plugins.enhancedTable.columnHeader.reorderRight' | translate }}">
                    <md-icon ng-style="{ 'font-size': '16px', height: '16px' }" md-svg-icon="hardware:keyboard_arrow_right"></md-icon>
                </md-button>
            </div>
        </div>
`;


export const PRINT_TABLE = (title, cols, rws) => {

    // make headers with the column names of the currently displayed columns
    let headers = ``;
    const columnNames = Object.keys(cols).map(column => cols[column]);
    columnNames.forEach(columnName => {
        if (columnName !== 'SHAPE' && columnName !== ' ' && columnName !== '') {
            headers += `<th style='width:200%; padding: 5px; border-bottom: 2px solid #000000'><div class='cell'>${columnName}</div></th>`;
        }
    });

    const columns = `<thead><tr>` + headers + `</tr></thead>`;

    // make rows
    // make sure row attributes are only pushed for columns that are currently displayed.
    const rows = `<tbody>${rws.map((rowAttributes: any) => {
        let eachRow = Object.keys(cols).map(attribute => rowAttributes.data[attribute]);
        return `<tr>${eachRow.map((r: any) => {
            return `<td><div class='cell'>${r}</div></td>`;
        }).join('')}</tr>`;
    }).join('')}</tbody>`;

    // return formatted HTML table
    return `<head>
                <style>
                    table {
                        font-family: arial, sans-serif;
                        border-collapse: collapse;
                    }
                    td, th {
                        border-bottom: 1px solid #dddddd;
                        text-align: left;
                        padding: 3px;
                        padding-right: 50px;
                        min-width: 150px;
                    }
                    h1{
                        font-family: arial, sans-serif;
                    }
                    .cell{
                        min-height: 40px;
                    }
                </style>
            </head>
            <body class ='dt-print-view'>
                <div>
                    <h1 class="md-title" style='padding:8px;'>Features: ${title}</h1>
                    <table>${columns}${rows}</table>
                </div>
            </body>`;
}
