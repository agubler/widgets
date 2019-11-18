import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import icache from '@dojo/framework/core/middleware/icache';
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
const factory = create({ icache });

export default factory(function Selection({ middleware: { icache } }) {
	const selected = icache.get<any[]>('selected');
	return (
		<virtual>
			<Grid
				selection={{
					onRowSelect: (items) => {
						icache.set('selected', items);
					},
					multi: true
				}}
				fetcher={fetcher}
				columnConfig={columnConfig}
				height={300}
			/>
			{selected && (
				<div>
					{selected.map((item) => (
						<pre key={item.id}>{JSON.stringify(item)}</pre>
					))}
				</div>
			)}
		</virtual>
	);
});
