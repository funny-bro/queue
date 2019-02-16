
const Auth = {
  type: 'object',
  properties: {
    username: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    cookieValue: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    ensid: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    enuid: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    status: { 
     type: 'string',
     required: true,
     minLength: 1
    }
  }
}

module.exports = Auth