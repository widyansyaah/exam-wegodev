const get = (dataResponse) => (
    {
    code: 200,
    message: 'Get Data Successfully',
    ...dataResponse
}) 

const create = (dataResponse) => ({
    code: 201,
    message: 'Data Created',
    ...dataResponse
})

const update = (dataResponse) => ({
    code: 200,
    message: 'Data Updated',
    ...dataResponse
})

const del = (dataResponse) => ({
    code: 200,
    message: 'Data Deleted',
    ...dataResponse
})

module.exports = {
    get,
    create,
    update,
    del
}