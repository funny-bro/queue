
const landBuildRecord = {
  type: 'object',
  properties: {
    landBuild: { 
     type: 'string',
     required: true,
     minLength: 1
    },
    data: { 
     type: 'string',
    }
  }
}

module.exports = landBuildRecord