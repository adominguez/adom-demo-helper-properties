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
        observer: '_computedHeading'
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

    _computedHeading: function() {
      this.$$('#heading').innerHTML = this.children[0].getAttribute('data-heading');
      this.$$('#description').innerHTML = this.children[0].getAttribute('data-description');
    },
    _showToast: function(e) {
      this.$$('#toast').text = e.type;
      this.$$('#toast').open();
    },
    _setProperties: function() {
      var newProperties = "";
      var html="";
      var snippet="";
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
      html = '<template is="dom-bind"><'+ this.componentName + ' ' + newProperties + '></'+ this.componentName + '></template>'
      snippet = '<'+ this.componentName + ' ' + newProperties + '></'+ this.componentName + '>'
      this.children[0].innerHTML = html;
      this.children[0]._markdown = '```' + snippet + '```';
    }

  });
}());
