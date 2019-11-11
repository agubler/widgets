import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { createFetcher } from '@dojo/widgets/grid/utils';
import { createData } from './data';

const columnConfig = [
	{
		id: 'id',
		title: 'ID'
	},
	{
		id: 'firstName',
		title: 'First Name'
	},
	{
		id: 'lastName',
		title: 'Last Name'
	}
];

const fetcher = createFetcher(createData());
const factory = create();

export default factory(function Selection() {
	return (
		<Grid
			selection={{
				onRowSelect: (item) => {
					console.log(item);
				}
			}}
			fetcher={fetcher}
			columnConfig={columnConfig}
			height={500}
		/>
	);
});
