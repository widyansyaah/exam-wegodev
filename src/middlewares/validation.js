const useValidation = (schema, data) => schema.validateSync(data)


module.exports = {
    useValidation
}