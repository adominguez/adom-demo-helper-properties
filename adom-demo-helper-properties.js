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
        observer: '_setHeading'
      },
      _file: {
        type: String,
        observer: '_setFile'
      },
      _scss: {
        type: String,
        observer: '_setScss'
      },
      _mixins: {
        type: Array,
        value: function () {
          return [];
        }
      },
      /**
       * set the events fired
       */
      toastEvents: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true,
      },
      /**
       * component properties setted
       */
      propertiesSetted: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true
      },
      _propertiesBinded: {
        type: Array,
        value: function () {
          return [];
        },
        notify: true,
        observer: '_setProperties'
      },
      /**
       * selected in paper-tabs
       */
      selected: {
        type: Number,
        value: 0,
        notify: true,
        reflectToAttribute: true
      }
    },

    ready: function () {
      for (var i = 0; i < this.toastEvents.length; i++) {
        this.addEventListener(this.toastEvents[i], function (e) {
          this._showToast(e);
          if(e.detail.value) {
            this.$.toastContent.innerHTML=e.detail.value
          }
        })
      }
    },

    _setHeading: function (componentName) {
      this.$$('#heading').innerHTML = this.children[0].getAttribute('data-heading');
      this.$$('#description').innerHTML = this.children[0].getAttribute('data-description');
      this._file = '../bower_components/' + componentName + '/' + componentName + '-styles.html';
    },

    _setFile: function() {
      var self = this;
      /**
       * Call for get the scss file of component
       */
      var request = new XMLHttpRequest();
      request.open('GET', self._file, true);
      var secondFile = '../' + self.componentName + '-styles.html';
      request.onload = function () {
        if (request.status >= 200 && request.status < 400) {
          // Save the scss in a property
          self._scss = request.responseText;
        }
        else if (self._file !== secondFile) {
          self._file = secondFile;
          self._setFile();
        }
        else {
          self._propertiesBinded = self.propertiesSetted;
          console.error('file not found');
        }
      };
      request.onerror = function () {
        ajaxErr(request);
      };
      request.send();
    },

    _showToast: function (e) {
      this.$$('#toast').text = e.type;
      this.$$('#toast').open();
    },

    _setProperties: function () {
      var newProperties = "";
      var html = "";
      var snippet = "";
      var style = "";

      if (this._mixins.length > 0) {
        style += `<style is="custom-style">
          ${this.componentName} {`
        for (var j = 0; j < this._mixins.length; j++) {
          style += `
              ${this._mixins[j].mixin} : ${this._mixins[j].value};`
        }
        style += `
          }
      </style>`
      }

      for (var i = 0; i < this._propertiesBinded.length; i++) {

        if ((this._propertiesBinded[i].list) && (this._propertiesBinded[i].list[this._propertiesBinded[i].selected].value !== "false")) {
          if (this._propertiesBinded[i].list[this._propertiesBinded[i].selected].value === "true") {
            newProperties += ' ' + this._propertiesBinded[i].label;
          } else {
            newProperties += this._propertiesBinded[i].label + '="' + this._propertiesBinded[i].list[this._propertiesBinded[i].selected].value + '" ';
          }
        } else {
          if (!this._propertiesBinded[i].list) {
            newProperties += this._propertiesBinded[i].label + '="' + this._propertiesBinded[i].value + '" '
          }
        }
      }
      html = `<template is="dom-bind">
      ${style}
      <${this.componentName} ${newProperties} ></${this.componentName}>
      </template>`
      snippet = '<'+ this.componentName + ' ' + newProperties + '></'+ this.componentName + '>'
      this.children[0].innerHTML = html;
      this.children[0]._markdown = '```' + snippet + '```';
    },

    _setScss: function (_scss) {
      var mixin = [];
      var array = []
      // Find the first word
      var reg1 = /([^\s]+)/;
      // Find the second word
      var reg2 = /\s+([^\s]+)/;
      for (var i = 0; i < _scss.split('var(').length; i++) {
        if (i > 0) {
          var item = _scss.split('var(')[i].match(reg1)[0].slice(0, -1);
          var value = _scss.split('var(')[i].match(reg2)[0].slice(1, -2);
          if(array.indexOf(item) === -1) {
            if(_scss.split('var(')[i].match(reg2)[0].slice(-3) === '));') {
              value = _scss.split('var(')[i].match(reg2)[0].slice(1, -3)
            }
            mixin.push({
              "mixin": item,
              "value": value
            });
            array.push(item)
          }
        }
      }
      this._mixins = mixin;
      this._propertiesBinded = this.propertiesSetted;
    },

    _computeColor: function(item) {
      if(item.mixin.slice(-5) === 'color') {
        return true;
      }
      return false;
    }

  });
}());
