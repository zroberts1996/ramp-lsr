dojo.require("esri.map");
dojo.require("esri.toolbars.navigation");
dojo.require("esri.toolbars.draw");
dojo.require("esri.symbol");
dojo.require("esri.geometry");
//dojo.require("esri.dijit.Popup");
dojo.require("esri.layers.FeatureLayer");
dojo.require("esri.layers.WMSLayer");
//dojo.require("esri.dijit.Legend");
dojo.require("esri.dijit.Measurement");
dojo.require("esri.dijit.Scalebar");
dojo.require("esri.SpatialReference");
//dojo.require("esri.layers.agsdynamic");
//dojo.require("esri.layers.LayerInfo");
//dojo.require("esri.dijit.Print");
dojo.require("esri.tasks.PrintTask");
dojo.require("esri.tasks.query");
dojo.require("esri.tasks.geometry");
dojo.require("esri.config");

var map;
var curProv;
var curProvName;
var baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
var basePlanURL = "plan-eng.php?id=";
var baseSIPURL = "project-projet-eng.php?pid=";
var activeTab = 0;
var tabNames = new Array ("queryParcel", "querySIP", "queryPlan", "queryTownship", "queryAdminArea");
var fullextent;
var navToolbar;
var drawToolbar;
var basemap;
var businessmap;
var mapOp = 0;
var geomSrvc;
var currCanCode = "";

var printURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
var printTask;
//var printer;

//var lang = 
var curhighfeature;
var legend;
var legendLayers = [];
var mapLayers = [];

//var spatialref = new esri.SpatialReference({ wkid:102002 });

function init() {
   var popup = new esri.dijit.Popup({
          fillSymbol: new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID, new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_SOLID, new dojo.Color([255,0,0]), 2), new dojo.Color([255,255,0,0.25]))
        }, dojo.create("div"));
   
   var spatRef = new esri.SpatialReference(3978);
   var initExtent = new esri.geometry.Extent( {xmin: -2780809.0, ymin: -845634.0, xmax: 3473952.0, ymax: 4139125.0, spatialReference: spatRef});
   fullextent = initExtent; // Gido

   map = new esri.Map("mapDiv",{
                        logo:false,
                        nav:true,
                        infoWindow:popup,
                        sliderStyle:"large",
                        extent:initExtent,
                        fitExtent:false
                     });
   navToolbar = new esri.toolbars.Navigation(map);
   drawToolbar = new esri.toolbars.Draw(map);
   
   esri.bundle.toolbars.draw.complete = "Double-click to complete";
   esri.bundle.toolbars.draw.freehand = "Press down to start and let go to finish";
   esri.bundle.toolbars.draw.resume = "Click to continue drawing";
   esri.bundle.toolbars.draw.start = "Click to start drawing";
   
   //esri.config.defaults.io.proxyUrl = "proxyinternet.nrcan.gc.ca"
   //esri.config.defaults.io.corsEnabledServers = ["proxyinternet.nrcan.gc.ca"];
      
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var businessURL = baseURL + "NRCan_SGB_Business_LCC/MapServer";
   businessmap = new esri.layers.ArcGISDynamicMapServiceLayer(businessURL);
   var visLayers = [1,3,4,6,7,9,10,12,13,15,16,18,19,21,22,24,25,27,28,30,31,33,34,36,37,39,40,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,63,65,66,67,68,69,72,73,74,75,76,78,79,80,81,82,83,84,85,86,91,95,97];
   businessmap.setVisibleLayers(visLayers);

   var cbmLyrInfo = new esri.layers.WMSLayerInfo({
      name: 'cbm',
      title: 'CBMT'
   });
   var resourceInfo = {
      extent: new esri.geometry.Extent( {xmin: -2780809.0, ymin: -845634.0, xmax: 3473952.0, ymax: 4139125.0, wkid: 3978}),
      layerInfos: ['cbmLyrInfo']
   };
   
   var cbmBasemap = new esri.layers.WMSLayer("http://maps.geogratis.gc.ca/wms/CBMT", {
      resourceInfo: resourceInfo,
      visibleLayers: ['CBMT']
   });

   //var basemapURL = "http://geoappext.nrcan.gc.ca/arcgis/rest/services/BaseMaps/CBMT3978/MapServer";
   //basemap = new esri.layers.ArcGISTiledMapServiceLayer(basemapURL);

   //map.addLayers([basemap, businessmap]);
   map.addLayers([cbmBasemap, businessmap]);
   geomSrvc = new esri.tasks.GeometryService("http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/Utilities/Geometry/GeometryServer");

   dojo.connect(map, "onExtentChange", function(){
      var curProvQuery = new esri.tasks.Query();
      var curProvQueryTask = new esri.tasks.QueryTask(baseURL + "NRCan_SGB_Provinces/MapServer/0");
      
      //alert(map.layerIds.length.toString());
      //alert(map.graphicsLayerIds.length.toString());
      //businessmap.setVisibleLayers(visLayers);
      
      var pntCenter = map.extent.getCenter();
      curProvQuery.geometry = new esri.geometry.Point(pntCenter.x, pntCenter.y, new esri.SpatialReference({ wkid: 3978 }));
      curProvQuery.returnGeometry = false;
      curProvQuery.outFields = ["CODE", "NAME_EN"];
      curProvQueryTask.execute(curProvQuery, updateCurrentProvince);
      
      if (map.loaded)
      { 
         var mp = map.extent.getCenter();
         updateCoordinates(mp);
         //var mapscaletext = document.createTextNode(map.getScale());
         //var mapscalenode = dojo.byId("mapScale");
         //mapscalenode.replaceChild(mapscaletext, mapscalenode.childNodes[0]);
      }
      
      var currScale = map.getScale(); 
      if (currScale > 100) { var scaleDinominator = 100; }
      if (currScale > 1000) { var scaleDinominator = 1000; }
      if (currScale > 10000) { var scaleDinominator = 10000; }
      if (currScale > 100000) { var scaleDinominator = 100000; }
      if (currScale > 1000000) { var scaleDinominator = 1000000; }
      if (currScale > 10000000) { var scaleDinominator = 10000000; }
      currScale = parseInt(currScale / scaleDinominator) * scaleDinominator;
      dojo.byId("txtPrintScale").value = currScale.toString();
   });


   //var resizeTimer;
   dojo.connect(map, "onLoad", function(map) {
      //fullextent = map.extent; // Gido
      
      var scalebar = new esri.dijit.Scalebar({                
         map: map,
         attachTo: "bottom-left",
         scalebarUnit: "metric"
      });
   });

   //get mapPoint from event and display the mouse coordinates
   dojo.connect(map, "onMouseMove", function(evt){
      if (map.loaded)
      { 
         var mp = evt.mapPoint;
         updateCoordinates(mp);
      }
   });
   
   dojo.connect(map,"onClick",function(evt){});

   dojo.connect(drawToolbar, "onDrawEnd", selectFeatures);

   var urlObject = esri.urlToObject(document.location.href);
   if (urlObject.query)
   {
      if (urlObject.query.can)
      {
         var featuretype = "can";
         var tmpkey = urlObject.query.can;
         var pos = tmpkey.indexOf("_");
         if (pos > 1) {
            var keyPart1 = tmpkey.substring(0, pos);
            var keyPart2 = tmpkey.substring(pos + 1);
            key = keyPart1 + "/" + keyPart2;
         }
         else {
            key = tmpkey;
         }
         var alt = "";
      }
      if (urlObject.query.prj)
      {
         var featuretype = "prj";
         var tmpkey = urlObject.query.prj;
         var pos = tmpkey.indexOf("_");
         if (pos > -1) {
            var key = tmpkey.substring(0, pos);
            var alt = tmpkey.substring(pos + 1);
         } else {
            var key = urlObject.query.prj;
            var alt = "";
         }
      }
      if (urlObject.query.pln)
      {
         var featuretype = "pln";
         var tmpkey = urlObject.query.pln;
         var pos = tmpkey.indexOf("_");
         if (pos > -1) {
            var key = tmpkey.substring(0, pos);
            var alt = tmpkey.substring(pos + 1);
         } else {
            var key = urlObject.query.pln;
            var alt = "";
         }
      }
      zoomOnLoad(featuretype, key, alt);
   }
}

dojo.addOnLoad(init);

