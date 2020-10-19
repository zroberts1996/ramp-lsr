// Add all needed html template

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
    <md-select ng-model="user.province" id=selectProvince1 ng-change="checkProvince()" placeholder="Province">
        <md-option ng-repeat="province in ctrl.provinces" value="{{province}}" ng-click="ctrl.updateReserveBox(province)">{{province}}</md-option>
    </md-select>
</md-input-container>
`;

const SELECT_RESERVE = `
<md-input-container class="md-container">
    <md-select ng-model="user.reserve" id=selectReserve ng-disabled="ctrl.isDisabled"  placeholder="Canada Land (Select a province first)">
        <md-option ng-repeat="reserve in ctrl.reserves" value="{{reserve[1]}}" ng-click="ctrl.setSelectedReserve(reserve[1])">{{reserve[0]}}</md-option>
    </md-select>
</md-input-container>
`;

const INPUT_PLAN = `
<md-input-container class="md-container">
    <label>{{ 'plugins.clssPlugin.inputText' | translate }} </label>
    <input type="text" ng-model="user.input" required="" md-maxlength="10" id="planInput" name="input">
</md-input-container>
`;

const INPUT_PROJECT = `
<md-input-container class="md-container">
    <label>{{ 'plugins.clssPlugin.inputProject' | translate }} </label>
    <input type="text" ng-model="user.input" required="" md-maxlength="10" id="surveyInput">
</md-input-container>
`;

const INPUT_PARCEL = `
<md-input-container class="md-container">
    <label> Enter Parcel </label>
    <input type="text" ng-model="user.input" required="" md-maxlength="10" id="parcelInput">
</md-input-container>
`;

const INPUT_NTS_SHEET = `
<md-input-container class="md-container">
    <label> Enter NTS Map Sheet </label>
    <input type="text" ng-model="user.input" required="" md-maxlength="10" id="ntsSheetInput">
</md-input-container>
`;

const INPUT_COMMUNITY = `
<md-input-container class="md-container">
    <label> Enter Community Name </label>
    <input type="text" ng-model="user.input" required="" md-maxlength="10" id="communityInput">
</md-input-container>
`;

const SEARCH_BUTTON  = (oid) => `
<md-button 
    title="{{ 'plugins.clssPlugin.searchAria' | translate }}"
    class="bt1 ng-scope md-raised md-primary rv-search-button"
    aria-label="{{ 'plugins.clssPlugin.searchAria' | translate }}"
    ng-click="ctrl.launchSearchAction('${oid}')">
    <md-tooltip md-direction="bottom">Search</md-tooltip>
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
        ${SEARCH_BUTTON('plan')}
        
        ${RESET_BUTTON}
    </section>
</div>
<md-divider></md-divider>
`;

`<md-autocomplete flex class="rv-no-message-input rv-clearable-input"
            md-autofocus="true"
            md-menu-class="{{ ::self.geosearchMenuClass }}"
            md-search-text-change="self.service.searchValue.length === 0 ? self.onUpdateDebounce() : null"
            md-selected-item-change="self.onUpdateDebounce()"
            placeholder="{{ 'geosearch.text.placeholder' | translate }}"
            md-no-cache="true"
            md-selected-item="self.selectedOption"
            md-search-text="self.service.searchValue"
            md-items="option in self.onUpdateDebounce()"
            md-item-text="option">
            <md-item-template>
                <span md-highlight-text="self.service.searchValue">{{ option }}</span>
            </md-item-template>
        </md-autocomplete>`

export const SEARCH_TEMPLATE = ` 

