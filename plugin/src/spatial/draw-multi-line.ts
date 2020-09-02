// source: https://github.com/suytt/esri.symbol.MultiLineTextSymbol/blob/master/esri.symbol.MultiLineTextSymbol.js
export class MultiLineLayer {
    /**
     * Set the text multiline for distance and area
     * @function setMultiLine
     */
    static setMultiLine() {
        let myBundlePromise = (<any>window).RAMP.GAPI.esriLoadApiClasses([
            ['esri/layers/LabelLayer', 'LabelLayer']
        ]);

        myBundlePromise.then(() => {
            if (typeof (<any>window).esri.layers.LabelLayer.prototype._addLabel === 'function') {
                (<any>window).esri.layers.LabelLayer.prototype._addLabel2 = (<any>window).esri.layers.LabelLayer.prototype._addLabel;
                (<any>window).esri.layers.LabelLayer.prototype._addLabel = (a,b,c,e,g,k,m) => {
                    // replace \n by <br>
                    a = a.replace(/\n/g, '<br />');
                    (<any>this)._addLabel2(a,b,c,e,g,k,m);
                }
            }
        });
    }
}

export class MultilineTextSymbol {
    /**
     * Set the text symbol multiline for distance and area
     * @function setMultiLine
     */
    static setMultiLine() {
        let myBundlePromise = (<any>window).RAMP.GAPI.esriLoadApiClasses([
            ['esri/symbols/TextSymbol', 'TextSymbol'],
            ['dojox/gfx/svg', 'svg']
        ]);

        myBundlePromise.then(() => {
            if (typeof (<any>window).dojox.gfx.svg.Text.prototype.setShape === 'function') {
                // do not use arrow function because if we do so, we loose the context of this
                (<any>window).dojox.gfx.svg.Text.prototype.setShape = function(p) {
                    this.shape = (<any>window).dojox.gfx.makeParameters(this.shape, p);
                    this.bbox = null;
                    let r = this.rawNode;
                    let s = this.shape;
                    r.setAttribute('x', s.x);
                    r.setAttribute('y', s.y - 10);
                    r.setAttribute('text-anchor', s.align);
                    r.setAttribute('text-decoration', s.decoration);
                    r.setAttribute('rotate', s.rotated ? 90 : 0);
                    r.setAttribute('kerning', s.kerning ? 'auto' : 0);
                    r.setAttribute('text-rendering', 'optimizeLegibility');

                    while (r.firstChild) {
                        r.removeChild(r.firstChild);
                    }

                    if (p.text) {
                        let texts = p.text.replace(/<br\s*\/?>/ig, '\n').split('\n');
                        let lineHeight = 1.1 * parseInt(document.defaultView.getComputedStyle(r, '').getPropertyValue('font-size'), 10); 
                        if (isNaN(lineHeight) || !isFinite(lineHeight)) {
                            lineHeight = 15;
                        }
                        for (var i = 0, n = texts.length; i < n; i++) { 
                            var tspan = (document.createElementNS ? document.createElementNS((<any>window).dojox.gfx.svg.xmlns.svg, 'tspan') : document.createElement('tspan'));
                            tspan.setAttribute('dy', i ? String(lineHeight) : String(-(texts.length-1) * lineHeight/2)); 
                            tspan.setAttribute('x', s.x);
                            tspan.appendChild(((<any>window).dojox.gfx.useSvgWeb ? document.createTextNode(texts[i]) : document.createTextNode(texts[i]))); 
                            r.appendChild(tspan);
                        }
                    }
                    return this;
                }
            }
        });
    }
}