function updateCoordinates(mp)
{
   var cs = map.spatialReference;
   //var sourcecs = new Proj4js.Proj('ESRI:102002');
   var sourcecs = new Proj4js.Proj('ESRI:3978');
   var destcsLL = new Proj4js.Proj('EPSG:4269');
   var destcsUTM;
   var pt = new Proj4js.Point(mp.x, mp.y);
   var ptUTM = new Proj4js.Point(mp.x, mp.y);
   var latdeg;
   var latmin;
   var latsec;
   var longdeg;
   var longmin;
   var longsec;
   var north;
   var east;
   var zone;
   var szone;
   var slatmin;
   var slatsec;
   var slongmin;
   var slongsec;
   
   Proj4js.transform(sourcecs, destcsLL, pt);
   
   latdeg = parseInt(pt.y);
   latmin = parseInt((pt.y - latdeg)*60);
   latsec = parseInt((pt.y - (latdeg + latmin/60)) * 3600);

   longdeg = parseInt(Math.abs(pt.x));
   longmin = parseInt((Math.abs(pt.x) - longdeg) * 60);
   longsec = parseInt((Math.abs(pt.x) - (longdeg + longmin/60)) * 3600);

   if (latmin < 10)
      slatmin = "0" + latmin.toString();
   else
      slatmin = latmin.toString();

   if (latsec < 10)
      slatsec = "0" + latsec.toString();
   else
      slatsec = latsec.toString();

   if (longmin < 10)
      slongmin = "0" + longmin.toString();
   else
      slongmin = longmin.toString();

   if (longsec < 10)
      slongsec = "0" + longsec.toString();
   else
      slongsec = longsec.toString();

   zone = Math.floor((pt.x + 180) / 6) + 1;
   
   if (zone < 10)
      szone = "0" + zone.toString();
   else
      szone = zone.toString();
   
   destcsUTM = new Proj4js.Proj('EPSG:269' + szone);
   
   Proj4js.transform(sourcecs, destcsUTM, ptUTM);
   
   var lattext = document.createTextNode(latdeg + "\u00B0 " + slatmin + "' " + slatsec + "\"" + " North");
   var latnode = dojo.byId("curLat");
   latnode.replaceChild(lattext, latnode.childNodes[0]);

   var longtext = document.createTextNode(longdeg + "\u00B0 " + slongmin + "' " + slongsec + "\"" + " West");
   var longnode = dojo.byId("curLong");
   longnode.replaceChild(longtext, longnode.childNodes[0]);

   //dojo.byId("curLat").textContent = latdeg + "&deg; " + slatmin + "' " + slatsec + "\"" + " North";
   //dojo.byId("curLong").textContent = longdeg + "&deg; " + slongmin + "' " + slongsec + "\"" + " West";
   
   var northtext = document.createTextNode(Math.round(ptUTM.y));
   var northnode = dojo.byId("curNorth");
   northnode.replaceChild(northtext, northnode.childNodes[0]);

   var easttext = document.createTextNode(Math.round(ptUTM.x));
   var eastnode = dojo.byId("curEast");
   eastnode.replaceChild(easttext, eastnode.childNodes[0]);

   var zonetext = document.createTextNode(zone);
   var zonenode = dojo.byId("curUTMZone");
   zonenode.replaceChild(zonetext, zonenode.childNodes[0]);

   //dojo.byId("curNorth").textContent = Math.round(ptUTM.y);
   //dojo.byId("curEast").textContent = Math.round(ptUTM.x);
   //dojo.byId("curUTMZone").textContent = zone;
}

function selectFeatures(ext) {
   if (mapOp == 0) {
      baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
      var parcelQuery = new esri.tasks.Query();
      var parcelQueryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/11";
      var parcelQueryTask = new esri.tasks.QueryTask(parcelQueryURL);
      
      var sipQuery = new esri.tasks.Query();
      var sipQueryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/12";
      var sipQueryTask = new esri.tasks.QueryTask(sipQueryURL);
      
      var planQuery = new esri.tasks.Query();
      var planQueryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/13";
      var planQueryTask = new esri.tasks.QueryTask(planQueryURL);
      
      var townshipQuery = new esri.tasks.Query();
      var townshipQueryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/10";
      var townshipQueryTask = new esri.tasks.QueryTask(townshipQueryURL);
      
      var adminAreaQuery = new esri.tasks.Query();
      //var adminAreaQueryURL = baseURL + "WMB_Query_Support/MapServer/0";
      var adminAreaQueryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/3";
      var adminAreaQueryTask = new esri.tasks.QueryTask(adminAreaQueryURL);
      
      parcelQuery.geometry = ext;
      parcelQuery.returnGeometry = false;
      parcelQuery.outFields = ["PARCELDESIGNATOR", "PLANNO", "PIN", "GlobalID", "GlobalID_PLA", "PROVINCE", "PARCELFC_ENG", "PARCELFC_FRA", "REMAINDERIND", "REMAINDERIND_ENG", "REMAINDERIND_FRA"];
      parcelQueryTask.execute(parcelQuery, updateParcelTable);
      
      sipQuery.geometry = ext;
      sipQuery.returnGeometry = false;
      sipQuery.outFields = ["PROJECTNUMBER", "DESCRIPTION", "GlobalID", "URL", "PROVINCE"];
      sipQueryTask.execute(sipQuery, updateSIPTable);
      
      planQuery.geometry = ext;
      planQuery.returnGeometry = false;
      planQuery.outFields = ["PLANNO", "P2_DESCRIPTION", "P3_DATESURVEYED", "GlobalID", "PROVINCE", "SURVEYOR", "ALTERNATEPLANNO"];
      planQueryTask.execute(planQuery, updatePlanTable);
      
      townshipQuery.geometry = ext;
      townshipQuery.returnGeometry = false;
      townshipQuery.outFields = ["TOWNSHIPSECTION", "TP", "RANGE", "DIRECTION", "MERIDIAN", "TOWNSHIP", "GlobalID", "PROVINCE"];
      townshipQueryTask.execute(townshipQuery, updateTownshipTable);
      
      adminAreaQuery.geometry = ext;
      adminAreaQuery.returnGeometry = false;
      //adminAreaQuery.outFields = ["ADMINAREAID", "ENGLISHNAME", "ADMINAREATYPE", "ADMINAREATYPE_DESC", "GlobalID", "PROVINCE"];
      adminAreaQuery.outFields = ["ENGLISHNAME", "PROVINCE", "GlobalID"];
      adminAreaQueryTask.execute(adminAreaQuery, updateAdminAreaTable);
   
      $('#resultTabs').trigger({
			type: "wb-select.wb-tabs",
			id: "tab_2_1"
		}); //;
      $('#tab_2_1').focus();
   } else {
      mapOp = 0;
      //alert(ext.type);
      if (ext.type == "polyline") {
         var params = new esri.tasks.LengthsParameters();
         params.calculationType = 'planar';
         params.geodesic = false;
         params.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
         params.polylines = [ext];
         geomSrvc.lengths(params, showDistance);
      }
      if (ext.type == "polygon") {
         var areasAndLengthParams = new esri.tasks.AreasAndLengthsParameters();
         areasAndLengthParams.calculationType = 'planar';
         areasAndLengthParams.lengthUnit = esri.tasks.GeometryService.UNIT_METER;
         areasAndLengthParams.areaUnit = esri.tasks.GeometryService.UNIT_ACRES;
         geomSrvc.simplify([ext], function(simplifiedGeometries) {
            areasAndLengthParams.polygons = simplifiedGeometries;
            geomSrvc.areasAndLengths(areasAndLengthParams, showArea);
        });
      }
   }
   
   drawToolbar.deactivate();
}

function showDistance(result) {
   $('#resultTabs').trigger({
			type: "wb-select.wb-tabs",
			id: "tab_2_6"
		});;
   $('#tab_2_6').focus();
   updateAdditionalInfoTable(result.lengths[0], "D");
}

function showArea(result) {
   //alert(result.areas[0]);
   $('#resultTabs').trigger({
			type: "wb-select.wb-tabs",
			id: "tab_2_6"
		});
   $('#tab_2_6').focus();
   updateAdditionalInfoTable(result.areas[0], "A");
}

function updateCurrentProvince(featureSet) {
   var features = featureSet.features;
   var provTerrSel = dojo.byId("provTerrSel");

   curfeature = features[0];
   curatts = curfeature.attributes;

   if (map.getScale() < 20000000) {
      curProv = curatts["CODE"];
      curProvName = curatts["NAME_EN"];
   }
   else {
      curProv = "CA";
      curProvName = "Canada";
   }

   //dojo.byId("featureInfoDiv").innerHTML = curProvName;
   dojo.byId("mapDiv").title = curProvName;

//            dojo.byId("provDiv").innerHTML = "Map of " + curProvName;
//            dojo.byId("mapDiv").title = "Map of " + curProvName;

            for (var i = 0; i < provTerrSel.length; i++) {
               if (provTerrSel[i].value == curProv) {
                  provTerrSel.selectedIndex = i;
                  break;
               }
            }
            showQueries(curProv);

}

function zoomFeature(globalid, province)
{
   if (province == "XX") {
      var minMax = globalid;
      console.log("twp 1");
      var minMaxArray = minMax.split(",");
      console.log("twp 2");
      var minMaxExtent = new esri.geometry.Extent( minMaxArray[0], minMaxArray[1], minMaxArray[2], minMaxArray[3], new esri.SpatialReference({ wkid: 3978 })); 
      console.log("twp 3");
      map.setExtent(minMaxExtent, true);
      map.graphics.clear();
      console.log("twp 4");
   } else {
   var province2 = unescape(province);
   var provincearr = province2.split(" ");
   var queryprov;
   
   for (var i = 0; i < provincearr.length; i++) {
      if (provincearr[i] != "CA") {
         queryprov = provincearr[i];
         break;
      }
   }            
   
   var query = new esri.tasks.Query();
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var queryURL = baseURL + "WMB_Highlight_" + queryprov + "/MapServer/0";

   var queryTask = new esri.tasks.QueryTask(queryURL);
   var queryName;
   
   var tempworkaround = (new Date()).getTime();
   var whereclause = "GlobalID = '" + globalid + "'" + " AND " + tempworkaround + "=" + tempworkaround;
   query.where = whereclause;
   query.returnGeometry = true;
   query.outFields = ["GlobalID"];
   queryTask.execute(query, zoomFeature2);
   }
}

