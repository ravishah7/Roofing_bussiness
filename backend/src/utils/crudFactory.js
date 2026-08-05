import ApiError from './ApiError.js'
import ApiResponse from './ApiResponse.js'
import asyncHandler from './asyncHandler.js'
import ApiFeatures from './apiFeatures.js'

/**
 * Generic CRUD controller factory for straightforward resources
 * (Category, FAQ, Testimonial, etc.) so the same pagination/filter/
 * search/sort behavior isn't hand-rolled for every model.
 */
export function createCrudController(Model, { searchFields = [], populate = [] } = {}) {
  const getAll = asyncHandler(async (req, res) => {
    const features = new ApiFeatures(Model.find(), req.query).filter().search(searchFields).sort().limitFields().paginate()

    let query = features.query
    populate.forEach((p) => {
      query = query.populate(p)
    })

    const docs = await query.lean()
    const meta = await features.getMeta(Model)

    res.status(200).json(new ApiResponse(200, docs, `${Model.modelName} list fetched`, meta))
  })

  const getOne = asyncHandler(async (req, res) => {
    const { id } = req.params
    let query = Model.findOne(id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id })
    populate.forEach((p) => {
      query = query.populate(p)
    })
    const doc = await query
    if (!doc) throw ApiError.notFound(`${Model.modelName} not found`)
    res.status(200).json(new ApiResponse(200, doc, `${Model.modelName} fetched`))
  })

  const createOne = asyncHandler(async (req, res) => {
    const doc = await Model.create(req.body)
    res.status(201).json(new ApiResponse(201, doc, `${Model.modelName} created`))
  })

  const updateOne = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!doc) throw ApiError.notFound(`${Model.modelName} not found`)
    res.status(200).json(new ApiResponse(200, doc, `${Model.modelName} updated`))
  })

  const deleteOne = asyncHandler(async (req, res) => {
    const doc = await Model.findByIdAndDelete(req.params.id)
    if (!doc) throw ApiError.notFound(`${Model.modelName} not found`)
    res.status(200).json(new ApiResponse(200, null, `${Model.modelName} deleted`))
  })

  return { getAll, getOne, createOne, updateOne, deleteOne }
}
