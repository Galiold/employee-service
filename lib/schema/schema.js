exports.employeeSchema = {
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