function zoomFeature2(featureSet)
{ 
  //alert("zoomFeature2");
  if (featureSet.features.length > 0) {
   var features = featureSet.features;
   var curfeature = features[0];
   var curfeaturegeom = curfeature.geometry;

   //alert(curfeature.attributes.GlobalID);
   //alert(curfeaturegeom.type);

   if (curfeaturegeom.type == "polygon" || curfeaturegeom.type == "extent")
   {
      //alert(curfeature.geometry.getExtent().xmin.toString() + " : " + curfeature.geometry.getExtent().ymin.toString());
      //map.setExtent(curfeature.geometry.getExtent(), true);
      var ext = new esri.geometry.Extent(curfeature.geometry.getExtent().xmin, curfeature.geometry.getExtent().ymin, curfeature.geometry.getExtent().xmax, curfeature.geometry.getExtent().ymax, new esri.SpatialReference({ wkid: 3978 }));
      map.setExtent(ext, true);
   }
   else if ((curfeaturegeom.type == "point" || curfeaturegeom.type == "multipoint")
               && curfeature.attributes.MINX
               && curfeature.attributes.MINY
               && curfeature.attributes.MAXX
               && curfeature.attributes.MAXY)
   {
      var ext = new esri.geometry.Extent(curfeature.attributes.MINX, curfeature.attributes.MINY, curfeature.attributes.MAXX, curfeature.attributes.MAXY, new esri.SpatialReference({ wkid: 3978 }));
      map.setExtent(ext, true);
   }
   
   //Added this clear() to alleviate an issue in IE where a user zooms to a result and the highlight remains on screen - JH, 2013-09-09
   map.graphics.clear();
  } else {
   zoomOnLoad("can", currCanCode, "");
  }
}

function zoomTownship(recno, reg) {
  baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
  var query = new esri.tasks.Query();
  var queryURL = baseURL + "WMB_Township_" + reg + "/MapServer/0";
  var queryTask = new esri.tasks.QueryTask(queryURL);
     
  var tempworkaround = (new Date()).getTime();
  var whereclause = "OBJECTID = " + recno + " AND " + tempworkaround + "=" + tempworkaround;
       
  query.where = whereclause;
  query.returnGeometry = true;
  query.outFields = ["OBJECTID"];
  queryTask.execute(query, zoomTownshipResult);
  //alert(queryURL);
}

function zoomTownship2(minMax, aProv) {
  var MinMaxArray = minMax.split(",");
  //var minMaxSpatRef = new esri.SpatialReference(3978);
  var minMaxExtent = new esri.geometry.Extent( MinMaxArray[0], MinMaxArray[1], MinMaxArray[2], MinMaxArray[3], new esri.SpatialReference({ wkid: 3978 })); 
  map.setExtent(minMaxExtent);
}
    
function zoomTownshipResult(featureSet) {
  var features = featureSet.features;
  var curfeature = features[0];
  var curfeaturegeom = curfeature.geometry;
      
  if (curfeaturegeom.type == "polygon" || curfeaturegeom.type == "extent") {
    map.setExtent(curfeature.geometry.getExtent(), true);
  }
}

function zoomExtent()
{
   map.setExtent(fullextent, true);

   //navToolbar.zoomToFullExtent();
}

function zoomIn()
{
   drawToolbar.deactivate();
   navToolbar.activate(esri.toolbars.Navigation.ZOOM_IN);
   map.enableKeyboardNavigation();
}

function zoomOut()
{
   navToolbar.activate(esri.toolbars.Navigation.ZOOM_OUT);
   map.enableKeyboardNavigation();
}

function pan()
{
   drawToolbar.deactivate();
   navToolbar.activate(esri.toolbars.Navigation.PAN);
   map.enableKeyboardNavigation();
}

function zoomPrevious()
{
   navToolbar.zoomToPrevExtent();
}

function zoomNext()
{
   navToolbar.zoomToNextExtent();
}

function selectRect()
{
   navToolbar.deactivate();
   drawToolbar.activate(esri.toolbars.Draw.EXTENT);
   map.enableKeyboardNavigation();
}

function selectPoly()
{
   navToolbar.deactivate();
   drawToolbar.activate(esri.toolbars.Draw.POLYGON);
   map.enableKeyboardNavigation();
}

function selectFreehand()
{
   navToolbar.deactivate();
   drawToolbar.activate(esri.toolbars.Draw.FREEHAND_POLYGON);
   map.enableKeyboardNavigation();
}

function selectExtent()
{
   if (map.getScale() < 50000) {
      selectFeatures(map.extent);
      $('#resultTabs').trigger({
			type: "wb-select.wb-tabs",
			id: "tab_2_1"
		});
      $('#tab_2_1').focus();
   }
   else
      alert("Unavailable at this zoom level.  Please zoom in.");
}

function measureLength() {
   mapOp = 1;
   
   navToolbar.deactivate();
   drawToolbar.activate(esri.toolbars.Draw.POLYLINE);
   map.enableKeyboardNavigation();
}

function measureArea() {
   mapOp = 1;
   
   navToolbar.deactivate();
   drawToolbar.activate(esri.toolbars.Draw.POLYGON);
   map.enableKeyboardNavigation();
}

function measure()
{
   alert("Not implemented");
}

function print()
{
   dojo.byId("printInfo").innerText = "Printing...";
   printTask = new esri.tasks.PrintTask(printURL);
   var params = new esri.tasks.PrintParameters();
   var template = new esri.tasks.PrintTemplate();
   
   var printTitle = dojo.byId("txtPrintTitle").value;
   var printSize = dojo.byId("cmbPrintSize")[dojo.byId("cmbPrintSize").selectedIndex].value;
   var printOrientation = dojo.byId("cmbPrintOrientation")[dojo.byId("cmbPrintOrientation").selectedIndex].value;
   var printScale = dojo.byId("txtPrintScale").value;
   
   //alert(printSize + ": " + printOrientation + ": " + printTitle);

   template.exportOptions = {
      width: 595,
      height: 842,
      dpi: 150
   };
   template.layoutOptions = {
      titleText: printTitle,
      scalebarUnit: "Kilometers",
      legendLayers: []
   };
   template.format = "PDF";
   template.layout = printSize + " " + printOrientation;
   //template.preserveScale = true;
   
   template.outScale = printScale;

   params.map = map;
   params.template = template;
      
   //
   //alert(printScale + ", " + printNorth);
   printTask.execute(params, printResult, printError);
}

function printResult(result){
	dojo.byId("printInfo").innerText = "";
	window.open(result.url);
        //alert(result.url);
   //console.log(result.url)
}
function printError(result){
   //console.log(result);
}


function showLegend() 
{
   alert("Not implemented");
}

function showHelp()
{
   alert("Not implemented");
}

function getTextContent(graphic) {
   //var attr = new Array(graphic.attributes.ENGLISHNAME, graphic.attributes.FRENCHNAME, graphic.attributes.ADMINAREAID);
   var attr = new Array(graphic.attributes.PARCELDESIGNATOR, graphic.attributes.PLANNO, graphic.attributes.GEOADMINCODE);
   var content;

/*
   if(attr[1]){
      content = "
<b>" + attr[1]; } */ content = "<span style='font-weight: bold'>" +
		attr[2] + "</span><br />" + attr[0] + "<br />" + attr[1];
   return content;
}

function pointToExtent(map, point, toleranceInPixel) {
   var pixelWidth = map.extent.getWidth() / map.width;
   var toleranceInMapCoords = toleranceInPixel * pixelWidth;
   return new esri.geometry.Extent( point.x - toleranceInMapCoords,
      point.y - toleranceInMapCoords,
      point.x + toleranceInMapCoords,
      point.y + toleranceInMapCoords,
      map.spatialReference );
}

