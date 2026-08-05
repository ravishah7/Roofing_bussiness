/**
 * Reusable query builder for list endpoints: filtering, searching,
 * sorting, field selection, and pagination on top of a Mongoose Query.
 *
 * Usage:
 *   const features = new ApiFeatures(Blog.find(), req.query)
 *     .filter()
 *     .search(['title', 'excerpt'])
 *     .sort('-createdAt')
 *     .paginate()
 *   const docs = await features.query.lean()
 *   const meta = await features.getMeta(Blog)
 */
class ApiFeatures {
  constructor(query, queryString) {
    this.query = query
    this.queryString = queryString
    this.filters = {}
  }

  filter() {
    const excluded = ['page', 'limit', 'sort', 'fields', 'search', 'q']
    const queryObj = { ...this.queryString }
    excluded.forEach((field) => delete queryObj[field])

    // Support gte/gt/lte/lt operators e.g. ?price[gte]=100
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
    const parsed = JSON.parse(queryStr)

    this.filters = { ...this.filters, ...parsed }
    this.query = this.query.find(parsed)
    return this
  }

  search(fields = []) {
    const term = this.queryString.search || this.queryString.q
    if (term && fields.length) {
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      const searchOr = fields.map((field) => ({ [field]: regex }))
      this.filters = { ...this.filters, $or: searchOr }
      this.query = this.query.find({ $or: searchOr })
    }
    return this
  }

  sort(defaultSort = '-createdAt') {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(',').join(' ')
      this.query = this.query.sort(sortBy)
    } else {
      this.query = this.query.sort(defaultSort)
    }
    return this
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(',').join(' ')
      this.query = this.query.select(fields)
    } else {
      this.query = this.query.select('-__v')
    }
    return this
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1)
    const limit = Math.min(parseInt(this.queryString.limit, 10) || 10, 100)
    const skip = (page - 1) * limit

    this.query = this.query.skip(skip).limit(limit)
    this.pagination = { page, limit, skip }
    return this
  }

  async getMeta(Model) {
    const total = await Model.countDocuments(this.filters)
    const { page = 1, limit = 10 } = this.pagination || {}
    return {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    }
  }
}

export default ApiFeatures
