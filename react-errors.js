define(function(require) {
    var React = require("react");
    var _ = require("underscore");

    return {
        componentWillMount: function() {
            this.state._errors = {};
            this.__forceState = true;
            this.__nextState = null;
            this.__nextProps = null;
        },
        addError: function(field, name, error, marksInvalid) {
            marksInvalid = _.isUndefined(marksInvalid) || marksInvalid;
            var state = this.__nextState || this.state;
            if(!state._errors[field]) {
                state._errors[field] = {};
            }
            state._errors[field][name] =  {
                error:error,
                marksInvalid:marksInvalid
            }
            if(this.__forceState) {
                this.setState(state);
            }
        },
        clearError: function(field, name) {
            var state = this.__nextState || this.state;
            if(!state._errors[field])
                return
            delete state._errors[field][name];
            if(this.__forceState) {
                this.setState(state);
            }
        },
        formErrors: function(field) {
            if(!this.state._errors[field]) {
                return [];
            }
            return _.pluck(this.state._errors[field], 'error');
        },
        formValid: function() {
            var state = this.__nextState || this.state
            var props = this.__nextProps || this.props
            this.__forceState = false;
            this.checkForm(state, props);
            this.__forceState = true;
            return !_.chain(state._errors)
                .values()
                .map(_.values)
                .flatten()
                .any(_.matches({marksInvalid:true}))
                .value();
        },
        componentWillUpdate: function(nextProps, nextState) {
            this.__forceState = false;
            this.__nextState = nextState;
            this.__nextProps = nextProps;
            this.checkForm(nextState, nextProps);
        },
        componentDidUpdate: function(nextProps, nextState) {
            this.__forceState = true;
            this.__state = null;
        }
    };
});

