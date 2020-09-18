// Add all needed html template
// ng-controller will link to a controller in one of your ts file
// to access translation, use {{ 'plugins.YOUR PLUGIN NAME.YOUR TRANSLATION VALUE' | translate }}

export const MAPNAV_TOOL_TOOLBAR_TEMPLATE = `
<div class="" ng-nom-text="TextCtrl as text">
    <md-input-container>
        <label>Enter Plan Number</label>
        <input type="text" ng-model="color" required="" md-maxlength="10" (focusout) = "focusoutHandler($event)">
        
        </md-input-container>
</div>
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

const SELECT_PROVINCE = `
<md-input-container class="md-container">
    <md-select ng-model="user.province" id=selectProvince ng-change="checkProvince()" placeholder="Select Province or Territory">
        <md-option ng-repeat="province in ctrl.provinces" value="{{province}}" ng-click="ctrl.updateReserveBox(province)">{{province}}</md-option>
    </md-select>
</md-input-container>
`;

const SELECT_RESERVE = `
<md-input-container class="md-container">
    <md-select ng-model="user.reserve" id=selectReserve ng-disabled="ctrl.isDisabled"  placeholder="Canada Land (Select a province first)">
        <md-option ng-repeat="reserve in ctrl.reserves" value="{{reserve}}" ng-click="ctrl.setSelectedReserve(reserve)">{{reserve}}</md-option>
    </md-select>
</md-input-container>
`;

const INFINITE_SELECT_RESERVE = `
<md-virtual-repeat-container class="md-container">
    <div md-virtual-repeat="reserve in ctrl.reserves" md-on-demand class="repeated-item" flex>
        {{reserve}}
    </div>
</md-virtual-repeat-container>
`;

const INPUT_PLAN = `
<md-input-container class="md-container">
    <label>{{ 'plugins.clssPlugin.inputText' | translate }} </label>
    <input type="text" ng-model="user.planNumber" required="" md-maxlength="10" id="planInput">
</md-input-container>
`;

const INPUT_PARCEL = `
<md-input-container class="md-container">
    <label> Enter Parcel </label>
    <input type="text" ng-model="user.parcelNumber" required="" md-maxlength="10" id="parcelInput">
</md-input-container>
`;

const INPUT_NTS_SHEET = `
<md-input-container class="md-container">
    <label> Enter NTS Map Sheet </label>
    <input type="text" ng-model="user.ntsSheetNumber" required="" md-maxlength="10" id="ntsSheetInput">
</md-input-container>
`;

const INPUT_COMMUNITY = `
<md-input-container class="md-container">
    <label> Enter Community Name </label>
    <input type="text" ng-model="user.communityName" required="" md-maxlength="10" id="communityInput">
</md-input-container>
`;

const SEARCH_BUTTON = `
<md-button 
    title="{{ 'plugins.clssPlugin.searchAria' | translate }}"
    class="bt1 ng-scope md-raised md-primary rv-search-button"
    aria-label="{{ 'plugins.clssPlugin.searchAria' | translate }}"
    ng-click="ctrl.lauchSearchAction()">
        {{ 'plugins.clssPlugin.buttonName' | translate }}
</md-button>
`;

const RESET_BUTTON = `
<md-button 
    title="{{ 'plugins.clssPlugin.resetLabel' | translate }}"
    class="bt2 ng-scope md-raised md-primary rv-reset-button"
    ng-click="ctrl.resetFunction()">
        {{ 'plugins.clssPlugin.resetButton' | translate }}
</md-button>
`;

export const SEARCH_PLAN_TEMPLATE = ` 

<div class="rv-panel-content" ng-controller="SearchPanel as ctrl">
    <section layout="column" class="input-section"> 
        
        ${SELECT_PROVINCE}

        ${SELECT_RESERVE}

        ${INPUT_PLAN}

    </section>
    
    <section layout="row" layout-align="center left" layout-wrap>
        ${SEARCH_BUTTON}
        
        ${RESET_BUTTON}
    </section>
</div>
<md-divider></md-divider>
`;


export const PROTECTED_AREA_TEMPLATE = ` 
<div class="rv-panel-content" ng-controller="SearchPanel as ctrl">
    <section layout="column" class="input-section"> 
        ${SELECT_PROVINCE}

        ${INPUT_PARCEL}

        ${INPUT_PLAN}

        ${INPUT_NTS_SHEET}
    </section>
    
    <section layout="row" layout-align="center left" layout-wrap>
        ${SEARCH_BUTTON}
            
        ${RESET_BUTTON}
    </section>