<div class="rv-clss-top-filters" style="padding:0px; box-sizing: border-box;letter-spacing: .01em" ng-controller="SearchPanel as ctrl">

    <div layout-gt-sm="row" style="padding-bottom: 0px; padding-top: 10px;padding-left: 10px;height: 50px"; display:flex>
        
        <md-input-container md-no-float="" style="margin:0px;width: 70%;">
            <md-tooltip md-direction="bottom">Text</md-tooltip>
            <input ng-model="user.input" placeholder="Search" aria-label="Search" id='inputClss'>
        </md-input-container>
        
        <button style="margin-bottom: 20px" class="md-icon-button black md-button ng-scope md-ink-ripple" type="button" aria-label="CLSS Search" ng-click="ctrl.launchSearchAction(user.option)">
            <md-tooltip md-direction="bottom">Find</md-tooltip>
            <md-icon md-svg-src="action:search" class="ng-scope" role="img" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false"><g id="search"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></g></svg></md-icon>
        </button>
        
        <button style="margin-bottom: 20px" class="md-icon-button black md-button md-ink-ripple" type="button" aria-label="Clear filters" ng-click="ctrl.resetFunction()">
            <md-tooltip md-direction="bottom">Clear filters</md-tooltip>
            <md-icon md-svg-src="community:filter-remove" class="ng-scope" role="img" aria-hidden="true"><svg xmlns="http://www.w3.org/2000/svg" fit="" height="100%" width="100%" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24" focusable="false"><g id="filter-remove"><path d="M 14.7574,20.8284L 17.6036,17.9822L 14.7574,15.1716L 16.1716,13.7574L 19.0178,16.568L 21.8284,13.7574L 23.2426,15.1716L 20.432,17.9822L 23.2426,20.8284L 21.8284,22.2426L 19.0178,19.3964L 16.1716,22.2426L 14.7574,20.8284 Z M 2,2L 19.9888,2.00001L 20,2.00001L 20,2.01122L 20,3.99999L 19.9207,3.99999L 13,10.9207L 13,22.909L 8.99999,18.909L 8.99999,10.906L 2.09405,3.99999L 2,3.99999L 2,2 Z "></path></g></svg></md-icon>
        </button>
    </div>

    <md-divider class="rv-divider ng-scope"></md-divider>

    <div class="clss-block-options" style="background-color: beige;padding-left: 10px;">
        <div layout-gt-sm="row" style="padding-bottom: 10px; padding-top: 10px">
            <md-input-container class="md-container" style="width:55%; padding=2; margin:0px; font-size: 14px">
                <md-select ng-model="user.province" id=selectProvince ng-change="checkProvince()" placeholder="Province">
                <md-option ng-repeat="province in ctrl.provinces" value="{{province}}" ng-click="ctrl.updateReserveBox(province)">{{province}}</md-option>
                </md-select>
            </md-input-container>
            <md-input-container class="md-container" style="width:40%; padding=2px; margin:0px; font-size: 14px">
                <md-select ng-model="user.option" id=selectOption  placeholder="Type">
                    <md-option ng-repeat="type in ctrl.options" value="{{type[0]}}" ng-click="ctrl.setMainType(type[1]);ctrl.setSearchType(type[0])">{{type[2]}}</md-option>
                </md-select>
            </md-input-container>
        </div>

        <div layout-gt-sm="row" style="padding-bottom: 10px; padding-top: 10px">
            <md-input-container class="md-container" style="width:96%;padding=2;margin:0px;font-size: 14px">
                <md-select ng-model="user.reserve" id=selectReserve ng-disabled="ctrl.isDisabled"  placeholder="Canada Land (Select a province first)">
                    <md-option ng-repeat="reserve in ctrl.reserves" value="{{reserve[1]}}" ng-click="ctrl.setSelectedReserve(reserve[1])">{{reserve[0]}}</md-option>
                </md-select>
            </md-input-container>
            
        </div>
    </div>

</div>

`;

export const PROTECTED_AREA_TEMPLATE = ` 
<div class="rv-panel-content" ng-controller="SearchPanel as ctrl">
    <section layout="column" class="input-section"> 
        ${SELECT_PROVINCE}

        ${INPUT_PARCEL}

        ${INPUT_PLAN}

    </section>
    
    <section layout="row" layout-align="center left" layout-wrap>
        ${SEARCH_BUTTON('protected')}
            
        ${RESET_BUTTON}
    </section>
</div>
<md-divider></md-divider>
`;
export const SURVEY_PROGRESS_TEMPLATE = ` 
<div class="rv-panel-content" ng-controller="SearchPanel as ctrl">
    <section layout="column" class="input-section"> 
      
        ${SELECT_PROVINCE}

        ${SELECT_RESERVE}

        ${INPUT_PROJECT}
      
    </section>
    
    <section layout="row" layout-align="center left" layout-wrap>
        ${SEARCH_BUTTON('survey')}
        
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
        ${SEARCH_BUTTON('admin')}
            
        ${RESET_BUTTON}
    </section>
</div>
<md-divider></md-divider>
`;
export const PARCEL_TEMPLATE = ` 
<div class="rv-panel-content" ng-controller="SearchPanel as ctrl">
    <section layout="column" class="input-section"> 
      
        ${SELECT_PROVINCE}

        ${SELECT_RESERVE}

        ${INPUT_PLAN}
        ${INPUT_PARCEL}

    </section>
    
    <section layout="row" layout-align="center left" layout-wrap>
        ${SEARCH_BUTTON('parcel')}
        
        ${RESET_BUTTON}
    </section>
