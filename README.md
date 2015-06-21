# reflux-state-mixin

Mixin for [reflux](https://www.npmjs.com/packages/reflux) stores to enable them to have `state`, similar to React components. 


## Usage

```javascript

// myStore.js
var Reflux = require('reflux');
var StateMixin = require('reflux-state-mixin')(Reflux);
var Actions = require('./../actions/AnimalsActions'); 

var AnimalStore = module.exports = Reflux.createStore({
  mixins: [StateMixin],
  listenables: Actions,

  getInitialState(){
    return{
      dogs:5,
      cats:3
    }
  },

  onNewDogBorn: function() {
        this.setState({dogs:this.state.dogs+1})
  }

});
```

```javascript

var AnimalStore = require('./AnimalStore.js');

var DogsComponent = React.createClass({
    mixins:[Reflux.ListenerMixin],
    getInitialState: function (){
      return({
          dogs:AnimalStore.state.dogs
      })
    },
    componentDidMount: function(){
        this.listenTo(AnimalStore.dogs,this.updateDogs);
    },
    updateDogs: function(dogs){
        console.log('comp action')
        console.log(dogs)
        this.setState({dogs:dogs});
    },
    render: function () {
        return (<div><p>We have {this.state.dogs} dogs</p></div>);
    }
});

```

## Installation

```bash
$ npm install reflux-state-mixin --save
```

## some details
`GetInitialState()` in store should have all of the states from the beginning.  
`setState()` is checking to see if there is a difference between new `state.key` from current `state.key`. If not, this specific `state.key` it's not triggering.
For any `setState()` the entire store is triggering (regardless of changes), allowing any Component or other Store to listen to the entire Store's state.

## acknowledgments
This mixin is combination of two other mixins - 
[triggerables-mixin](https://github.com/jesstelford/reflux-triggerable-mixin), a really useful mixin for controlling the trigger of the stores. Also see [this](https://github.com/spoike/refluxjs/issues/158) for details. 
And [state-mixin](https://github.com/spoike/refluxjs/issues/290) 

I thank @jehoshua02 and @jesstelford for their valuable code. 