</div>
<md-divider></md-divider>
`;

export const COMMUNITY_TEMPLATE = ` 
<div class="rv-panel-content" ng-controller="SearchPanel as ctrl">
    <section layout="column" class="input-section"> 
        ${SELECT_PROVINCE}

        ${INPUT_COMMUNITY}

    </section>
    
    <section layout="row" layout-align="center left" layout-wrap>
        ${SEARCH_BUTTON}
            
        ${RESET_BUTTON}
    </section>
</div>
<md-divider></md-divider>
`;

export const zoom_BUTTON = `
    <button class="md-icon-button black md-button ng-scope md-ink-ripple" 
        ng-click="zoom()"
        ng-controller = "test">
        <md-icon md-svg-src="navigation:menu" class="ng-scope" role="img" aria-label='test'>
            <svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false">
                <g id="menu"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g>
            </svg>
        </md-icon>
    </button> 
    `;

export const MENU_BUTTON = `
    <button class="md-icon-button black md-button ng-scope md-ink-ripple" 
        ng-click="openSideMenu()"
        ng-controller="MenuPanel"
        style="float:left">
        <md-tooltip md-direction="bottom">Open Side Menu</md-tooltip>

        <md-icon md-svg-src="navigation:menu" class="ng-scope" role="img" aria-label='test'>
            <svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false">
                <g id="menu"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"></path></g>
            </svg>
        </md-icon>
    </button>   

    <md-sidenav class="md-sidenav-menu" md-component-id="sideMenu" md-disable-backdrop="" md-whiteframe="4" style="overflow: hidden;">

        <md-toolbar class="theme-blue" style="display:block">
            <h1 class="md-toolbar-tools" style="position:absolute;float:left;width:80%">Available Searches</h1>

            <button class="md-icon-button black md-button ng-scope md-ink-ripple" 
                style="height:56px;position:relative;float:right"
                ng-click="openSideMenu()"
                ng-controller="MenuPanel">
                <md-tooltip md-direction="bottom">Close Side Menu</md-tooltip>
                <md-icon md-svg-src="community:chevron-double-left" class="ng-scope" role="img" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false">
                        <g id="chevron-double-left">
                            <path d="M 18.414,7.41398L 17,6L 11,12L 17,18L 18.414,16.586L 13.828,12L 18.414,7.41398 Z M 12.414,7.41398L 11,6L 5.00001,12L 11,18L 12.414,16.586L 7.82801,12L 12.414,7.41398 Z "></path>
                        </g>
                    </svg>
                </md-icon>
            </button>  

        </md-toolbar>

        <div class="menu-panel" md-whiteframe="4" style="overflow-y: scroll;"> 
          
          <div class="panel-middle" ng-controller="MenuPanel">
            <form name="myForm" ng-controller="MenuPanel">
                <label>
                    <input type="radio" ng-model="search.name" ng-value="True" name="protected" ng-click="getSearchInfo($event.target.name); openSideMenu()">
                    {{ 'plugins.clssPlugin.sidePanel.protected' | translate }}
                </label><br/>
                <label>
                    <input type="radio" ng-model="search.name" value="community" ng-click="getSearchInfo($event.target.value); openSideMenu()">
                    {{ 'plugins.clssPlugin.sidePanel.community' | translate }}
                </label><br/>
                <label>
                    <input type="radio" ng-model="search.name" value="plan" ng-click="getSearchInfo($event.target.value); openSideMenu()">
                    {{ 'plugins.clssPlugin.sidePanel.plan' | translate }}
                </label><br/>
            </form>

          </div>
        </div>
    </md-sidenave>
`

export const ZOOM_TEMPLATE = (oid) =>
    `<button  ng-click='ctrl.zoomToFeature(${oid})'  md-ink-ripple class='md-icon-button rv-icon-16 md-button ng-scope enhanced-table-zoom' aria-label="{{ 'plugins.enhancedTable.detailsAndZoom.zoom' | translate }}">
        <md-icon md-svg-src="action:zoom_in" aria-hidden='false'>
            <md-tooltip  md-direction="top">{{ 'plugins.enhancedTable.detailsAndZoom.zoom' | translate }}</md-tooltip>
        </md-icon>
    </button>`;

export const GRID_TEMPLATE = `