function showQueries(rg)
{
   var rg2 = rg.toUpperCase();
   
   var queryType = dojo.byId("selQueryType");

   curProv = rg2;
   
   queryType.selectedIndex = -1;
   
   while (queryType.length > 0)
   {
      queryType.remove(0);
   }
   var newOption;

   if (rg2 == "AB")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryMunicipalBoundary","Municipal Boundary"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryTownship","Township"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryMunicipalBoundary","Municipal Boundary"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryTownship","Township"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "BC")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryMunicipalBoundary","Municipal Boundary"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryMunicipalBoundary","Municipal Boundary"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "MB")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryTownship","Township"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryTownship","Township"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "NB")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryProtectedArea","Protected Area"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProtectedArea","Protected Area"],["queryProject","Surveys in Progress"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "NL")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "NS")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "NT")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryCommunity","Community"],["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryProtectedArea","Protected Area"],["queryQuad","Quad"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProtectedArea","Protected Area"],["queryProject","Surveys in Progress"],["queryCommunity","Community"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryQuad","Quad"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "NU")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryCommunity","Community"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryProtectedArea","Protected Area"],["queryQuad","Quad"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProtectedArea","Protected Area"],["queryProject","Surveys in Progress"],["queryCommunity","Community"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryQuad","Quad"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "ON")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "PE")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "QC")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryCreeNaskapi","Cree-Naskapi"],["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryCreeNaskapi","Cree-Naskapi"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "SK")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryTownship","Township"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProject","Surveys in Progress"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryIndianReserve","Indian Reserve"],["queryTownship","Township"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "YT")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryCommunity","Community"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryProtectedArea","Protected Area"],["queryQuad","Quad"],["queryPlan","Survey Plan"],["queryProject","Surveys in Progress"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryProtectedArea","Protected Area"],["queryProject","Surveys in Progress"],["queryCommunity","Community"],["queryNationalPark","National Park"],["queryParcel","Parcel"],["queryPlan","Survey Plan"],["queryQuad","Quad"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text();
         try
         {
            queryType.add(newOption);
         }
         catch (e)
         {
            queryType.appendChild(newOption);
         }
      } 
   }
   else if (rg2 == "CA")
   {
      var queryList = new Array();
      if (1 == 1)
         queryList = [["queryCommunity","Community"],["queryIndianReserve","Indian Reserve"],["queryNationalPark","National Park"],["queryMunicipalBoundary","Municipal Boundary"],["queryQuad","Quad"],["queryCoordinate","Coordinates"]];
      else
         queryList = [["queryCommunity","Community"],["queryMunicipalBoundary","Municipal Boundary"],["queryNationalPark","National Park"],["queryQuad","Quad"],["queryIndianReserve","Indian Reserve"],["queryCoordinate","Coordinates"]];
      
      for (var i = 0; i < queryList.length; i++)
      {
         newOption = document.createElement("option");
         newOption.value = queryList[i][0];
         newOption.text = $('<div />').html(queryList[i][1]).text(); try
	{ queryType.add(newOption); } catch (e) {
	queryType.appendChild(newOption); } } } 
    else { for (var i = 0; i < queryType.length; i++) { 
      queryType[i].disabled = true; 
    } 
  } 
} 

