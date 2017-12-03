(function () {
  'use strict';

  Polymer({

    is: 'adom-demo-helper-properties',

    properties: {
      /**
       * Component name, is a obligatory property
       */
      componentName: {
        type: String,
        observer: '_setComponentName'
      },
      /**
       * Is the route of bower.json component by default is ../../bower.json
       */
      bower: {
        type: String,
        value: '../../bower.json'
      },
      /**
       * Is the route of analysis.json component by default is '../../analysis.json'
       */
      descriptorUrl: {
        type: String,
        value: '../../analysis.json'
      },
      /**
       * Is the route of css component by default is '../../component-name-styles.html'
       */
      cssUrl: {
        type: String
      },
      _metadata: {
        type: Object,
        value: function () {
          return {};
        }
      },
      _analysis: {
        type: Object,
        value: function () {
          return {};
        },
      },
      _cssStyles: {
        type: String
      },
      _cssVars: {
        type: Array,
        value: function () {
          return [];
        },
      },
      _cssMixins: {
        type: Object,
        value: function () {
          return {};
        },
      },
      _propertiesComponent: {
        type: Array,
        value: function () {
          return [];
        }
      },
      _eventsComponent: {
        type: Array,
        value: function () {
          return [];
        }
      },
      _methodsComponent: {
        type: Object,
        value: function () {
          return {};
        }
      },
      _slotsComponent: {
        type: Array,
        value: function () {
          return [];
        }
      },
      /**
       * If it´s true show the demo page
       */
      showDemo: {
        type: Boolean,
        value: false,
        observer: '_setDemo'
      },
      /**
       * The number of demo property is selected
       * component responsive: 0
       * component properties: 1
       * component css vars: 2
       * component methods: 3
       * component slot: 4
       * component data: 5
       */
      optionSelected: {
        type: Number,
        value: 0
      },
      /**
       * If it´s true show the demo page
       */
      device: {
        type: Array,
        value: function () {
          return {
            'width': '360px',
            'height': '480px'
          };
        }
      },
      /**
       * This show the built of component
       */
      padding: {
        type: Number,
        value: 0
      },
      /**
       * This show the built of component
       */
      builtComponent: {
        type: String
      },
      /**
       * This show the built of component
       */
      allowSlot: {
        type: Boolean,
        value: false
      },
      /**
       * Save the slots content
       */
      _slotted: {
        type: String
      },
      /**
       * This property built the iframe
       */
      _builtIframe: {
        type: String
      }
    },

    ready: function () {
      Polymer.RenderStatus.afterNextRender(this, function() {
        var that = this;
        this._eventsComponent.forEach(function(element) {
          window.addEventListener(element.name, function (e) {
            alert('envia evento')
            that._showToast(e);
            if(e.detail !== null) {
              that.$.toastContent.innerHTML=e.detail
            }
          })
        })
      });
    },

    _showToast: function (e) {
      console.log('pasando por aquí')
      this.$$('#toast').text = e.type;
      this.$$('#toast').open();
    },

    _getBower: function () {

    },
    _getBowerError: function () {
      console.error('This component has problem to show the bower, please define bower property with your route');
    },
    _getCss: function (e) {
      this._cssVarsformated();
      this._cssMixinsformated();
      this._buildIframe();
    },
    _getCssError: function () {
      console.error('This component has problem to show the css, please define cssFile property with your route');
    },
    _cssVarsformated: function () {
      var arrVars = [];
      var array = [];
      // Find the first word
      var reg1 = /([^\s]+)/;
      // Find the second word
      var reg2 = /\s+([^\s]+)/;

      this._cssStyles.split('var(').forEach(function (element, i) {
        if (i > 0) {
          var item = this._cssStyles.split('var(')[i].match(reg1)[0].slice(0, -1);
          var value = this._cssStyles.split('var(')[i].match(reg2)[0].slice(1, -2);
          if (array.indexOf(item) === -1) {
            if (this._cssStyles.split('var(')[i].match(reg2)[0].slice(-3) === '));') {
              value = this._cssStyles.split('var(')[i].match(reg2)[0].slice(1, -3);
            }
            arrVars.push({
              "varName": item,
              "description": item.slice(this.componentName.length + 3),
              "value": value,
              "special": item.slice(-5) === 'color' ? 'color' : ''
            });
            array.push(item);
          }
        }
      }, this);
      this._cssVars = arrVars;
    },
    _cssMixinsformated: function () {
      var arrMixins = [];
      var mixins = this._cssStyles.toString().match(new RegExp(`@apply --${this.componentName}(-*\\w*)*`, 'g'));
      mixins.forEach(function (element) {
        if (element.slice(this.componentName.length + 10) !== "") {
          arrMixins.push({
            "mixin": element.slice(7),
            "description": "empty mixin for ." + element.slice(this.componentName.length + 10)
          });
        } else {
          arrMixins.push({
            "mixin": element.slice(7),
            "value": "empty mixin for :host"
          });
        }
      }, this);
      this._cssMixins = arrMixins;
    },
    _getAnalysis: function () {
      var properties = [];
      var slots = [];
      //Formated Array for _propertiesComponent
      this._analysis.elements[0].properties.forEach(function (element) {
        properties.push({
          "name": element.name,
          "nameHtml": element.name.replace(/(?:^|\.?)([A-Z])/g, function (x,y){return "-" + y.toLowerCase()}).replace(/^_/, ""),
          "description": element.description,
          "defaultValue": element.defaultValue !== "null" && element.type === "string" ? element.defaultValue.slice(1, -1) : element.defaultValue === "null" ? '' : element.defaultValue,
          "privacy": element.privacy,
          "type": element.type,
          "special": element.name.slice(-5) === 'color' ? 'color' : ''
        });
      });
      //Formated Array for _eventsComponent
      this.set('_eventsComponent', this._analysis.elements[0].events);
      //Formated Array for _methodsComponent
      this.set('_methodsComponent', this._analysis.elements[0].methods);
      //Formated Array for _slotsComponent
      this._analysis.elements[0].slots.forEach(function(element) {
        slots.push({
          "name": element.name,
          "description": element.description
        });
      });

      this._slotsComponent = slots;
      /**
       * Format the slotted property
       */
      var slotted = '';
      this._slotsComponent.forEach(function(element) {
        slotted += `
        <div slot="${element.name}">
          ${element.name} slot
        </div>
        `
      });
      this._slotted = slotted;

      this._propertiesComponent = properties;
    },
    _getAnalysisError: function () {
      console.error('This component has problem to show the analysis, please define descriptorUrl property with your route');
    },
    _computeLibrary(library) {
      switch (library) {
        case 'Polymer 1':
        case 'Polymer hybrid':
        case 'Polymer 2':
        case 'Polymer 3':
          return '../adom-demo-helper-properties/images/polymer.svg';
          break;
        case 'VueJs':
          return '../adom-demo-helper-properties/images/vuejs.svg';
          break;
        case 'Angular 1':
        case 'Angular 2':
          return '../adom-demo-helper-properties/images/angular.svg';
          break;
        default:
          return;
          break;
      }
    },
    _computeProperties: function (property) {
      return property.privacy === 'public' ? false : true;
    },
    _computeType: function(property) {
      if (property.type === "boolean") {
        return true;
      } else {
        return false;
      }
    },
    _computeColor: function(item) {
      return item.special === 'color' ? true : false;
    },
    _setDevice(e) {
      var device;
      switch (e.currentTarget) {
        case this.$.mobile:
          this.$.phone.classList.remove('main__content__wrap__views__demo__fullsize');
          this.$.phone.classList.add('main__content__wrap__views__demo__phone');
          device = {
            'width': '360px',
            'height': '480px'
          }
          break;
        case this.$.tablet:
          this.$.phone.classList.remove('main__content__wrap__views__demo__fullsize');
          this.$.phone.classList.add('main__content__wrap__views__demo__phone');
          device = {
            'width': '768px',
            'height': '1024px'
          }
          break;
        case this.$.desktop:
          this.$.phone.classList.remove('main__content__wrap__views__demo__fullsize');
          this.$.phone.classList.add('main__content__wrap__views__demo__phone');
          device = {
            'width': '1024px',
            'height': '769px'
          }
          break;
        case this.$.fullsize:
          device = {
            'width': '100%',
            'height': '769px'
          }
          this.async(function () {
            this.$.phone.classList.remove('main__content__wrap__views__demo__phone');
            this.$.phone.classList.add('main__content__wrap__views__demo__fullsize');
          }, 600);
          break;

      }
      this.device = device;
    },
    _setComponentName: function (value) {
      this.cssUrl = '../../' + value + '-styles.html'
    },
    _setView: function (e) {
      if (e.currentTarget === this.$.buttonDemo) {
        this.showDemo = true;
      } else {
        this.showDemo = false;
      }
      e.currentTarget.blur();
    },
    _setDemo: function (value) {
      if (value) {
        this.$.selector.classList.add('transition');
        this.$.viewDoc.classList.add('transition');
        this.$.viewDemo.classList.add('transition');
        this.$.titleView.innerHTML = 'Demo';
      } else {
        this.$.selector.classList.remove('transition');
        this.$.viewDoc.classList.remove('transition');
        this.$.viewDemo.classList.remove('transition');
        this.$.titleView.innerHTML = 'Documentación';
      }
    },
    _buildComponent: function () {
      var properties = '';
      var styles = '';
      /**
       * Format the properties of component
       */
      this._propertiesComponent.forEach(function (element) {
        if (element.type === 'string' && element.defaultValue !== "") {
          properties += element.nameHtml + '="' + element.defaultValue + '" ';
        }
        if(element.type === 'boolean') {
          if(element.defaultValue === 1) {
            element.defaultValue = 'true';
          } else {
            element.defaultValue = 'false';
          }
        }
        if (element.type === 'boolean' && element.defaultValue === 'true') {
          properties += element.nameHtml + ' ';
        }
        if (element.type === 'Array' && element.defaultValue !== '[]') {
          properties += element.nameHtml + "='" + element.defaultValue + "'"
        }
      });

      /**
       * Format the styles of component
       */
      this._cssVars.forEach(function(element) {
        styles += `${element.varName}: ${element.value};
          `
      });

      this.allowSlot = this.$.checkSlot.checked;

      this.builtComponent = `
      <style is="custom-style">
      ${this.componentName} {
        ${styles}
      }
      </style>
      <${this.componentName} ${properties}>
      ${this.allowSlot ? this._slotted : ''}
      <${this.componentName}/>`
    },
    _buildIframe: function () {
      this._buildComponent();
      this._builtIframe = `<!doctype html>
      <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
        <title>${this.componentName} demo</title>
        <script src="../../webcomponentsjs/webcomponents-lite.js"></script>
        <script>
          window.Polymer = {
            dom: 'shadow',
            lazyRegister: 'true',
            useNativeCSSProperties: 'true'
          }
        </script>
        <link rel="stylesheet" type="text/css" href="https://fonts.googleapis.com/css?family=Roboto+Mono:400,700|Roboto:400,300,300italic,400italic,500,500italic,700,700italic" crossorigin="anonymous">
        <link rel="import" href="../${this.componentName}.html">
        <style is="custom-style" include="demo-pages-shared-styles">
          /*Common styles*/
          body {
            font-family: Roboto;
            margin: 0;
            background-color: #fff;
            padding: ${this.padding}px;
            box-sizing: border-box;
          }
        </style>
      </head>
      <body>
        <template is="dom-bind">
          ${this.builtComponent}
        </template>
      </body>
      </html>
      `
    }

  });
}());
