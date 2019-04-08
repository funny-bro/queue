
const history = {
  type: 'object',
  properties: {
    type: { 
     type: 'string',
     minLength: 1
    },
    count: { 
     type: 'number',
    }
  }
}

module.exports = history