function updateParcelTable(featureSet) { 
  //alert (featureSet.features.length.toString());
  var features = featureSet.features; 
  var queryTable = dojo.byId("queryParcelResult"); 
  var curRow; var detaillink; 
  for (var i = queryTable.rows.length - 1; i >= 0 ; i--) {
	queryTable.deleteRow(i); } features.sort(sortParcelArray); for (var i =
	0; i < features.length; i++) { curfeature = features[i]; curatts =
	curfeature.attributes; curRow = queryTable.insertRow(-1); parcelDesCell
	= curRow.insertCell(0); remainderCell = curRow.insertCell(1); planCell
	= curRow.insertCell(2); planDetailCell = curRow.insertCell(3);
	parcelTypeCell = curRow.insertCell(4); parcelDesCell.innerHTML = "<a title='Click to zoom to " + curatts["PARCELDESIGNATOR"] + "' href=javascript:zoomFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=highlightFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "') onmouseout=javascript:map.graphics.clear() onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + curatts["PARCELDESIGNATOR"] + "</a>";
      remainderCell.innerHTML = curatts["REMAINDERIND_ENG"];
      remainderCell.tabIndex = 0;
      remainderCell.title = curatts["REMAINDERIND_ENG"];
      if (curatts["GlobalID_PLA"] != null)
         planCell.innerHTML = "<a title='Click to zoom to " + curatts["PLANNO"] + "' href=javascript:zoomFeature('" + curatts["GlobalID_PLA"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=highlightFeature('" + curatts["GlobalID_PLA"] + "') onmouseout=javascript:map.graphics.clear() onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID_PLA"] + "') onblur=javascript:map.graphics.clear()>" + curatts["PLANNO"] + "</a>";
      else {
         planCell.innerHTML = curatts["PLANNO"];
         planCell.tabIndex = 0;
         planCell.title = curatts["PLANNO"];
      }
      planDetailCell.innerHTML = "<a href='" + basePlanURL + curatts["PLANNO"] + "' target=_blank>View<span class='wb-invisible'> " + curatts["PLANNO"] + "</span></a>";
      if (curatts["PARCELFC_ENG"] != undefined) {
         parcelTypeCell.innerHTML = curatts["PARCELFC_ENG"];
         parcelTypeCell.title = curatts["PARCELFC_ENG"];
      }
      else {
         parcelTypeCell.innerHTML = "Protected Area";
         parcelTypeCell.title = "Protected Area";
      }
      parcelTypeCell.tabIndex = 0;
   }

   dojo.byId("queryParcelTabCount").innerHTML = features.length;
}

function updateSIPTable(featureSet) {
   var features = featureSet.features;
   var queryTable = dojo.byId("querySIPResult");
   var curRow;

   for (var i = queryTable.rows.length - 1; i >= 0 ; i--) {
      queryTable.deleteRow(i);
   }

   features.sort(sortProjectArray);

   for (var i = 0; i < features.length; i++) {
      curfeature = features[i];
      curatts = curfeature.attributes;

      curRow = queryTable.insertRow(-1);
      projectNumberCell = curRow.insertCell(0);
      descriptionCell = curRow.insertCell(1);
      sipDetailCell = curRow.insertCell(2);

      projectNumberCell.innerHTML = "<a title='Click to zoom to " + curatts["PROJECTNUMBER"] + "' href=javascript:zoomFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=javascript:highlightFeature('" + curatts["GlobalID"] + "') onmouseout=javascript:map.graphics.clear() onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + curatts["PROJECTNUMBER"] + "</a>";
      descriptionCell.innerHTML = curatts["DESCRIPTION"];
      descriptionCell.tabIndex = 0;
      descriptionCell.title = curatts["DESCRIPTION"];
      sipDetailCell.innerHTML = "<a href='" + baseSIPURL + curatts["URL"] + "' target=_blank>View<span class='wb-invisible'> " + curatts["PROJECTNUMBER"] + "</span></a>";
   }

   dojo.byId("querySIPTabCount").innerHTML = features.length;
}

function updatePlanTable(featureSet) {
   var features = featureSet.features;
   var queryTable = dojo.byId("queryPlanResult");
   var curRow;

   for (var i = queryTable.rows.length - 1; i >= 0 ; i--) {
      queryTable.deleteRow(i);
   }

   features.sort(sortPlanArray);

   for (var i = 0; i < features.length; i++) {
      curfeature = features[i];
      curatts = curfeature.attributes;

      curRow = queryTable.insertRow(-1);
      planNoCell = curRow.insertCell(0);
      titleCell = curRow.insertCell(1);
      dateSurveyedCell = curRow.insertCell(2);
      planDetailCell = curRow.insertCell(3);
      ltoCell = curRow.insertCell(4);

      planNoCell.innerHTML = "<a title='Click to zoom to " + curatts["PLANNO"] + "' href=javascript:zoomFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=javascript:highlightFeature('" + curatts["GlobalID"] + "') onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + curatts["PLANNO"] + "</a>";
      planNoCell.className = "nowrap";
      titleCell.innerHTML = curatts["P2_DESCRIPTION"];
      titleCell.title = curatts["P2_DESCRIPTION"];
      dateSurveyedCell.innerHTML = curatts["P3_DATESURVEYED"];
      dateSurveyedCell.title = curatts["P3_DATESURVEYED"];
      dateSurveyedCell.className = "nowrap";
      planDetailCell.innerHTML = "<a href='" + basePlanURL + curatts["PLANNO"] + "' target=_blank>View<span class='wb-invisible'> " + curatts["PLANNO"] + "</span></a>";
      planDetailCell.className = "nowrap";
      ltoCell.innerHTML = curatts["ALTERNATEPLANNO"];
      ltoCell.className = "nowrap";
   }

   dojo.byId("queryPlanTabCount").innerHTML = features.length;
}

function updateAdminAreaTable(featureSet) {
   var features = featureSet.features;
   var queryTable = dojo.byId("queryAdminAreaResult");
   var curRow;
   
   for (var i = queryTable.rows.length - 1; i >= 0 ; i--) {
      queryTable.deleteRow(i);
   }
   
   features.sort(sortAdminAreaArray);
   
   for (var i = 0; i < features.length; i++) {
      curfeature = features[i];
      curatts = curfeature.attributes;
      
      curRow = queryTable.insertRow(-1);
      nameCell = curRow.insertCell(0);

      nameCell.innerHTML = "<a name='" + curatts["ADMINAREAID"] + "' title='Click to zoom to " + curatts["ENGLISHNAME"] + "' href=javascript:zoomFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=javascript:highlightFeature('" + curatts["GlobalID"] + "') onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + curatts["ENGLISHNAME"] + "</a>";
   }

   dojo.byId("queryAdminAreaTabCount").innerHTML = features.length;
}

function updateTownshipTable(featureSet) {
   var features = featureSet.features;
   var queryTable = dojo.byId("queryTownshipResult");
   var curRow;
   var curTwp;
   
   for (var i = queryTable.rows.length - 1; i >= 0 ; i--) {
      queryTable.deleteRow(i);
   }
   
   //features.sort(sortTownshipArray);
   
   for (var i = 0; i < features.length; i++) {
      curfeature = features[i];
      curatts = curfeature.attributes;
      
      curTwp = curatts["TOWNSHIPSECTION"] + "-" + curatts["TP"] + "-" + curatts["RANGE"] + "-" + curatts["DIRECTION"] + curatts["MERIDIAN"];

      curRow = queryTable.insertRow(-1);
      //qsCell = curRow.insertCell(0);
      sectionCell = curRow.insertCell(0);
      townshipCell = curRow.insertCell(1);
      rangeCell = curRow.insertCell(2);
      meridianCell = curRow.insertCell(3);

      sectionCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=javascript:highlightFeature('" + curatts["GlobalID"] + "') onmouseout=javascript:map.graphics.clear() onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + curatts["TOWNSHIPSECTION"] + "</a>";
      townshipCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=javascript:highlightFeature('" + curatts["GlobalID"] + "') onmouseout=javascript:map.graphics.clear() onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + curatts["TP"] + "</a>";
      rangeCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=javascript:highlightFeature('" + curatts["GlobalID"] + "') onmouseout=javascript:map.graphics.clear() onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + curatts["RANGE"] + "</a>";
      meridianCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomFeature('" + curatts["GlobalID"] + "','" + escape(curatts["PROVINCE"]) + "'); onmouseover=javascript:highlightFeature('" + curatts["GlobalID"] + "') onmouseout=javascript:map.graphics.clear() onmouseout=javascript:map.graphics.clear() onfocus=javascript:highlightFeature('" + curatts["GlobalID"] + "') onblur=javascript:map.graphics.clear()>" + curatts["DIRECTION"] + curatts["MERIDIAN"] + "</a>";
   }

   dojo.byId("queryTownshipTabCount").innerHTML = features.length;
}

function updateTownshipTable2(featureSet) {
  var features = featureSet.features;
  var queryTable = dojo.byId("queryTownshipResult");
  var curRow;
  var curTwp;
  
  for (var i = queryTable.rows.length - 1; i >= 0 ; i--) {
     queryTable.deleteRow(i);
  } 
    
  //features.sort(sortTownshipArray);
  console.log("attributes"); 
  for (var i = 0; i < features.length; i++) {
     curfeature = features[i];
     curatts = curfeature.attributes;
       
     //curTwp = curatts["QS"] + "-" + curatts["SEC"] + "-" + curatts["TWP"] + "-" + curatts["RGE"] + curatts["MER"]; 
     curTwp = curatts["xMin"] + "," + curatts["yMin"] + "," + curatts["xMax"] + "," + curatts["yMax"];
     console.log(curTwp);
     curRow = queryTable.insertRow(-1);
       
     qsCell = curRow.insertCell(0);
     sectionCell = curRow.insertCell(1);
     townshipCell = curRow.insertCell(2);
     rangeCell = curRow.insertCell(3);
     meridianCell = curRow.insertCell(4);
      
     //qsCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomTownship('" + curatts["OBJECTID"] + "','" + curProv + "'); onmouseover=javascript:highlightTownship('" + curatts["OBJECTID"] + "','" + curProv + "') onmouseout=javascript:map.graphics.clear() onblur=javascript:map.graphics.clear()>" + curatts["QS"] + "</a>"; 
     qsCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomFeature('" + curTwp + "','XX'); onmouseover=javascript:highlightTownship('" + curatts["OBJECTID"] + "','" + curProv + "') onmouseout=javascript:map.graphics.clear() onblur=javascript:map.graphics.clear()>" + curatts["QS"] + "</a>"; 
     sectionCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomTownship('" + curatts["OBJECTID"] + "','" + curProv + "'); onmouseover=javascript:highlightTownship('" + curatts["OBJECTID"] + "','" + curProv + "') onmouseout=javascript:map.graphics.clear() onblur=javascript:map.graphics.clear()>" + curatts["SEC"] + "</a>";
     townshipCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomTownship('" + curatts["OBJECTID"] + "','" + curProv + "'); onmouseover=javascript:highlightTownship('" + curatts["OBJECTID"] + "','" + curProv + "') onmouseout=javascript:map.graphics.clear() onblur=javascript:map.graphics.clear()>" + curatts["TWP"] + "</a>";
     rangeCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomTownship('" + curatts["OBJECTID"] + "','" + curProv + "'); onmouseover=javascript:highlightTownship('" + curatts["OBJECTID"] + "','" + curProv + "') onmouseout=javascript:map.graphics.clear() onblur=javascript:map.graphics.clear()>" + curatts["RGE"] + "</a>";
     meridianCell.innerHTML = "<a name='" + curTwp + "' title='Click to zoom to " + curTwp + "' href=javascript:zoomTownship('" + curatts["OBJECTID"] + "','" + curProv + "'); onmouseover=javascript:highlightTownship('" + curatts["OBJECTID"] + "','" + curProv + "') onmouseout=javascript:map.graphics.clear() onblur=javascript:map.graphics.clear()>" + curatts["MER"] + "</a>";
  }
    
  dojo.byId("queryTownshipTabCount").innerHTML = features.length;
}

function updateAdditionalInfoTable(dataValue, dataType) {
   var queryTable = dojo.byId("queryAdditionalInfoResult");
   var curRow;
   var dataCell;
   
   for (var i = queryTable.rows.length - 1; i >= 0 ; i--) {
      queryTable.deleteRow(i);
   }
   
   if (1 == 1) {
      var MetricUnit = " m";
      var ImperialUnit = " ft.";
   } else {
      var MetricUnit = " m";
      var ImperialUnit = " pi";
   }
   
   if (dataType == "D") {
      curRow = queryTable.insertRow(-1);
      dataCell = curRow.insertCell(0);
      dataCell.innerHTML = Math.round(dataValue).toString() + MetricUnit;
      dataCell.tabIndex = 0;
      curRow = queryTable.insertRow(-1);
      dataCell = curRow.insertCell(0);
      dataCell.innerHTML = Math.round(dataValue * 3.28084).toString() + ImperialUnit;
      dataCell.tabIndex = 0;
   } 
   
   if (dataType == "A") {
      curRow = queryTable.insertRow(-1);
      dataCell = curRow.insertCell(0);
      dataCell.innerHTML = (Math.round((dataValue * 0.404686) * 100) / 100).toString() + " ha";
      dataCell.tabIndex = 0;
      curRow = queryTable.insertRow(-1);
      dataCell = curRow.insertCell(0);
      dataCell.innerHTML = (Math.round(dataValue * 100) / 100).toString() + " A.";
      dataCell.tabIndex = 0;
   }
   
   if (dataValue == 0) {
     dojo.byId("queryAdditionalInfoTabCount").innerHTML = 0;
   } else {
     dojo.byId("queryAdditionalInfoTabCount").innerHTML = 2;
   }
}

function sortAdminAreaArray(a, b)
{
   if (a.attributes["ENGLISHNAME"] < b.attributes["ENGLISHNAME"])
      return -1;
   if (a.attributes["ENGLISHNAME"] > b.attributes["ENGLISHNAME"])
      return 1;
   return 0;
}

function sortParcelArray(a, b)
{
   if (a.attributes["PARCELDESIGNATOR"] < b.attributes["PARCELDESIGNATOR"])
      return -1;
   if (a.attributes["PARCELDESIGNATOR"] > b.attributes["PARCELDESIGNATOR"])
      return 1;
   return 0;
}

function sortPlanArray(a, b)
{
   if (a.attributes["PLANNO"] < b.attributes["PLANNO"])
      return -1;
   if (a.attributes["PLANNO"] > b.attributes["PLANNO"])
      return 1;
   return 0;
}

function sortProjectArray(b, a)
{
   if (a.attributes["PROJECTNUMBER"] < b.attributes["PROJECTNUMBER"])
      return -1;
   if (a.attributes["PROJECTNUMBER"] > b.attributes["PROJECTNUMBER"])
      return 1;
   return 0;
}

function sortTownshipArray(a, b)
{
//   var twp1
   if (a.attributes["TOWNSHIP"] < b.attributes["TOWNSHIP"])
      return -1;
   if (a.attributes["TOWNSHIP"] > b.attributes["TOWNSHIP"])
      return 1;
   return 0;
}

function setActiveTab(tabIndex)
{
   var curtab;
   var curres;

   activeTab = tabIndex;

   for (i = 0; i < tabNames.length; i++) {
      curtab = tabNames[i] + "Tab";
      curresult = tabNames[i] + "Result";

      if (i == tabIndex)
         dojo.byId(curresult).style.display = "block";
      else
         dojo.byId(curresult).style.display = "none";
   }
}

function queryAdminArea(layerno)
{
   var query = new esri.tasks.Query();
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var queryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/" + layerno;
   var queryTask = new esri.tasks.QueryTask(queryURL);
   var queryName;
   var whereclause = "OBJECTID = OBJECTID";
   var quad = "";
   var firstnation = "";

   if (layerno == 8)
   {
/*
      if (dojo.byId("txtQuad1") && dojo.byId("txtQuad2")
            && dojo.byId("txtQuad1").value != "" && dojo.byId("txtQuad2").value != "")
      {
         quad = dojo.byId("txtQuad1").value;
         quad += dojo.byId("txtQuad2").value;
         if (dojo.byId("txtQuad3") && dojo.byId("txtQuad3").value != "")
            quad += dojo.byId("txtQuad3").value;

         whereclause += " AND UPPER(QUAD) like UPPER('" + quad + "%')";
      }
*/
	   if (dojo.byId("txtQuad") && dojo.byId("txtQuad").value != "")
	   {
	      var quad1 = dojo.byId("txtQuad").value;
	      var quad2 = quad1.match(/(\d+|[^\d]+)/g).join('|');
	      var quadarr = quad2.split("|");
	      var prefix = quadarr[0];
	      var nts250;
	      var nts50;
	      if (quadarr.length > 1)
	      {
	          nts250 = quadarr[1];
	
	          if (quadarr.length > 2)
	            nts50 = quadarr[2];
	      }
	
	      if (!isNaN(parseInt(prefix)))
	      {
	         quad = prefix;
	
	         if (nts250.length == 1 && nts250.search(/[a-p]/i) > -1)
	         {
	            quad += nts250;
	
	            if (!isNaN(parseInt(nts50)))
	            {
	               if (nts50.length == 1 && nts50 != 0)
	                  quad += "0";
	               quad += nts50;
	            }
	         }
	         else
	            quad = "NA";
	      }
	      else
	         quad = "NA";

	      whereclause += " AND UPPER(QUAD) like UPPER('" + quad + "%')";
	   }
   }
   else {
      if (dojo.byId("txtAdminAreaName") && dojo.byId("txtAdminAreaName").value != "") 
         whereclause += " AND UPPER(ENGLISHNAME) like '%" + dojo.byId("txtAdminAreaName").value.toUpperCase().replace("'", "''") + "%'";
      if (layerno == 3)
      {
         if (dojo.byId("cmbFirstNation") && dojo.byId("cmbFirstNation").selectedIndex != 0 && dojo.byId("cmbFirstNation").selectedIndex != -1)
         {
            firstnation = dojo.byId("cmbFirstNation")[dojo.byId("cmbFirstNation").selectedIndex].value;
            whereclause += " AND FIRSTNATION like '%" + firstnation + "%'";
         }
      }
   }
   
   //alert(whereclause);

   var tempworkaround = (new Date()).getTime();
   whereclause += " AND " + tempworkaround + "=" + tempworkaround;
   query.where = whereclause;
   query.returnGeometry = false;
   query.outFields = ["ADMINAREAID", "ENGLISHNAME", "PROVINCE", "GlobalID"];
   queryTask.execute(query, updateAdminAreaTable);
}

function queryParcel(layerno)
{  
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var query = new esri.tasks.Query();
   var queryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/" + layerno;
   var queryTask = new esri.tasks.QueryTask(queryURL);
   var queryName;
   var whereclause = "OBJECTID = OBJECTID";
   var quad = "";
   var canland = "";

   if (dojo.byId("txtParcelDesignator") && dojo.byId("txtParcelDesignator").value != "") {
      whereclause += " AND UPPER(PARCELDESIGNATOR) like '%" + dojo.byId("txtParcelDesignator").value.toUpperCase() + "%'";
   }
   if (dojo.byId("txtPlanNo") && dojo.byId("txtPlanNo").value != "") {
      whereclause += " AND UPPER(PLANNO) like '%" + dojo.byId("txtPlanNo").value.toUpperCase() + "%'";
   }
   if (dojo.byId("txtQuad") && dojo.byId("txtQuad").value != "")
   {
      var quad1 = dojo.byId("txtQuad").value;
      var quad2 = quad1.match(/(\d+|[^\d]+)/g).join('|');
      var quadarr = quad2.split("|");
      var prefix = quadarr[0];
      var nts250 = 0;
      var nts50 = 0;
      if (quadarr.length > 1)
      {
          nts250 = quadarr[1];

          if (quadarr.length > 2)
            nts50 = quadarr[2];
      }

      if (!isNaN(parseInt(prefix)))
      {
         quad = prefix;

         if (nts250.length == 1 && nts250.search(/[a-p]/i) > -1)
         {
            quad += nts250;

            if (!isNaN(parseInt(nts50)))
            {
               if (nts50.length == 1)
                  quad += "0";
               quad += nts50;
            }
         }
         else
            quad = "NA";
      }
      else
         quad = "NA";

      whereclause += " AND UPPER(QUAD) like UPPER('%" + quad + "%')";
   }
   if (dojo.byId("cmbCanLand") && dojo.byId("cmbCanLand").selectedIndex != 0)
   {
      whereclause += " AND UPPER(GEOADMINCODE) = '" + dojo.byId("cmbCanLand")[dojo.byId("cmbCanLand").selectedIndex].value + "'";
   }
   var tempworkaround = (new Date()).getTime();
   whereclause += " AND " + tempworkaround + "=" + tempworkaround;
   query.where = whereclause;
   query.returnGeometry = false;
   query.outFields = ["PARCELDESIGNATOR", "PLANNO", "PIN", "GlobalID", "GlobalID_PLA", "PROVINCE", "PARCELFC_ENG", "PARCELFC_FRA", "REMAINDERIND", "REMAINDERIND_ENG", "REMAINDERIND_FRA"];
   queryTask.execute(query, updateParcelTable);
}

function queryProject(layerno)
{
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var query = new esri.tasks.Query();
   var queryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/" + layerno;
   var queryTask = new esri.tasks.QueryTask(queryURL);
   var queryName;
   var whereclause = "OBJECTID = OBJECTID";
   var quad = "";
   var firstnation = "";

   if (dojo.byId("txtProjectNumber") && dojo.byId("txtProjectNumber").value != "") 
      whereclause += " AND UPPER(PROJECTNUMBER) like '%" + dojo.byId("txtProjectNumber").value.toUpperCase() + "%'";

   if (dojo.byId("cmbCanLand") && dojo.byId("cmbCanLand").selectedIndex != 0)
   {
      whereclause += " AND UPPER(GEOADMINCODE) = '" + dojo.byId("cmbCanLand")[dojo.byId("cmbCanLand").selectedIndex].value + "'";
   }
   if (dojo.byId("txtQuad") && dojo.byId("txtQuad").value != "")
   {
      var quad1 = dojo.byId("txtQuad").value;
      var quad2 = quad1.match(/(\d+|[^\d]+)/g).join('|');
      var quadarr = quad2.split("|");
      var prefix = quadarr[0];
      var nts250 = 0;
      var nts50 = 0;
      if (quadarr.length > 1)
      {
          nts250 = quadarr[1];
          
          if (quadarr.length > 2)
            nts50 = quadarr[2];
      }

      if (!isNaN(parseInt(prefix)))
      {
         quad = prefix;

         if (nts250.length == 1 && nts250.search(/[a-p]/i) > -1)
         {
            quad += nts250;

            if (!isNaN(parseInt(nts50)))
            {
               if (nts50.length == 1)
                  quad += "0";
               quad += nts50;
            }
         }
         else
            quad = "NA";
      }
      else
         quad = "NA";

      whereclause += " AND UPPER(QUAD) like UPPER('%" + quad + "%')";
   }

   var tempworkaround = (new Date()).getTime();
   whereclause += " AND " + tempworkaround + "=" + tempworkaround;

   query.where = whereclause;
   query.returnGeometry = false;
   query.outFields = ["PROJECTNUMBER", "DESCRIPTION", "PROVINCE", "URL", "GlobalID"];
   queryTask.execute(query, updateSIPTable);
}

function queryTownship(layerno)
{
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var query = new esri.tasks.Query();
   var queryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/" + layerno;
   var queryTask = new esri.tasks.QueryTask(queryURL);
   var queryName;
   var whereclause = "OBJECTID = OBJECTID";
   
   if (dojo.byId("txtSec") && dojo.byId("txtSec").value != "") 
      whereclause += " AND TOWNSHIPSECTION = " + dojo.byId("txtSec").value;
   if (dojo.byId("txtTwp") && dojo.byId("txtTwp").value != "") 
      whereclause += " AND TP = '" + dojo.byId("txtTwp").value + "'";
   if (dojo.byId("txtRge") && dojo.byId("txtRge").value != "") 
      whereclause += " AND RANGE = " + dojo.byId("txtRge").value;
   if (dojo.byId("cmbDir") && dojo.byId("cmbDir").selectedIndex != 0)
      whereclause += " AND DIRECTION = '" + dojo.byId("cmbDir")[dojo.byId("cmbDir").selectedIndex].value + "'";
   if (dojo.byId("txtMer") && dojo.byId("txtMer").value != "") 
      whereclause += " AND MERIDIAN = '" + dojo.byId("txtMer").value + "'";

   var tempworkaround = (new Date()).getTime();
   whereclause += " AND " + tempworkaround + "=" + tempworkaround;
   
   query.where = whereclause; 
   query.returnGeometry = false;
   query.outFields = ["TOWNSHIPSECTION", "TP", "RANGE", "DIRECTION", "MERIDIAN", "TOWNSHIP", "PROVINCE", "GlobalID"];
   queryTask.execute(query, updateTownshipTable);
}

function queryTownship2(layerno) {
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var query = new esri.tasks.Query();
   var queryURL = baseURL + "WMB_Township2_" + curProv + "/MapServer/" + layerno;
   var queryTask = new esri.tasks.QueryTask(queryURL);
   var queryName;
   var whereClause = "OBJECTID = OBJECTID AND TOWNSHIP LIKE '%";
   
   //if (dojo.byId("cmbQS") && dojo.byId("cmbQS").selectedIndex != 0) 
   //  whereclause += " AND QS = '" + dojo.byId("cmbQS")[dojo.byId("cmbQS").selectedIndex].value + "'";
   //if (dojo.byId("txtSec2") && dojo.byId("txtSec2").value != "") 
   //  whereclause += " AND SEC = " + dojo.byId("txtSec2").value;
   //if (dojo.byId("txtTwp2") && dojo.byId("txtTwp2").value != "") 
   //  whereclause += " AND TWP = " + dojo.byId("txtTwp2").value;
   //if (dojo.byId("cmbRge") && dojo.byId("cmbRge").selectedIndex != 0)
   //  whereclause += " AND RGE = '" + dojo.byId("cmbRge")[dojo.byId("cmbRge").selectedIndex].value + "'";
   //if (dojo.byId("cmbDir2") && dojo.byId("cmbDir2").selectedIndex != 0)
   //  whereclause += " AND MER = '" + dojo.byId("cmbDir2")[dojo.byId("cmbDir2").selectedIndex].value + "'";
    
   twpQS  = dojo.byId("cmbQS").value;
   twpSec = dojo.byId("txtSec2").value;
   twpTWP = dojo.byId("txtTwp2").value;
   twpRge = dojo.byId("cmbRge").value;
   twpMer = dojo.byId("cmbDir2").value;
   if (twpTWP.length == 0) { alert("You must specify a towmship!"); return; }
   if (twpRge.length == 0) { alert("You must specify a range!"); return; }
   if (twpMer.length == 0) { alert("You must select a meridian!"); return; }
   if (twpQS.length > 0 && twpSec == "") { alert("You must specify a section when sprcifying a quarter section!"); return; }
     
   if (twpQS.length > 0)  { whereClause = whereClause + twpQS; }
   if (twpSec.length > 0) { whereClause = whereClause + twpSec; }
                            whereClause = whereClause + "T" + twpTWP; 
                            whereClause = whereClause + "R" + twpRge; 
                            whereClause = whereClause + twpMer; 
                            whereClause = whereClause + "'";
   
   //if (dojo.byId("cmbQS") && dojo.byId("cmbQS").selectedIndex != 0) 
   //  whereclause += " AND QS = '" + dojo.byId("cmbQS")[dojo.byId("cmbQS").selectedIndex].value + "'";
   
   var tempworkaround = (new Date()).getTime();
   whereClause += " AND " + tempworkaround + "=" + tempworkaround;
   query.where = whereClause;
   query.returnGeometry = false;
   query.outFields = ["QS", "SEC", "TWP", "RGE", "MER", "OBJECTID", "xMin", "yMin", "xMax", "yMax"];

   //alert(whereClause);
   queryTask.execute(query, updateTownshipTable2);
}

function queryPlan(layerno)
{
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var query = new esri.tasks.Query();
   var queryURL = baseURL + "WMB_Query_" + curProv + "/MapServer/" + layerno;
   var queryTask = new esri.tasks.QueryTask(queryURL);
   var queryName;
   var whereclause = "OBJECTID = OBJECTID";
   var quad = "";

   if (dojo.byId("txtPlanNo") && dojo.byId("txtPlanNo").value != "")
   {
      whereclause += " AND UPPER(PLANNO) like '%" + dojo.byId("txtPlanNo").value.toUpperCase() + "%'";
   }
   if (dojo.byId("txtLTONo") && dojo.byId("txtLTONo").value != "")
   {
      whereclause += " AND UPPER(ALTERNATEPLANNO) like '%" + dojo.byId("txtLTONo").value.toUpperCase() + "%'";
   }
   if (dojo.byId("txtQuad") && dojo.byId("txtQuad").value != "")
   {
      var quad1 = dojo.byId("txtQuad").value;
      var quad2 = quad1.match(/(\d+|[^\d]+)/g).join('|');
      var quadarr = quad2.split("|");
      var prefix = quadarr[0];
      var nts250 = 0;
      var nts50 = 0;
      if (quadarr.length > 1)
      {
          nts250 = quadarr[1];
          
          if (quadarr.length > 2)
            nts50 = quadarr[2];
      }

      if (!isNaN(parseInt(prefix)))
      {
         quad = prefix;

         if (nts250.length == 1 && nts250.search(/[a-p]/i) > -1)
         {
            quad += nts250;

            if (!isNaN(parseInt(nts50)))
            {
               if (nts50.length == 1)
                  quad += "0";
               quad += nts50;
            }
         }
         else
            quad = "NA";
      }
      else
         quad = "NA";

      whereclause += " AND UPPER(QUAD) like UPPER('%" + quad + "%')";
   }
/*
   if (dojo.byId("txtQuad1") && dojo.byId("txtQuad1").value != "" && dojo.byId("txtQuad2") && dojo.byId("txtQuad2").value != "")
   {
      quad = dojo.byId("txtQuad1").value;
      quad += dojo.byId("txtQuad2").value;
      if (dojo.byId("txtQuad3") && dojo.byId("txtQuad3").value != "")
         if (dojo.byId("txtQuad3").value.length == 1)
            quad += "0";
         quad += dojo.byId("txtQuad3").value;

      whereclause += " AND UPPER(QUAD) like UPPER('%" + quad + "%')";
   }
*/
   if (dojo.byId("cmbCanLand") && dojo.byId("cmbCanLand").selectedIndex != 0)
   {
      whereclause += " AND UPPER(GEOADMINCODE) like '%" + dojo.byId("cmbCanLand")[dojo.byId("cmbCanLand").selectedIndex].value + "%'";
   }

   var tempworkaround = (new Date()).getTime();
   whereclause += " AND " + tempworkaround + "=" + tempworkaround;

   query.where = whereclause;
   query.returnGeometry = false;
   query.outFields = ["PLANNO", "P2_DESCRIPTION", "GlobalID", "PROVINCE", "P3_DATESURVEYED", "SURVEYOR", "ALTERNATEPLANNO"];
   queryTask.execute(query, updatePlanTable);
}

function queryCoordinates()
{
   var coordsys = dojo.byId("cmbCoordSys")[dojo.byId("cmbCoordSys").selectedIndex].value;
   var minx;
   var miny;
   var maxx;
   var maxy;
   var sourcecs;
   var zone;
   var destcs = new Proj4js.Proj('EPSG:102002');
   var pt1;
   var pt2;
   var ext;
   var deg, min, sec;

   if (coordsys.toUpperCase() == "UTM")
   {
      minx = dojo.byId("txtMinEasting").value;
      miny = dojo.byId("txtMinNorthing").value;
      maxx = dojo.byId("txtMaxEasting").value;
      maxy = dojo.byId("txtMaxNorthing").value;
      zone = dojo.byId("cmbZone")[dojo.byId("cmbZone").selectedIndex].value;
      
      sourcecs = new Proj4js.Proj('EPSG:269' + zone);
   }
   else if (coordsys.toUpperCase() == "LATLONG")
   {
      //deg = Math.floor(dojo.byId("txtMinLongitude").value);
      //min = dojo.byId("txtMinLongitude").value - deg;
      //sec
      var minlong = dojo.byId("txtMinLongitude").value;
      var maxlong = dojo.byId("txtMaxLongitude").value;
      
      if (minlong > 0)
         minlong *= -1;
      
      if (maxlong > 0)
         maxlong *= -1;
      
      minx = minlong;
      miny = dojo.byId("txtMinLatitude").value;
      maxx = maxlong;
      maxy = dojo.byId("txtMaxLatitude").value;

      sourcecs = new Proj4js.Proj('ESRI:4269');
   }

   pt1 = new Proj4js.Point(minx, miny);
   pt2 = new Proj4js.Point(maxx, maxy);

   Proj4js.transform(sourcecs, destcs, pt1);
   Proj4js.transform(sourcecs, destcs, pt2);

   ext = new esri.geometry.Extent(pt1.x, pt1.y, pt2.x, pt2.y, new esri.SpatialReference({wkid:4269}));

   selectFeatures(ext);
}

function highlightFeature(globalid)
{ 
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var query = new esri.tasks.Query();
   var queryURL = baseURL + "WMB_Highlight_" + curProv + "/MapServer/0";
   var queryTask = new esri.tasks.QueryTask(queryURL);
   var whereclause = "GlobalID = '" + globalid + "'";
   
   var tempworkaround = (new Date()).getTime();
   whereclause += " AND " + tempworkaround + "=" + tempworkaround;
    
   query.where = whereclause;
   query.returnGeometry = true;
   query.outFields = ["GlobalID"];
   queryTask.execute(query, highlightFeature2);
}

function highlightFeature2(featureSet)
{ 
   var feature = featureSet.features[0];
   var poly = feature.geometry;

   var symb = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
               new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
               new dojo.Color([255,0,0]), 2),new dojo.Color([255,255,0,0.25]));
 
   var curhighfeature = new esri.Graphic(poly, symb); 

   map.graphics.add(curhighfeature);
}

