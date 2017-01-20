const imageSearch = require('../api/image');
const mapSearch = require('../api/maps');

module.exports = {
  ImageSearch: (json) => {
    let count = null;
    let query = '';
    const entities = json.entities;
    const params = json.parameters;
    if(entities){
      for (var i = 0; i < entities.length; i++) {
        if(entities[i].type === 'SearchWord'){
          query = entities[i].value
        }
        if(entities[i].type === 'builtin.number'){
          count = Number(entities[i].value)
        }
      }
    }
    if(params){
      for (var i = 0; i < params.length; i++) {
        if(params[i].type === 'SearchWord'){
          query = params[i].value
        }
        if(params[i].type === 'builtin.number'){
          count = Number(params[i].value)
        }
      }
    }

      return imageSearch.get(query, count).then(result => {
        return result;
      });
    return null;
  },
  Directions: (json) => {
    let start = null;
    let end = null;
    const entities = json.entities;
    const params = json.parameters;
    if(entities){
      for (var i = 0; i < entities.length; i++) {
        if(entities[i].type === 'Location::FromLocation'){
          start = entities[i].value;
        }
        if(entities[i].type === 'Location::ToLocation'){
          end = entities[i].value;
        }
      }
    }
    if(params){
      for (var i = 0; i < params.length; i++) {
        if(params[i].type === 'Location::FromLocation' && params[i].value){
          start = params[i].value
        }
        if(params[i].type === 'Location::ToLocation' && params[i].value){
          end = params[i].value
        }
      }
    }
    return mapSearch.get(start, end).then(result => {return result;});
  },
  Greeting: (json) => {
    let randomIndex = Math.floor(Math.random() * 6);
    let array = ['Hi!', 'Hello my friend.', 'Hi, whats up?', 'Yo dude', 'Greetings mate', 'Yellow!'];
    return array[randomIndex];
  },
  None: (json) => {
    return null;
  }
};