<div class="grid-wrapper">
    <div ng-controller="ResultsTabsCtrl as ctrl" layout="column" class="ng-scope">
    
        <md-toolbar class="md-accent">
            <div class="tabButton">
                <md-button ng-repeat="control in ctrl.tabs" 
                    name="{{ control.name }}"
                    title="{{ control.title | translate }}"
                    class="tablinks"
                    ng-click="openTab(control.name)">
                    {{ control.title | translate }} 
                
                </md-button>
            </div>

            <div id="survey1" class="tabcontent">
                <h3>Arpentage en cours</h3>
                <p>Info sur les arpentages</p> 
            </div>

            <div id="plan1" class="tabcontent">
                <h3>Plan d'arpentage</h3>
                <p>Info sur les plans</p>
            </div>

            <div id="township" class="tabcontent">
                <h3>Township</h3>
                <p>Info sur les townships</p>
            </div>

            <div id="admin" class="tabcontent">
                <h3>Administrative Area</h3>
                <p>Info sur les townships</p>
            </div>

            <div id="info" class="tabcontent">
                <h3>Informations additionnelles</h3>
                <p>Info sur les townships</p>
            </div>
        </md-toolbar>
    </div>
    <div id="plan" style="" class="ag-theme-material"></div>
    
</div>

`;

export const LEGEND_TEMPLATE = `
	<div class="tabpanels" ng-controller="LegendPanel as ctrl">
        <div class="tgl-panel" aria-labelledby="wb-auto-2" aria-expanded="true" aria-hidden="false">
			<div>
                <form id="legend" action="javascript:void(0)" method="post" class="form-horizontal mrgn-rght-0 mrgn-lft-0">
	                <h3>Légende</h3>
		            <details class="row mrgn-lft-0 mrgn-rght-0" open="">
		            <summary>Pétrole et gaz</summary>
					<div class="checkbox">
                        <label for="legend-4">
                            <input type="checkbox" value="4" id="legend-4" checked="" ng-click="toggleLayerVisibility(97)">
                            <span>
                                <img class="image-actual" src="./images/legend-97.png" alt="Rectangle bleu" style="width:auto !important">
                            </span>
                            Réseau de pétrole et de gaz
                        </label>
                    </div>
                </form>
            </div>
        </div>
    </div>
`;

export const SIDE_NAV_TEMPLATE1 = `
<div>
    <ul class="heroes">
        <li>Aire protégée</li>
        <li>Arpentage en cours</li>
        <li>Communauté</li>
        <li>Coordonées</li>
        <li>Cri-Naskapi</li>
        <li>Limite municipale</li>
        <li>Plan d'arpentage</li>
        <li>Parc national</li>
        <li>Parcelle</li>
        <li>Quadrilatère</li>
        <li>Réserve indienne</li>
        <li>Township</li>
    </ul>
</div>

<div>
  <select class="form-control" multiple="multiple" size="12" id="selQueryType">
    <option value="queryProtectedArea">Aire protégée</option>
    <option value="querySurveyProject">Arpentage en cours</option>
    <option value="queryCommunity">Communauté</option>
    <option value="queryCreeNaskapi">Cri-Naskapi</option>
    <option value="queryMunicipalBoundary">Limite municipale</option>
    <option value="querySurveyPlan">Plan d'arpentage</option>
    <option value="queryNationalPark">Parc national</option>
    <option value="queryParcel">Parcelle</option>
    <option value="queryQuad">Quadrilatère</option>
    <option value="queryIndianReserve">Réserve indienne</option>
    <option value="queryTownship">Township</option>
    <option value="queryCoordinate">Coordonnées</option>
  </select>

  <select class="form-control" multiple="multiple" size="12" id="selQueryType">
            <option value="queryProtectedArea">Aire protégée</option>
            <option value="querySurveyProject">Arpentage en cours</option>
            <option value="queryCommunity">Communauté</option>
            <option value="queryCreeNaskapi">Cri-Naskapi</option>
            <option value="queryMunicipalBoundary">Limite municipale</option>
            <option value="querySurveyPlan">Plan d'arpentage</option>
            <option value="queryNationalPark">Parc national</option>
            <option value="queryParcel">Parcelle</option>
            <option value="queryQuad">Quadrilatère</option>
            <option value="queryIndianReserve">Réserve indienne</option>
            <option value="queryTownship">Township</option>
            <option value="queryCoordinate">Coordonnées</option>
    </select>

