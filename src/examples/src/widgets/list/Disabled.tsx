import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { createResource } from '@dojo/framework/core/resource';

const factory = create({ icache });

const animals = [{ value: 'cat' }, { value: 'dog' }, { value: 'mouse' }, { value: 'rat' }];
const resource = createResource<ListOption>();

export default factory(function Disabled({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={resource({ data: animals })}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				disabled={(item) => item.value === 'mouse'}
			/>
		</Example>
	);
});
