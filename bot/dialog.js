const settings = require('../setting');
const unirest = require('unirest');
const actions = require('./actions');


const call = (query, contextId) => {
  return new Promise((resolve, reject) => {
    let url = contextId ? `${settings.luis}&q=${query}&contextid=${contextId}` : `${settings.luis}&q=${query}`;
    unirest.get(url)
    .headers({
      'Accept': 'application/json'
    })
    .send()
    .end(response => {
      if(response.code === 200){
        return resolve(response.body);
      } else {
        reject();
      }
    })
  })
};

const callAction = (result) => {
  return new Promise((resolve, reject) => {
    if(result.doNext === 'action'){
      resolve({
        query: result.query,
        result: actions[result.intent.intent](result)
      });
    } else {
      reject();
    }
  })
};


module.exports = {
  callBot: (query, contextId) => {
    return call(query, contextId);
  },
  doNext: (botResponse) => {
    console.log(botResponse);
    return new Promise((resolve, reject) => {
      if(botResponse.dialog){
        switch (botResponse.dialog.status) {
          case 'Question':
            resolve({
              query: botResponse.query,
              doNext: 'answer',
              botAnswer: botResponse.dialog.prompt,
              contextId: botResponse.dialog.contextId
            });
            break;
          case 'Finished':
            resolve({
              query: botResponse.query,
              doNext: 'action',
              intent: botResponse.topScoringIntent,
              parameters: botResponse.topScoringIntent.actions[0].parameters.map((param) => {
                return {
                  value: param.value ? param.value[0].entity : null,
                  type: param.type
                };
              }),
              entities: botResponse.entities.map((entity) => {
                return {
                  value: entity.entity,
                  type: entity.type
                };
              })
            });
            break;
          default:
            break;
        }
      } else {
        resolve({
          query: botResponse.query,
          doNext: 'action',
          intent: botResponse.topScoringIntent,
          entities: botResponse.entities.map((entity) => {
            return {
              value: entity.entity,
              type: entity.type
            };
          })
        })
      }
    })

  },
  doAction: (result) => {
    return callAction(result);
  }
}