</div>

`;

export const TABS_TEMPLATE = `

<div ng-controller="ResultsTabsCtrl as ctrl" layout="column" class="ng-scope">

    <div class="tabButton">
        <md-button ng-repeat="control in ctrl.tabs" name="{{ tabs }} 
            title="{{ control.title | translate }}"
            class="tablinks"
            ng-click="openTab(control.name)">
            {{ control.title | translate }}
        </md-button>
    </div>

    <div id="parcel" class="tabcontent">
        <h3>Parcelle</h3>
        <p>Info sur les parcelles</p>
    </div>

      <div id="survey" class="tabcontent">
        <h3>Arpentage en cours</h3>
        <p>Info sur les arpentages</p> 
     </div>

    <div id="plan" class="tabcontent">
        <h3>Plan d'arpentage</h3>
        <p>Info sur les plans</p>
    </div>

    <div id="township" class="tabcontent">
        <h3>Township</h3>
        <p>Info sur les townships</p>
    </div>

    <div id="admin" class="tabcontent">
        <h3>Administrative Area</h3>
        <p>Info sur les townships</p>
    </div>

    <div id="info" class="tabcontent">
        <h3>Informations additionnelles</h3>
        <p>Info sur les townships</p>
    </div>

    <section layout="row" flex></section>

</div>
`;

export const TOWNSHIP_SEARCH = ` 
<section layout="column" layout-sm="column" layout-align="center left" layout-wrap>
    <md-input-container class="md-block-input-section" flex-gt-sm>
        <label>{{ 'plugins.clssPlugin.inputSection' | translate }}</label>
        <input type="text" ng-model="color" required="" md-maxlength="10" id="sectionInput">
    </md-input-container>
    <md-input-container class="md-block-input-township" flex-gt-sm>
        <label>{{ 'plugins.clssPlugin.inputTownship' | translate }}</label>
        <input type="text" ng-model="color" required="" md-maxlength="10" id="townshipInput">
    </md-input-container>
    <md-input-container class="md-block-input-range" flex-gt-sm>
        <label>{{ 'plugins.clssPlugin.inputRange' | translate }}</label>
        <input type="text" ng-model="color" required="" md-maxlength="10" id="rangeInput">
    </md-input-container>
    <md-input-container class=md-block-input-direction" flex-gt-sm>
        <label>Direction</label>
        <md-select ng-model="user.direction" id=selectDirection>
            <md-option ng-repeat="direction in directions" value="{{direction.township}}">{{direction.township}}</md-option>
        </md-select>
    </md-input-container>
    <md-input-container class="md-block-input-meridian" flex-gt-sm>
        <label>{{ 'plugins.clssPlugin.inputMeridian' | translate }}</label>
        <input type="text" ng-model="color" required="" md-maxlength="10" id="meridianInput">
    </md-input-container>
</section>

<section layout="row" layout-sm="column" layout-align="center left" layout-wrap>
    <md-button 
        title="{{ 'plugins.clssPlugin.searchAria' | translate }}"
        class="bt1 ng-scope md-raised md-primary rv-search-button"
        aria-label="{{ 'plugins.clssPlugin.searchAria' | translate }}"
        ng-click="searchFunction()">
        {{ 'plugins.clssPlugin.buttonName' | translate }}
    </md-button>s
            
    <md-button 
        title="{{ 'plugins.clssPlugin.resetLabel' | translate }}"
        class="bt2 ng-scope md-raised md-primary rv-reset-button"
        ng-click="resetFunction()">
        {{ 'plugins.clssPlugin.resetButton' | translate }}
    </md-button>