function highlightTownship(recno, reg) {
    baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
    var query = new esri.tasks.Query();
    var queryURL = baseURL + "WMB_Township_" + reg + "/MapServer/0";
    var queryTask = new esri.tasks.QueryTask(queryURL);
    var whereclause = "OBJECTID = " + recno;
      
    var tempworkaround = (new Date()).getTime();
    whereclause += " AND " + tempworkaround + "=" + tempworkaround;
       
    query.where = whereclause;
    query.returnGeometry = true;
    query.outFields = ["OBJECTID"];
    queryTask.execute(query, highlightTownshipResult);
}
     
function highlightTownshipResult(featureSet) {
    var feature = featureSet.features[0];
    var poly = feature.geometry;
    var symb = new esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_SOLID,
             new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
             new dojo.Color([255,0,0]), 2),new dojo.Color([255,255,0,0.25]));
    var attr = {"OBJECTID":feature.attributes["OBJECTID"]};
    var attr = {};
    var infoTemplate = new esri.InfoTemplate();
      
    //curhighfeature = new esri.Graphic(poly, symb, attr, infoTemplate); //commented by JH, 2013-09-09 to remove the issue of highlighted features showing an info box when clicked
    curhighfeature = new esri.Graphic(poly, symb, attr, null);
   
    map.graphics.add(curhighfeature);
}

