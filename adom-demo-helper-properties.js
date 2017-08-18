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
        observer: '_readFile'
      },
      scss: {
        type: String,
      },
      mixins: {
        type: Array,
        value: function() {
          return [];
        }
      },
      /**
       * set the events fired
       */
      toastEvents: {
        type: Array,
        value: function() {
          return [];
        },
        notify: true,
      },
      /**
       * set de default word for use in the id of the demos, by default is view
       */
      defaultContentId: {
        type: String,
        value: 'view'
      },
      /**
       * set the selected option in the menu
       */
      optionSelected: {
        type: Number,
        value: 0,
        observer: '_computedContent'
      },
      _event: {
        type: Object,
        value: function() {
          return {};
        },
      },
      propertiesSetted: {
        type: Array,
        value: function() {
          return [];
        },
        notify: true
      },
      _propertiesBinded: {
        type: Array,
        value: function() {
          return [];
        },
        notify: true,
        observer: '_setProperties'
      }
    },

    attached: function() {
      for(var i = 0; i < this.toastEvents.length; i++) {
        this.addEventListener(this.toastEvents[i], function(e) {
          this._showToast(e)
        })
      }
      this._propertiesBinded = this.propertiesSetted;
    },

    _computedContent: function() {
      if (this.optionSelected > this.children.length) {
        this.optionSelected = 0
      }
      var menu=[];
      for(var i = 0; i<this.children.length; i++) {
        menu.push({
          'optionName': this.children[i].getAttribute('data-heading')
        });
      }
      this.$$('#heading').innerHTML = this.children[this.optionSelected].getAttribute('data-heading');
      this.$$('#description').innerHTML = this.children[this.optionSelected].getAttribute('data-description');
    },
    _showToast: function(e) {
      this.$$('#toast').text = e.type;
      this.$$('#toast').open();
    },
    _setProperties: function() {
      var newProperties = "";
      var html="";
      var snippet="";
      var style="";

      if(this.mixins.length> 0) {
        style += '<style is="custom-style">'+ this.componentName + '{'
        for(var j = 0; i < this.mixins.length; j++) {

        }
        style += '}</style>'
      }

      for(var i = 0; i < this._propertiesBinded.length; i++) {

        if((this._propertiesBinded[i].list) && (this._propertiesBinded[i].list[this._propertiesBinded[i].selected].value !== "false")) {
          if(this._propertiesBinded[i].list[this._propertiesBinded[i].selected].value === "true") {
            newProperties += ' ' + this._propertiesBinded[i].label;
          } else {
            newProperties += this._propertiesBinded[i].label + '="' + this._propertiesBinded[i].list[this._propertiesBinded[i].selected].value +'" ';
          }
        } else {
          if(!this._propertiesBinded[i].list) {
            newProperties += this._propertiesBinded[i].label + '="' + this._propertiesBinded[i].value +'" '
          }
        }
      }
      html = '<template is="dom-bind">'+ style +'<'+ this.componentName + ' ' + newProperties + '></'+ this.componentName + '></template>'
      snippet = '<'+ this.componentName + ' ' + newProperties + '></'+ this.componentName + '>'
      this.children[this.optionSelected].innerHTML = html;
      this.children[this.optionSelected]._markdown = '```' + snippet + '```';
    },
    _readFile: function(componentName) {
      var request = new XMLHttpRequest();
      var file = '../bower_components/'+componentName+ '/' + componentName + '.scss'
      console.log(request)
      request.open('GET', file, true);
      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          this.scss = request.responseText;
          var mixin = [];
          for(var i= 0; i < this.scss.split('var(').length; i++) {
            if(i!== 0) {
              // Find the first word
              var reg1 = /([^\s]+)/;
              // Find the second word
              var reg2 = /\s+([^\s]+)/;
              mixin.push({"mixin": this.scss.split('var(')[i].match(reg1)[0].slice(0, -1), "value": this.scss.split('var(')[i].match(reg2)[0].slice(1, -2)});
            }
          }
          this.mixins = mixin;
        }
        else {
          console.error('file not found');
        }
      };
      request.onerror = function () { ajaxErr(request); };
      request.send();
    },

  });
}());