</section>
`

export const PLAN_SEARCH = ` 
<section layout="column" layout-sm="column" layout-align="center left" layout-wrap>

    <md-input-container class=md-block-input-province" flex-gt-sm>
        <label>Province</label>
        <md-select ng-model="user.province" id=selectInput1>
            <md-option ng-repeat="province in provinces" value="{{province.canada}}">{{province.canada}}</md-option>
        </md-select>
    </md-input-container>

    <md-input-container class="md-block-input-land" flex-gt-sm>
        <label>{{ 'plugins.clssPlugin.canadaLand' | translate }}</label>
        <md-select ng-model="user.province" id=selectInput>
            <md-option ng-repeat="province in provinces" value="{{province.canada}}">{{province.canada}}</md-option>
        </md-select>
    </md-input-container>

    <md-input-container class="md-block-input-plan" flex-gt-sm>
        <label>{{ 'plugins.clssPlugin.inputText' | translate }}</label>
        <input type="text" ng-model="color" required="" md-maxlength="10" id="planInput1">
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
`

export const SIDE_NAV_TEMPLATE = `

<div ng-controller="SelectTabMenu as ctrl" layout="column" class="ng-scope">

    <md-sidenav class="md-sidenav-plugin" md-component-id="leftPanel" md-disable-backdrop="" md-whiteframe="4">

      <md-toolbar class="theme-blue">
        <h1 class="md-toolbar-tools"> Available Searches</h1>
      </md-toolbar>
 
      <md-content layout-margin="">
        <h3>1. Select Available Searches</h3>
        <md-list-item class="form-group" id="leftBox">
          <div class="md-list-item-text" layout="column">
            <span ng-click="getSearchInfo('middleBox')">­­­­{{ 'plugins.clssPlugin.sidePanel.protected' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.community' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.coords' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.creena' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.municipal' | translate }}</span>
            <span ng-click="getSearchInfo(subdivisionSearch)">­­­­{{ 'plugins.clssPlugin.sidePanel.subdivision' | translate }}</span>
            <span ng-click="getSearchInfo('planSearch')">­­­­{{ 'plugins.clssPlugin.sidePanel.plan' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.park' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.parcel' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.quads' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.reserve' | translate }}</span>
            <span ng-click="getSearchInfo('townshipSearch')">­­­­{{ 'plugins.clssPlugin.sidePanel.township' | translate }}</span>
            <span ng-click="getSearchInfo()">­­­­{{ 'plugins.clssPlugin.sidePanel.survey' | translate }}</span>
          </div>
        </md-list-item>

        <div id="subdivisionSearch" class="tabcontent2">
          <h3>Survey Plan</h3>
          ${TOWNSHIP_SEARCH}
        </div>

        <div *ngIf = "show" id="planSearch" class="tabcontent2">
          <h3>Survey Plan</h3>
          ${PLAN_SEARCH}
        </div>

        <div id="townshipSearch" class="tabcontent2">
          <h3>Survey Plan</h3>
          ${TOWNSHIP_SEARCH}
        </div>

        <md-button ng-click="toggleLeft()" class="md-accent">Close this Sidenav</md-button>
      </md-content>
    </md-sidenav>

    <md-content flex layout-padding>
      <div layout="column" layout-align="top center">
        <p>
          Developers can also disable the backdrop of the sidenav.<br/>
          This will disable the functionality to click outside to close the sidenav.
        </p>

        <div>
          <md-button ng-click="toggleLeft()" class="md-raised">Toggle Sidenav</md-button>
        </div>

      </div>
    </md-content>

</div>
`;


export const PROVINCE = {
    'fr-CA' : {
        'Canada': 'CA',
        'Alberta': 'AB',
        'Colombie-Britannique': 'BC',
        'Île-du-Prince-Édouard': 'PE',
        'Manitoba': 'MB',
        'Nouveau-Brunswick': 'NB',
        'Nouvelle-Écosse': 'NS',
        'Nunavut': 'NT',
        'Ontario': 'ON',
        'Québec': 'QC',
        'Saskatchewan': 'SK',
        'Terre-Neuve-et-Labrador': 'NL',
        'Territoire du Nord-Ouest': 'NT',
        'Yukon': 'YT'
    },
    'en-CA': {
        'Canada': 'CA',
        'Alberta': 'AB',
        'British-Colombia': 'BC',
        'Prince Edward Island': 'PE',
        'Manitoba': 'MB',
        'New Brunswick': 'NB',
        'Nova Scotia': 'NS',
        'Nunavut': 'NT',
        'Ontario': 'ON',
        'Quebec': 'QC',
        'Saskatchewan': 'SK',
        'Newfoundland and Labrador': 'NL',
        'Northwest Territories': 'NT',
        'Yukon': 'YT'
    }    
} 