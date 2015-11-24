'use strict';

var utils = require('./utils.js');

/**
 * Creates the mixin, ready for use in a store
 *
 * @param Reflux object An instance of Reflux
 * @returns {{setState: Function, init: Function}}
 */
module.exports = function stateMixin(Reflux) {

  if (typeof Reflux !== 'object' || typeof Reflux.createAction !== 'function') {
    throw new Error('Must pass reflux instance to reflux-state-mixin');
  }

  function attachAction(options, actionName) {
    if (this.stateActions[actionName]) {
      console.warn(
          'Not attaching event ' + actionName + '; key already exists'
      );
      return;
    }
    this.stateActions[actionName] = Reflux.createAction(options);
  }

  return {
    setState: function (state) {
      var changed = false;
      var prevState = utils.extend({}, this.state);

      for (var key in state) {
        if (state.hasOwnProperty(key)) {
          if (this.state[key] !== state[key]) {
            this.stateActions[key].trigger(state[key]);
            changed = true;
          }
        }
      }

      if (changed) {
        this.state = utils.extend(this.state, state);

        if (utils.isFunction(this.storeDidUpdate)) {
          this.storeDidUpdate(prevState);
        }

        this.trigger(this.state);
      }

    },

    init: function () {
      if (utils.isFunction(this.getInitialState)) {
        this.state = this.getInitialState();
        this.stateActions = {};
        for (var key in this.state) {
          if (this.state.hasOwnProperty(key)) {
            attachAction.call(this, this.state[key], key);
          }
        }
      }
    },

    connect: function (store, key) {
      return {
        getInitialState: function () {
          if (!utils.isFunction(store.getInitialState)) {
            return {};
          } else if (key === undefined) {
            return store.state;
          } else {
            return utils.object([key], [store.state[key]]);
          }
        },
        componentDidMount: function () {
          utils.extend(this, Reflux.ListenerMethods);
          var noKey = key === undefined;
          var me = this,
              cb = (noKey ? this.setState : function (v) {
                if (typeof me.isMounted === "undefined" || me.isMounted() === true) {
                  me.setState(utils.object([key], [v]));
                }
              }),
              listener = noKey ? store : store.stateActions[key];
          this.listenTo(listener, cb);
        },
        componentWillUnmount: Reflux.ListenerMixin.componentWillUnmount
      }
    }
  }
};