function zoomOnLoad(featuretype, key, alt)
{
   baseURL = "http://proxyinternet.nrcan.gc.ca/arcgis/rest/services/MB-NC/";
   var query = new esri.tasks.Query();
   var queryURL = "";
   var queryTask;
   var whereclause;

   switch (featuretype)
   {
   case "can":
      queryURL = baseURL + "WMB_Query_Support/MapServer/0";
      whereclause = "ADMINAREAID = '" + key + "'";
      break;
   case "pln":
      queryURL = baseURL + "WMB_Query_Support/MapServer/5";
      whereclause = "PLANNO LIKE '" + key + "%'";
      break;
   case "prj":
      queryURL = baseURL + "WMB_Query_Support/MapServer/4";
      whereclause = "PROJECTNUMBER = '" + key + "'";
      break;
   }

   if (queryURL != "")
   {
      var tempworkaround = (new Date()).getTime();
      whereclause += " AND " + tempworkaround + "=" + tempworkaround;

      queryTask = new esri.tasks.QueryTask(queryURL);
      query.where = whereclause;
      query.returnGeometry = true;
      query.outFields = ["GlobalID", "MINX", "MINY", "MAXX", "MAXY"];

      //alert("queryURL: " + queryURL + "\nwhereclause: " + whereclause);
      currCanCode = alt;

      queryTask.execute(query, zoomFeature2);
   }
}

