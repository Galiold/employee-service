exports.insertSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: {
      type: 'string'
    },
    data: {
      type: 'object'
    },
    parent: {
      type: 'string'
    },
    org: {
      type: 'string'
    }
  },
  required: [
    'id',
    'data',
    'parent',
    'org'
  ]
}

exports.findSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: {
      type: 'string'
    },
    org: {
      type: 'string'
    }
  },
  required: [
    'id',
    'org'
  ]
}

exports.updateSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    id: {
      type: 'string'
    },
    data: {
      type: 'object'
    },
    parent: {
      type: 'string'
    },
    org: {
      type: 'string'
    }
  },
  required: [
    'id',
    'data',
    'parent',
    'org'
  ]
}
