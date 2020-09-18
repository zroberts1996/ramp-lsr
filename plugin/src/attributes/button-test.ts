
export class ZoomToElement {

    constructor(mapApi: any, globalId: string, province: string, eventType) {
        this.mapApi = mapApi;
        this.eventType = eventType
        this.getResult(this.mapApi, globalId, province);
    }
    getResult(mapApi, globalid, queryprov) {
        let query = new (<any>window).RAMP.GAPI.esriBundle.Query();
        let baseURL = "https://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
        let queryURL = baseURL + "WMB_Highlight_" + queryprov.substring(0,2) + "/MapServer/0";
        let queryTask = new (<any>window).RAMP.GAPI.esriBundle.QueryTask(queryURL);
        let whereclause = "GlobalID = '" + globalid + "'" 
        query.where = whereclause;
        query.returnGeometry = true;
        query.outFields = ["GlobalID"];

        if (this.eventType == 'click') {
            queryTask.execute(query, this.zoomFeature(mapApi))
        }
        else if (this.eventType == 'mouseover') {
            queryTask.execute(query, this.highlightFeature(mapApi))
        }
         
    };

    zoomFeature(mapApi) {
        return function(featureSet) {
            if (featureSet.features.length > 0) {
                let features = featureSet.features;
                let curfeature = features[0];
                let curfeaturegeom = curfeature.geometry;
                      
                if (curfeaturegeom.type == "polygon" || curfeaturegeom.type == "extent") {
                    let ext = new (<any>window).RAMP.GAPI.esriBundle.Extent(curfeature.geometry.getExtent().xmin, curfeature.geometry.getExtent().ymin, curfeature.geometry.getExtent().xmax, curfeature.geometry.getExtent().ymax, new(<any>window).RAMP.GAPI.esriBundle.SpatialReference({ wkid: 3978 }));
                    mapApi.esriMap.setExtent(ext, true);
                }
                else if ((curfeaturegeom.type == "point" || curfeaturegeom.type == "multipoint")
                            && curfeature.attributes.MINX
                            && curfeature.attributes.MINY
                            && curfeature.attributes.MAXX
                            && curfeature.attributes.MAXY) {
                     
                    let ext = new (<any>window).RAMP.GAPI.esriBundle.Extent(curfeature.attributes.MINX, curfeature.attributes.MINY, curfeature.attributes.MAXX, curfeature.attributes.MAXY, new (<any>window).RAMP.GAPI.esriBundle.SpatialReference({ wkid: 3978 }));
                    mapApi.esriMap.setExtent(ext, true);
                }
                mapApi.esriMap.graphics.clear();
            }
        }
    }

    highlightFeature(mapApi) {
        return function(featureSet) {
 
            let feature = featureSet.features[0];
            let poly = feature.geometry;

            const RAMP_GAPI = (<any>window).RAMP.GAPI.esriBundle;

            let symb = new RAMP_GAPI.SimpleFillSymbol(
                RAMP_GAPI.SimpleFillSymbol.STYLE_SOLID,
                new RAMP_GAPI.SimpleLineSymbol(
                    RAMP_GAPI.SimpleLineSymbol.STYLE_SOLID,
                    new RAMP_GAPI.Color([255,0,0]), 3          //Red
                ),
                new RAMP_GAPI.Color([125,125,125,0.35])      //Grey
            );

            let curhighfeature = new RAMP_GAPI.Graphic(poly, symb); 
            mapApi.esriMap.graphics.add(curhighfeature);
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