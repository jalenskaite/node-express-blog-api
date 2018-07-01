const defaultParams = {
  start: 0,
  limit: 10
}

const findListAndAggregate = (params, stages, model) => {
  const limit = (params.limit && !isNaN(params.limit)) ? parseInt(params.limit) : defaultParams.limit
  const skip = (params.start && !isNaN(params.start)) ? parseInt(params.start) : defaultParams.start
  return model.aggregate([{
    $skip: skip
  },
  {$limit: limit},
  ...stages])
}

export default findListAndAggregate
