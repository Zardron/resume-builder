export const optimizePopulate = (populateOptions = []) => {
  return populateOptions.map(option => {
    if (typeof option === 'string') {
      return { path: option, select: '-password -__v' };
    }
    return {
      ...option,
      select: option.select || '-password -__v',
    };
  });
};

export const buildPagination = (queryParams, defaults = { limit: 50, skip: 0 }) => {
  const limit = Math.min(parseInt(queryParams.limit) || defaults.limit, 100);
  const skip = Math.max(parseInt(queryParams.skip) || defaults.skip, 0);
  return { limit, skip };
};

export const buildSort = (sortBy, sortOrder = 'desc', defaultSort = { createdAt: -1 }) => {
  if (!sortBy) return defaultSort;
  const order = sortOrder === 'asc' ? 1 : -1;
  return { [sortBy]: order };
};

export const buildSearchQuery = (searchTerm, fields = []) => {
  if (!searchTerm || !fields.length) return {};
  return {
    $or: fields.map(field => ({
      [field]: { $regex: searchTerm, $options: 'i' },
    })),
  };
};

export const buildDateRangeQuery = (startDate, endDate, field = 'createdAt') => {
  const query = {};
  if (startDate) query[field] = { ...query[field], $gte: new Date(startDate) };
  if (endDate) query[field] = { ...query[field], $lte: new Date(endDate) };
  return Object.keys(query).length > 0 ? query : {};
};

export const optimizedFind = async (Model, query = {}, options = {}) => {
  const { populate = [], sort = { createdAt: -1 }, limit, skip = 0, select } = options;
  
  let q = Model.find(query);
  
  if (populate.length > 0) {
    optimizePopulate(populate).forEach(pop => {
      q = q.populate(pop);
    });
  }
  
  if (select) q = q.select(select);
  q = q.sort(sort);
  
  if (limit) q = q.limit(limit).skip(skip);
  
  return q.exec();
};

export const getTotalCount = async (Model, query = {}) => {
  return Model.countDocuments(query);
};

