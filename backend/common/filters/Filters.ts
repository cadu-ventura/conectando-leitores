export const searchFilterQueries = (fields, queryFilters) => {
  const searchQueries = {};

  const parseBoolean = (value: string): boolean => {
    return value.toLowerCase() === 'true';
  };

  if (queryFilters.hasOwnProperty('status') && queryFilters.status !== '') {
    queryFilters.status = parseBoolean(queryFilters.status);
  } else {
    delete queryFilters.status;
  }

  fields.forEach((field) => {
    if (queryFilters.hasOwnProperty(field)) {
      if (field === 'createdAt' || field === 'updatedAt') {
        const dateFilter = new Date(queryFilters[field]);

        const dateLimit = new Date(queryFilters[field]);

        dateLimit.setDate(dateFilter.getDate() + 1);

        searchQueries[field] = { $gte: dateFilter, $lt: dateLimit };

      } else if (typeof queryFilters[field] === 'string') {
        searchQueries[field] = { $regex: queryFilters[field], $options: 'i' };
      } else {
        searchQueries[field] = queryFilters[field];
      }
    }
  });
  return searchQueries;
};
