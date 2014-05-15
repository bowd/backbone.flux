(function() {
  Backbone.Flux = {
    Mixins: {}
  };

}).call(this);

(function() {
  Backbone.Flux.Store = _.extend(Backbone.Events, {
    isStore: true
  });

  Backbone.Flux.ModelStore = _.extend(Backbone.Flux.Store, {
    models: {},
    require: function(id) {
      var _base;
      return (_base = this.models)[id] != null ? _base[id] : _base[id] = this.loadModel(id);
    },
    loadModel: function(id) {
      var instance;
      if (!this.model) {
        throw 'Model not specified on store';
      }
      instance = new this.model({
        id: id
      });
      instance.fetch();
      instance.on('all', (function(_this) {
        return function(ev) {
          var m, uri_ev;
          uri_ev = "" + id + ":" + ev;
          if (m = /change:(.*)/.exec(ev)) {
            return _this.trigger(uri_ev, instance.get(m[1]));
          } else {
            return _this.trigger(uri_ev);
          }
        };
      })(this));
      return instance;
    },
    update: function(id, attributes) {
      return this.models[id].save(attributes, {
        patch: true,
        success: (function(_this) {
          return function() {
            var attr, v;
            for (attr in attributes) {
              v = attributes[attr];
              _this.trigger("" + id + ":update:" + attr + ":success");
            }
            return _this.trigger("" + id + ":update:success");
          };
        })(this),
        error: (function(_this) {
          return function() {
            var attr, v;
            for (attr in attributes) {
              v = attributes[attr];
              _this.trigger("" + id + ":update:" + attr + ":error");
            }
            return _this.trigger("" + id + ":update:error");
          };
        })(this)
      });
    }
  });

}).call(this);

(function() {
  Backbone.Flux.Mixins.StoreBinding = {
    componentWillMount: function() {
      return this.bindStoreEventsFor(this.props);
    },
    componentWillReceiveProps: function(next_props) {
      return this.bindStoreEventsFor(next_props, this.props);
    },
    bindStoreEventsFor: function(props, old_props) {
      var action, ev, evd, events, fn, normalised_ev, old_normalised_ev, store, storekey, _ref, _results;
      _ref = this.storeEvents;
      _results = [];
      for (storekey in _ref) {
        events = _ref[storekey];
        store = this.normaliseStore(storekey);
        _results.push((function() {
          var _ref1, _results1;
          _results1 = [];
          for (evd in events) {
            fn = events[evd];
            _ref1 = this.splitActionEvent(evd), action = _ref1[0], ev = _ref1[1];
            normalised_ev = this.normaliseStoreEvent(ev, props);
            if (old_props !== void 0) {
              old_normalised_ev = this.normaliseStoreEvent(ev, old_props);
              if (normalised_ev !== old_normalised_ev) {
                store.off(old_normalised_ev, this[fn]);
                _results1.push(store[action](normalised_ev, this[fn]));
              } else {
                _results1.push(void 0);
              }
            } else {
              _results1.push(store[action](normalised_ev, this[fn]));
            }
          }
          return _results1;
        }).call(this));
      }
      return _results;
    },
    splitActionEvent: function(evd) {
      var action, ev, _ref;
      _ref = evd.split(' '), action = _ref[0], ev = _ref[1];
      if (!_.present(ev)) {
        ev = action;
        action = 'on';
      }
      return [action, ev];
    },
    normaliseStore: function(storekey) {
      var store;
      store = _.inject(storekey.split('.'), function(memo, el) {
        return memo[el] || {};
      }, window);
      if (store.isStore === false) {
        throw "Storekey " + storekey + " does not seam to point to a store.";
      } else {
        return store;
      }
    },
    normaliseStoreEvent: function(ev, props) {
      var ev_parts;
      ev_parts = ev.split(':');
      return _.map(ev_parts, function(ev_part) {
        var m, prop;
        if (m = /<(.*)>/.exec(ev_part)) {
          prop = m[1];
          if (!(prop in props)) {
            throw "Event segment must be a part of the properties";
          }
          return props[prop];
        } else {
          return ev_part;
        }
      }).join(':');
    }
  };

}).call(this);
