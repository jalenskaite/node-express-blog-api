const defaultParams = {
  start: 0,
  limit: 10
}

const findList = (params, query, model) => {
  const limit = (params.limit && typeof parseInt(params.limit) === 'number') ? parseInt(params.limit) : defaultParams.limit
  const skip = (params.start && typeof parseInt(params.start) === 'number') ? parseInt(params.start) : defaultParams.start

  return model.find({...query}, {}, { skip, limit })
}

export default findList
