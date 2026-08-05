import Category from '../models/Category.model.js'
import { createCrudController } from '../utils/crudFactory.js'

export const categoryController = createCrudController(Category, { searchFields: ['name', 'description'] })
