
const Section = {
  type: 'object',
  properties: {
    cityCode: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    townCode: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    sectCode: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    landBuildMax: { 
     type: 'number'
    },
    project: { 
     type: 'string',
     required: true,
     minLength: 1
    },
  }
}

module.exports = Section