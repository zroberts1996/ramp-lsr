# Draw
This plugin let you draw on a map and it is based on this ESRI toolbar.
- [ESRI doc page](https://developers.arcgis.com/javascript/3/jsapi/draw-amd.html)
- [ESRI sample](https://developers.arcgis.com/javascript/3/samples/graphics_add/)

It can also add distance to your lines, perimeter and area to your polygons. you can change color symbology, export or import your graphics.

You can use this toolbar to suscribe on event like add point, add line, add polygon and draw extent to delete. Every time a geometry is drawn on the map, it will fire an event with the geometry as the result
```
    window.drawObs.drawPoint.subscribe(value => {
        console.log(`Poind added: ${JSON.stringify(value)}`);
    });
```

[Demo page](https://jolevesq.github.io/contributed-plugins/draw/samples/draw-index.html)

## How to use the plugin
Inside your configuration file you need
```
"plugins": {
      "draw": {
        "open": true
        "tools": ["picker", "point", "polyline", "polygon", "edit", "measure", "extent", "write", "read"]
      }
    }
```

Configuration parameters
- open: boolean to specify if the draw toolbar is open by default
- tools: array of tools to add to the draw toolbar
    - picker: modify symbology color
    - point: add a point on the map
    - polyline: add a line on the map
    - polygon: add a polygon on the map
    - edit: allow editing existing graphics
    - measure: let you show\hide measures
    - extent: let you delete graphics by extent drawn on the map
    - write: export graphics
    - read: import graphics

Inside your html, add this to your head section then replace href and src with your path.
```
<link rel="stylesheet" href="/draw.css" />
<script src="/draw.js"></script>
```

## Test page
To play with the code, from the plugin folder, do npm install, run build then npm run serve.
- http://localhost:6001/samples/draw-index.html

To deploy a test page, from the plugin folder, do npm run build then npm run deploy. The page will be created at
- https://"Your GitHub UserName".github.io/contributed-plugins/draw/samples/draw-index.html

## Author and support
Author and maintainer [NRCan FGP - Johann Levesque](https://github.com/jolevesq)

To report issue, please create an issue from the [GitHub repository](https://github.com/fgpv-vpgf/contributed-plugins/issues). Add the plugin-draw label and any other applicable one.

## RAMP version
Developed with RAMP version 3.2