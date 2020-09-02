// panels templates: draw
import { TableLoader } from '../spatial/draw-grid';

export const MAPNAV_DRAW_TOOLBAR_TEMPLATE = `
<span class="rv-spacer"></span>
<div class="rv-mapnav-content rv-mapnav-draw-content">
    <div class="rv-button-group hover rv-whiteframe-z2" ng-controller="DrawToolbarCtrl as ctrl">
        <md-button ng-repeat-start="control in ctrl.controls" name="{{ controls }}"
            aria-label="{{ control.label | translate }}"
            class="md-icon-button rv-button-32 rv-icon-16 rv-draw-button rv-draw-{{ control.name }}-button"
            ng-class="{ 'rv-control-active': control.selected() }"
            ng-click="control.action($event)">
            <md-tooltip md-direction="left">{{ control.tooltip | translate }}</md-tooltip>
            <md-icon>
                <svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false">
                <g id="drawicon{{control.name}}" ng-init="control.createIcon()"><path id="path{{control.name}}" d=""></path></g></svg>
            </md-icon>
        </md-button>
        <!-- this will insert divider after every element except the last one -->
        <md-divider ng-if="!$last" ng-repeat-end></md-divider>
        <input id="rvUploadGraphics" class="ng-hide" type="file" accept=".fgpv"></input>
    </div>
</div>
<span class="rv-spacer"></span>
`;

export const SEARCH_PANEL_TEMPLATE = ` 

<div class="rv-panel-content" ng-controller="SearchPanel as ctrl">

    <section layout="column" layout-sm="column" layout-align="center left" layout-wrap>

        <md-input-container class=md-block-input-province" flex-gt-sm>
            <label>Province</label>
            <md-select ng-model="user.state" id=selectInput>
                <md-option ng-repeat="state in states" value="{{state.abbrev}}">
                    {{state.abbrev}}
                </md-option>
            </md-select>
        </md-input-container>

        <md-input-container class="md-block-input-plan" flex-gt-sm>
            <label>{{ 'plugins.clssPlugin.inputText' | translate }} </label>
            <input type="text" ng-model="color" required="" md-maxlength="10" id="planInput">
        </md-input-container>
    </section>
    <section layout="row" layout-sm="column" layout-align="center left" layout-wrap>
        <md-button 
            title="{{ 'plugins.clssPlugin.searchAria' | translate }}"
            class="bt1 ng-scope md-raised md-primary rv-search-button"
            aria-label="{{ 'plugins.clssPlugin.searchAria' | translate }}"
            ng-click="searchFunction()">
                {{ 'plugins.clssPlugin.buttonName' | translate }}
        </md-button>
        
        <md-button 
            title="{{ 'plugins.clssPlugin.resetLabel' | translate }}"
            class="bt2 ng-scope md-raised md-primary rv-reset-button"
            ng-click="resetFunction()">
                {{ 'plugins.clssPlugin.resetButton' | translate }}
        </md-button>
    </section>
</div>

<md-divider></md-divider>
`;

export const TAB_TEMPLATE = ` 
<md-button ng-controller="DownloadBtnCtrl as ctrl"
    class="md-icon-button black md-ink-ripple rv-button-32 rv-mapnav-search-content"
    ng-disabled="ctrl.isButtonDisabled()"
    ng-click="ctrl.downloadResultsAsJson()">
    <md-tooltip>{{ 'plugins.elevation.resultPanel.header.downloadBtn.tooltip' | translate }}</md-tooltip>
    <md-icon>
        <svg xmlns="http://www.w3.org/2000/svg" fit height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 2 24 24" focusable="false">
            <g>
                <path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.91 6.71c-.39-.39-1.02-.39-1.41 0L8.91 11.3c-.39.39-.39 1.02 0 1.41l4.59 4.59c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L11.03 12l3.88-3.88c.38-.39.38-1.03 0-1.41z"/>
            </g>
        </svg>
    </md-icon>
</md-button>
`;

export const GRID_TEMPLATE = `
<div class="grid-wrapper">
    <div id="resultsGrid" style="" class="ag-theme-material">
        <md-icon ng-if="sortAsc" class="rv-sort-arrow" md-svg-icon="navigation:arrow_upward" aria-label="{{ 'plugins.enhancedTable.columnHeader.sortAsc' | translate }}"></md-icon>
</div>
`;

export const TAB = `
<mat-tab-group>
    <mat-tab label="First"> Content 1 </mat-tab>
    <mat-tab label="Second"> Content 2 </mat-tab>
    <mat-tab label="Third"> Content 3 </mat-tab>
</mat-tab-group>
`;