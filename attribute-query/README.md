# How to create my first plugin
This folder (my-first-plugin) contains everything you need to create your first plugin. Copy this folder and rename it with your plugin name (e.g. power-plugin). Package name can't be camel case, use dashes.

# Plugin configuration
First, you need to configure the plugin.
- Inside compileSass.sh file, replace myFirstPlugin with your plugin name
    - e.g. ```... ../dist/my-first-plugin/my-first-plugin.css --importer ... => ... ../dist/power-plugin/power-plugin.css --importer ...```
- Inside webpack.config.js, replace pluginName variable with your plugin name
    - e.g. ```const pluginName = 'my-first-plugin'; => const pluginName = 'power-plugin';```
- Inside package.json
    - Replace "name, "homepage" and "keyword" by your plugin name (e.g my-first-plugin => power-plugin)
- Inside tsconfig.json, replace myFirstPlugin with your plugin name
    - e.g. ```"outDir": "../dist/my-first-plugin" => "outDir": "../dist/power-plugin"```

You have finish the plugin configuration!

Because each plugin configuration is independant, you can modify all these files to your needs (e.g. add dependencies to your package.json file).

When you are ready, inside plugin folder, do npm install to install the needed node modules. Do npm install each time you add a new dependencies.

# Plugin code
Inside src folder you will find the basic files to start your own plugin
- loader.ts is the entry point of your plugin
- mains.sass is the file where you put your style
- template.ts is the file where you put your html section to add to your plugin
- index.ts is your code entry point where the plugin will be initialize. Inside this file few modifications needs to be done
    - Rename the class with your plugin name (e.g. ```export default class MyFirstPlugin => export default class PowerPlugin```)
    - Rename the interface with your class name (e.g. ```export default interface MyFirstPlugin => export default interface PowerPlugin```)
    - Rename the object who will be applied to window (e.g. ```(<any>window).myFirstPlugin = MyFirstPlugin; => (<any>window).powerPlugin = PowerPlugin;```). Use this name when you configure rv-plugins inside your html page.
    - Rename the configuration section. It should be the same name as your section inside your viewer configuration file (e.g. ```this.config = this._RV.getConfig('plugins').myFirstPlugin; => this.config = this._RV.getConfig('plugins').powerPlugin;```). This will give you access to all the elements to configure your plugin. See plugin samples for more details.
    - Rename the translation section (e.g. ```MyFirstPlugin.prototype.translations => PowerPlugin.prototype.translations```). This will add a translation dictionnary avaiable to your html element from template.ts or directly in the code (e.g. ```MyFirstPlugin.prototype.translations[this._RV.getCurrentLang()].placeHolder => PowerPlugin.prototype.translations[this._RV.getCurrentLang()].placeHolder```) to translate your elements. Add as many new values as you need.
    - Inthis file there is samples to add side menu button, panel, controller, ... you can remove these sections if you do not need them

Modification to the code is applied automatically and webpack-dev-server will reload the page with your modification.

# Plugin samples
Inside src/samples folder you will find your test html page with a sample configuration
- my-first-plugin-config.json is a basic configuration file. It can be rename and modified to suit your test/demo page. Inside this file, there is a section called "plugins". You need to rename the section inside called myFirstPlugin with the name of your plugin. Use camel case to rename this plugin section. This file can be rename as you want. You can create as many configuration as you want for your plugin.

    ```
        "plugins": {
            "myFirstPlugin": {
                "description": "This is my first plugin!"
            }
        }
    ```

    will become

    ```
        "plugins": {
            "powerPlugin": {
                ... all needed configuration ...
            }
        }
    ```

- my-first-plugin-index.html is a basic html to test/demo your plugin
    - In head section, replace title with your own title
    - In head section, replace css and js file name with your plugin name (e.g. ```<script src="../my-first-plugin.js"></script> => <script src="../power-plugin.js"></script>```)
    - In body section, the first div is your map div. You need to replace
        - id, unique id for the map to link to trought the api
        - rv-config, the configuration file to use
        - rv-plugins, the plugin name from the class name inside your index.ts (use camel case)

    ```
    <div
        class="myMap"
        id="mapMyFirstPlugin"
        is="rv-map"
        rv-config="my-first-plugin-config.json"
        rv-langs='["en-CA", "fr-CA"]'
        rv-plugins="myFirstPlugin"
    >
    ```

    will become

    ```
    <div
        class="myMap"
        id="mapPowerPlugin"
        is="rv-map"
        rv-config="power-plugin-config.json"
        rv-langs='["en-CA", "fr-CA"]'
        rv-plugins="powerPlugin"
    >
    ```

Modification to the code is applied automatically and webpack-dev-server will reload the page with your modification.

# Run your code
To run your dev-server, from your plugin directory, do npm run serve and navigate to http://localhost:6001/samples/"plugin name"-index.html

## Deploy a test page
To deploy a test page, do npm run build to update the dist folder then npm run deploy to upload the content of your dist folder to GitHub. Every plugins inside dist folder will be upload to your page. If you want to restrict the number of plugins, clean the dist folder before you do npm run deploy.