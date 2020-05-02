import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createResource } from '@dojo/framework/core/resource';

const factory = create({ icache });

const options = [
	{ value: 'Save' },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true },
	{ value: 'Print' },
	{ value: 'Export' },
	{ value: 'Share' }
];

const resource = createResource<ListOption>();

export default factory(function Menu({ middleware: { icache } }) {
	return (
		<Example>
			<List
				menu
				resource={resource({ data: options })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			/>
			<p>{`Selected: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
