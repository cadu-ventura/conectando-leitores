import { ApiProperty } from '@nestjs/swagger';
export interface QueryPagination {
	page: number;
	limit: number;
}

export const PaginationHelper = (array, page, limit) => {
	if (!page || !limit) return array;

	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;

	return array.slice(startIndex, endIndex);
};


export class PaginationQuery {

	@ApiProperty({ required: false })
		page?: number;

	@ApiProperty({ required: false })
		limit?: number;
}
