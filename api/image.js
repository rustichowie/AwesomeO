const settings = require('../setting');
const unirest = require('unirest');

const mapJson = (json) => {
  return json.value ? json.value.map((v) => {
    return {
      name: v.name,
      url: v.contentUrl,
      thumbnail: v.thumbnailUrl
    };
  }) : null;
};

module.exports = {
  get: (query, count) => {
    count = count || 1;
    return new Promise((resolve, reject) => {
      unirest.get(`${settings.imageEndpoint}?q=${query}&count=${count}&mkt=en-us&safeSearch=Moderate`)
      .headers({
        'Accept': 'application/json',
        'Ocp-Apim-Subscription-Key': settings.imageKey
      })
      .send()
      .end(response => {
        resolve(mapJson(response.body));
      })
    })
  }
}
