export class ZoomToElement {
    private baseURL: string = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
    private _esriBundle: any;

    constructor(mapApi: any, globalId: string, province: string, eventType) {
        this.mapApi = mapApi;
        this.eventType = eventType;
        this.province = province;
        this.globalId = globalId;
        this._esriBundle = (<any>window).RAMP.GAPI.esriBundle;
        this.getResult();
    }

    getResult() {
        let query = new this._esriBundle.Query();
        let queryURL = this.baseURL + "WMB_Highlight_" + this.province.substring(0,2) + "/MapServer/0";
        let queryTask = new this._esriBundle.QueryTask(queryURL);
        let whereclause = "GlobalID = '" + this.globalId + "'" 

        query.where = whereclause;
        query.returnGeometry = true;
        query.outFields = ["GlobalID"];

        if (this.eventType == 'click') {
            queryTask.execute(query, this.zoomFeature())
        }
        else if (this.eventType == 'mouseover') {
            queryTask.execute(query, this.highlightFeature())
        }
    };

    zoomFeature() {
        const esriBundle = this._esriBundle;
        const mapApi = this.mapApi;

        return function(featureSet) {
            if (featureSet.features.length > 0) {
                let features = featureSet.features;
                let curfeature = features[0];
                let curfeaturegeom = curfeature.geometry;
                      
                if (curfeaturegeom.type == "polygon" || curfeaturegeom.type == "extent") {
                    let ext = new esriBundle.Extent(curfeature.geometry.getExtent().xmin, curfeature.geometry.getExtent().ymin, curfeature.geometry.getExtent().xmax, curfeature.geometry.getExtent().ymax, new esriBundle.SpatialReference({ wkid: 3978 }));
                    mapApi.esriMap.setExtent(ext, true);
                }
                else if ((curfeaturegeom.type == "point" || curfeaturegeom.type == "multipoint")
                            && curfeature.attributes.MINX
                            && curfeature.attributes.MINY
                            && curfeature.attributes.MAXX
                            && curfeature.attributes.MAXY) {
                     
                    let ext = new esriBundle.Extent(curfeature.attributes.MINX, curfeature.attributes.MINY, curfeature.attributes.MAXX, curfeature.attributes.MAXY, new esriBundle.SpatialReference({ wkid: 3978 }));
                    mapApi.esriMap.setExtent(ext, true);
                }
            }
        }
    }

    highlightFeature() {
        const esriBundle = this._esriBundle;
        const mapApi = this.mapApi;
        
        return function(featureSet) {
            let feature = featureSet.features[0];
            let poly = feature.geometry;
            let symb = new esriBundle.SimpleFillSymbol(
                esriBundle.SimpleFillSymbol.STYLE_SOLID,
                new esriBundle.SimpleLineSymbol(
                    esriBundle.SimpleLineSymbol.STYLE_SOLID,
                    new esriBundle.Color([255,0,0]), 3          //Red
                ),
                new esriBundle.Color([125,125,125,0.35])        //Grey
            );

            let curhighfeature = new esriBundle.Graphic(poly, symb); 
            mapApi.esriMap.graphics.add(curhighfeature);
        }
    }
}

export interface ZoomToElement {
    mapApi: any;
    eventType: string;
    globalId: string, 
    province: string
}