import * as faker from 'faker';
import { createResourceTemplate, defaultFilter } from '@dojo/widgets/resources';

export const exampleData: any[] = [];

for (let i = 0; i < 1999; i++) {
	exampleData.push({
		value: faker.name.findName()
	});
}

exampleData.push({ value: '9999', label: '9999' });

export const template = createResourceTemplate<{ value: string }>({
	read: (request, { put, get }) => {
		const { data } = get();
		const { size, offset, query = {} } = request;
		const filteredData = Object.keys(query).length
			? data.filter((item) => defaultFilter(query, item))
			: [...data];
		put(
			{
				data: filteredData.slice(offset, offset + size),
				total: filteredData.length
			},
			request
		);
	},
	find: (request, { put, get }) => {
		const { data } = get();
		const { start, query, type, options } = request;
		const filteredData = data.filter((item) => defaultFilter(options.query, item));
		let item: any;
		let index: number | undefined;
		for (let i = 0; i < filteredData.length; i++) {
			if (defaultFilter(query, filteredData[i], type)) {
				item = filteredData[i];
				index = i;
				if (i >= start) {
					break;
				}
			}
		}
		if (item && index) {
			put(
				{
					index,
					item,
					page: Math.floor(index / options.size) + 1,
					pageIndex: index % options.size
				},
				request
			);
		}
	}
});

export const asyncTemplate = createResourceTemplate<{ value: string }>({
	read: async (request, controls) => {
		template().template.read(request, controls);
	},
	find: async (request, controls) => {
		template().template.find!(request, controls);
	}
});