</div>
<md-divider></md-divider>
`;
    
export const MENU_BUTTON_RESULT = `
<button class="md-icon-button black md-button ng-scope md-ink-ripple" 
    ng-click="openSideMenu2()"
    ng-controller="MenuPanel2"
    style="float:left">
    <md-tooltip md-direction="bottom">Open Side Menu</md-tooltip>

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
            <form name="myForm">
                <label>
                    <input type="radio" ng-model="user.name" value="protected" ng-click="getSearchInfo($event.target.value); openSideMenu()">
                    {{ 'plugins.clssPlugin.sidePanel.protected' | translate }}
                </label><br/>
                <label>
                    <input type="radio" ng-model="user.name" value="community" ng-click="getSearchInfo($event.target.value); openSideMenu()">
                    {{ 'plugins.clssPlugin.sidePanel.community' | translate }}
                </label><br/>
                <label>
                    <input type="radio" ng-model="user.name"  ng-value="plan" name="surveyPlan" ng-click="getSearchInfo($event.target.name); openSideMenu()">
                    {{ 'plugins.clssPlugin.sidePanel.plan' | translate }}
                </label><br/>
                <label>
                    <input type="radio" ng-model="user.name" value="project" ng-click="getSearchInfo($event.target.value); openSideMenu()">
                    {{ 'plugins.clssPlugin.sidePanel.survey' | translate }}
                </label><br/>
                <label>
                    <input type="radio" ng-model="user.name" value="parcel" ng-click="getSearchInfo($event.target.value); openSideMenu()">
                    {{ 'plugins.clssPlugin.sidePanel.parcel' | translate }}
                </label><br/>
            </form>

          </div>
        </div>
    </md-sidenave>
`;

export const GRID_TEMPLATE = `

<div class="grid-wrapper">
    <div id="parcel" class="hidden" style="height: 100%;display:none"></div>
    <div id="project" class="hidden" style="height: 100%;display:none"></div>
    <div id="plan" class="hidden" style="height: 100%;display:none"></div>
    <div id="town" class="hidden" style="height: 100%;display:none"></div>
    <div id="admin" class=" active" style="height: 100%;display:block"></div>
    <div id="info" class="hidden" style="height: 100%;display:none"></div>
</div>
`;


export const GRID_TEMPLATE1 = `

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

            <div id="admin" class="tabcontent">
                <div id="admin" style="display:block" class="ag-theme-material">test</div>
            </div>

            <div id="township" class="tabcontent">
                <h3>Township</h3>
                <p>Info sur les townships</p>
            </div>

            <div id="admin1" class="tabcontent">
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

/*export const SIDE_NAV_TEMPLATE = `
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
`;*/

export const TYPE = {
    'fr-CA' : [
        ['Aire protégée', 0],
        ['Arpentage en cours', 3],
        ['Communauté', 1],
        ['Cri-Naskapi', 4],
        ['Limite municipale', 5],
        ['Lotissement', 6],
        ['Parc national', 7],
        ['Parcelle', 8],
        ["Plan d'arpentage", 2],
        ['Qadrilatère', 9],
        ['Réserve indienne', 10],
        ['Township', 11],
        ['Coordonnées', 12]
    ],
    'en-CA': [
        ['Community', 1],
        ['Cree-Naskapi', 4],
        ['Indian Reserve', 10],
        ['Municipal Boundary', 5],
        ['National Park', 7],
        ['Parcel', 8],
        ['Protected Area', 0],
        ['Quad', 9],
        ['Subdivision', 6],
        ['Survey Plan', 2],
        ['Survey in Progress', 3],
        ['Township', 11],
        ['Coordinates', 12],
    ]
}

export const TYPE1 = {
    'fr-CA' : {
        'Aire protégée': 0,
        'Arpentage en cours': 3,
        'Communauté': 1,
        'Cri-Naskapi': 4,
        'Limite municipale': 5,
        'Lotissement': 6,
        'Parc national': 7,
        'Parcelle': 8,
        "Plan d'arpentage": 2,
        'Qadrilatère': 9,
        'Réserve indienne': 10,
        'Township': 11,
        'Coordonnées': 12
    },
    'en-CA': {
        'Community': 1,
        'Cree-Naskapi': 4,
        'Indian Reserve': 10,
        'Municipal Boundary': 5,
        'National Park': 7,
        'Parcel': 8,
        'Protected Area': 0,
        'Quad': 9,
        'Subdivision': 6,
        'Survey Plan': 2,
        'Survey in Progress': 3,
        'Township': 11,
        'Coordinates': 12
    }
}


export const PROVINCE = {
    'fr-CA' : {
        'Canada': 'CA',
        'Alberta': 'AB',
        'Colombie-Britannique': 'BC',
        'Île-du-Prince-Édouard': 'PE',
        'Manitoba': 'MB',
        'Nouveau-Brunswick': 'NB',
        'Nouvelle-Écosse': 'NS',
        'Nunavut': 'NU',
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
        'Newfoundland and Labrador': 'NL',
        'Northwest Territories': 'NT',
        'Nova Scotia': 'NS',
        'Nunavut': 'NU',
        'Ontario': 'ON',
        'Quebec': 'QC',
        'Saskatchewan': 'SK',
        'Yukon': 'YT'
    }    
}
