import { AddLayer } from './add-layer';
import { PanelManager } from './attributes/panel-manager';
import { DrawManager } from './spatial/draw-manager';


export default class ClssPlugin {

    //private button: any;
    //private panel: any;
    
    /**
    * Plugin init
    * @function init
    * @param {Object} mapApi the viewer api
    */
    init(mapApi: any) {
        this.mapApi = mapApi;

        mapApi.getTranslatedText = function (stringId) {

            const template = `<div>{{ '` + stringId + `' | translate }}</div>`;
      
            let $el = $(template);
            this.$compile($el);
    
            const text = $el.text();
            $el = null;
      
            return text;
        }
         
        // how to get config
        this.config = this._RV.getConfig('plugins').clssPlugin;
        this.config.language = this._RV.getCurrentLang();
        this.config.url = this._RV.getConfig('services').geometryUrl;

        
        this.drawManager = new DrawManager(mapApi, this.config);
        //this.drawManager.setInactive();

        // create side menu button to toggle toolbar
        this.button = this.mapApi.mapI.addPluginButton(
            ClssPlugin.prototype.translations[this._RV.getCurrentLang()].placeHolder, 
            this.onMenuItemClick()
        );

        // set toolbar state
        this.button.isActive = true;

        //Add layer to page
        let testLayer = new AddLayer(mapApi, this.config);

        // create mapnav panel
        this.panelManager = new PanelManager(mapApi, this.config.language);
        this.panelManager.showPanel()
    }
    
    /**
     * Event to fire on side menu item click
     * @function onMenuItemClick
     * @return {function} the function to run
     */
    onMenuItemClick() {
        return () => {
            this.button.isActive = !this.button.isActive;
            this.button.isActive ? this.panelManager.showPanel() : this.panelManager.closePanel();
            console.log('side menu clicked');
        };
    }
}


export default interface ClssPlugin {
    mapApi: any,
    _RV: any,
    config: any,
    translations: any,
    panelManager: PanelManager;
    drawManager: DrawManager;
    button: any;
}


ClssPlugin.prototype.translations = {
    'en-CA': {
        placeHolder: 'CLSS Plugin',
        placeHolder2: 'Map test',
        tableTitle: 'Table Name',
        pluginName: 'Plan Search Service',
        buttonName: 'Search',
        inputText: 'Enter Plan Number',
        canadaLand: 'Canada Land',
        searchAria: 'Search Plan',
        resetLabel: 'Reset search',
        resetButton: 'Reset',
        planNumberTitle: 'Plan Number',
        descriptionTitle: 'Description',
        surveyDateTitle: 'Date of Survey',
        planDetailTitle: 'Plan Detail',
        bedfTitle: 'LTO',

        draw: {
            menu: 'Draw Toolbar',
            picker: 'Select colour',
            point: 'Draw point',
            line: 'Draw line',
            polygon: 'Draw polygon',
            edit: 'Edit existing drawing',
            measure: 'Show/Hide distances',
            extent: 'Erase selected graphics',
            write: 'Save graphics file',
            read: 'Upload graphics file',
        },

        sidePanel: {
            protected: 'Protected Area',
            survey: 'Surveys in Progress',
            community: 'Community',
            coords: 'Coordinates',
            creena: 'Cree-Naskapi', 
            municipal: 'Municipal Boundary',
            subdivision: 'Subdivision',
            plan: 'Survey Plan',
            park: 'National Park',
            parcel: 'Parcel',
            quads: 'Quad',
            reserve: 'Indian Reserve',
            township: 'Township',
        },

        tabs: {
            parcelTab: 'Parcel',
            surveyTab: 'Surveys in Progress',
            planTab: 'Survey Plan',
            townshipTab: 'Township',
            adminTab: 'Administrative Area',
            infoTab: 'Additional Info',
        }
    },
    'fr-CA': {
        placeHolder: 'Plugin du SATC',
        placeHolder2: 'Carte test',
        tableTitle: 'Nom de la table',
        pluginName: 'Recherche de plans',
        buttonName: 'Rechercher',
        inputText: 'Numéro de plan',
        canadaLand: 'Terre du Canada',
        searchAria: 'Chercher un plan',
        resetLabel: 'Réinitialiser la recherche',
        resetButton: 'Réinitialiser',
        planNumberTitle: 'Numéro du plan',
        descriptionTitle: 'Description',
        surveyDateTitle: "Date de l'arpentage",
        planDetailTitle: 'Détail du plan',
        bedfTitle: 'BEDF',

        draw: {
            menu: 'Barre de dessin',
            picker: 'Sélectionner la couleur',
            point: 'Dessiner point',
            line: 'Dessiner ligne',
            polygon: 'Dessiner polygon',
            edit: 'Éditer les dessins existant',
            measure: 'Afficher/Cacher les distances',
            extent: 'Effacer les graphiques sélectionnés',
            write: 'Sauvegarder le fichier de graphiques',
            read: 'Charger le fichier de graphiques',
        },
    
        sidePanel: {
            protected: 'Aire protégée',
            survey: 'Arpentage en cours',
            community: 'Communauté',
            coords: 'Coordonnées',
            creena: 'Cri-Naskapi', 
            municipal: 'Limite municipale',
            subdivision: 'Lotissement',
            plan: "Plan d'arpentage",
            park: 'Parc national',
            parcel: 'Parcelle',
            quads: 'Quadrilatère',
            reserve: 'Réserve indienne',
            township: 'Township',
        },
        tabs: {
            parcelTab: 'Parcelle',
            surveyTab: 'Arpentage en cours',
            planTab: "Plan d'arpentage",
            townshipTab: 'Township',
            adminTab: 'Région adminmistrative',
            infoTab: 'Informations supplémentaires',
        }
    }
};

(<any>window).clssPlugin = ClssPlugin;
