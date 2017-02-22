const settings = require('../setting');
const unirest = require('unirest');
const mapJson = (mapObject, start, end) => {
  if(mapObject.routes && mapObject.routes.length > 0){
    return `Distance between ${start} and ${end}: ${mapObject.routes[0].legs[0].distance.text}`;
  }
  return 'No routes available';
};

module.exports = {
  get: (start, end) => {
    console.log(start, end);
    if(start && end){
      return new Promise((resolve, reject) => {
      unirest.get(encodeURI(`${settings.directions}?key=${settings.directionsToken}&origin=${start}&destination=${end}`))
      .headers({
        'Accept': 'application/json; charset=UTF-8'
      })
      .send()
      .end((response) => {
        if(response.code === 200){
          resolve(mapJson(response.body, start, end));
        } else {
          resolve("I'm sorry. I cant find what you are looking for :/");
        }
      })
    });
    }
  }
}
