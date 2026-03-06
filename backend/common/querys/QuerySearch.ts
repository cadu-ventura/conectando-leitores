import { ApiQueryOptions } from '@nestjs/swagger';

export interface QuerySearch {
	query: string;
}

export const querySearch: ApiQueryOptions = {
	name: 'query',
	type: String,
	required: false
};

export const searchQueries = (array, query) => {
	const searchQueries = array.map(field => ({
		[field]: { $regex: query, $options: 'i' }
	}));

	const finalQuery = { $or: searchQueries };
	return finalQuery;
};