function changeCoordSys(selObject)
{
   var curval = selObject[selObject.selectedIndex].value;

   if (curval == "UTM")
   {
      dojo.byId("coordutm").style.display = "block";
      dojo.byId("cmbZone").style.display = "inline"
      dojo.byId("coordgeo").style.display = "none";
   }
   else if (curval == "LatLong")
   {
      dojo.byId("coordutm").style.display = "none";
      dojo.byId("cmbZone").style.display = "none"
      dojo.byId("coordgeo").style.display = "block";
   }
}

function toggleLayerVisibility(layerid, visible)
{
   mapLayers = businessmap.layerInfos;
   var visibleLayers = [];
   for (var i = 0; i < mapLayers.length; i++)
   {
      if (mapLayers[i].id == layerid)
      {
         mapLayers[i].defaultVisibility = visible;
         if ((layerid == 4)  || (layerid == 7) || (layerid == 10) || (layerid == 13) || (layerid == 16) || (layerid == 19) || (layerid == 22) || (layerid == 25) || (layerid == 28) || (layerid == 28) || (layerid == 31) || (layerid == 34) || (layerid == 37)|| (layerid == 40)) {
            mapLayers[i+1].defaultVisibility = visible;
         }
      }

      if (mapLayers[i].defaultVisibility)
         visibleLayers.push(mapLayers[i].id);
   }

   //alert(mapLayers.length);

   businessmap.setVisibleLayers(visibleLayers);
}

function toggleTooltip(obj, display)
{
   if (display)
   {
      dojo.byId(obj).style.display = "inline";
//      dojo.byId(obj).style.margin-top = "15px";
   }
   else
      dojo.byId(obj).style.display = "none";
}

function resetResults()
{
   var featureSetNull = esri.tasks.FeatureSet();
   
   updateAdminAreaTable(featureSetNull);
   updateTownshipTable(featureSetNull);
   updateParcelTable(featureSetNull);
   updateSIPTable(featureSetNull);
   updatePlanTable(featureSetNull);
   updateTownshipTable(featureSetNull);
   updateAdditionalInfoTable(0,"X");
}

// jQuery implementation to set URL for a <div> replaces processAjax() and targetDiv functions
// April 30, 2013
function processAjax(url)
{
   var queryurl = "map-carte/" + url;
   var rg;
   
   $('#tab_1_1').load(queryurl, function() {
      if (url.toLowerCase().indexOf("querylist.php") > -1) {
         if (url.indexOf("rg=") > -1) {
            rg = url.substr(url.indexOf("rg=") + 3, 2);
            //alert(rg);
            showQueries(rg);
         }
      }
   });
}

function setQueryType(querytype, curqueryrad)
{
   dojo.byId("txtQueryType").value = querytype;
}

//Functions to disable/enable page scrolling
// left: 37, up: 38, right: 39, down: 40,
// spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
//var keys = [33, 34, 35, 36, 37, 38, 39, 40];
var keys = [dojo.keys.LEFT_ARROW, dojo.keys.RIGHT_ARROW, dojo.keys.UP_ARROW, dojo.keys.DOWN_ARROW];
var handle;

function preventDefault(e)
{
   e = e || window.event;
   if (e.preventDefault)
      e.preventDefault();
   e.returnValue = false;  
}

function keydown(e)
{
   e = e || window.event;
   for (var i = keys.length - 1; i >= 0; i--) {
      if (e.keyCode) {
         if (e.keyCode === keys[i]) {
            preventDefault(e);
            return;
         }
      }
      else if (e.charCode) {
         if (e.charCode === keys[i]) {
            preventDefault(e);
            return;
         }
      }
   }
}

function wheel(e)
{
   preventDefault(e);
}

function disable_scroll()
{
   if (window.addEventListener) {
      //All browsers except IE before version 9
      window.addEventListener('DOMMouseScroll', wheel, false);
   }
   else if (window.attachEvent) {
      //IE before version9
      window.attachEvent('DOMMouseScroll', wheel);
   }
   window.onmousewheel = document.onmousewheel = wheel;
   document.onkeydown = keydown;

   handle = dojo.connect(document,"onkeydown",trapkey);
}

function enable_scroll()
{
   if (window.removeEventListener) {
      //All browsers except IE before version 9
      window.removeEventListener('DOMMouseScroll', wheel, false);
   }
   else if (window.detachEvent) {
      //IE before version9
      window.detachEvent('DOMMouseScroll', wheel);
   }
   window.onmousewheel = document.onmousewheel = document.onkeydown = null;  

   dojo.disconnect(handle);
}

//map.disableKeyboardNavigation();
//dojo.connect(document,"onkeydown",trapkey); 

//Trap the arrow and +/- keys for map navigation when control doesn't have mouse focus

function trapkey(evt)
{
   var evt=(evt) ? evt : ((event) ? event : null);
   var node=(evt.target) ? evt.target : ((evt.srcElement) ? evt.srcElement : null);
   if(node.type==undefined){
      if(evt.keyCode==40){map.panDown();return false;}
      if(evt.keyCode==39){map.panRight();return false;}
      if(evt.keyCode==38){map.panUp();return false;}
      if(evt.keyCode==37){map.panLeft();return false;}
      if(evt.keyCode==187 || evt.keyCode == 107){map.setLevel(map.getLevel()+1);return false;}
      if(evt.keyCode==189 || evt.keyCode == 109){map.setLevel(map.getLevel()-1);return false;}
   }
   else
   {
      return true;
   }
}
