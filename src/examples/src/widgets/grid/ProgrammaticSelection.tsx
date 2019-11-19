import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import Button from '@dojo/widgets/button';
import Input from '@dojo/widgets/number-input';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import Store from '@dojo/framework/stores/Store';
import { clearSelectionProcess, selectionProcess } from '@dojo/widgets/grid/processes';
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

const icache = createICacheMiddleware<{
	selected: any[];
	store: Store;
	storeId: string;
	rowValue: number | undefined;
}>();

const fetcher = createFetcher(createData());
const factory = create({ icache });

export default factory(function Selection({ middleware: { icache } }) {
	const store = icache.getOrSet('store', new Store());
	const storeId = icache.getOrSet('storeId', 'selection');
	const rowValue = icache.get('rowValue');
	return (
		<virtual>
			<Input
				label="Select Row"
				min={1}
				value={rowValue}
				onKeyDown={(key) => {
					if (key === 13) {
						const rowValue = icache.get('rowValue');
						rowValue &&
							selectionProcess(store)({
								id: storeId,
								type: 'multi',
								index: rowValue - 1
							});
					}
				}}
				onValue={(value) => {
					icache.set('rowValue', value);
				}}
			/>
			<Grid
				fetcher={fetcher}
				columnConfig={columnConfig}
				height={380}
				store={store}
				storeId={storeId}
			/>
			<Button
				onClick={() => {
					clearSelectionProcess(store)({ id: storeId });
				}}
			>
				Clear Selected
			</Button>
		</virtual>
	);
});
