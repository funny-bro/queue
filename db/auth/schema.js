
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
    },
    statusNat: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    cfid: { 
     type: 'string',
     minLength: 1
    },
    cftoken: { 
     type: 'string',
     minLength: 1
    }
  }
}

module.exports = Auth