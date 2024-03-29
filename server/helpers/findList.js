const defaultParams = {
  start: 0,
  limit: 10
}

const findList = (params, query, model) => {
  const limit = (params.limit && !isNaN(params.limit)) ? parseInt(params.limit) : defaultParams.limit
  const skip = (params.start && !isNaN(params.start)) ? parseInt(params.start) : defaultParams.start

  return model.find({...query}, {}, { skip, limit })
}

export default findList
