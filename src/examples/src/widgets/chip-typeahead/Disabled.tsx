import { create, tsx } from '@dojo/framework/core/vdom';

import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { createResource, createMemoryTemplate, defaultFilter } from '@dojo/framework/core/resource';

const factory = create();
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const resource = createResource(createMemoryTemplate({ filter: defaultFilter }));

export default factory(function Disabled() {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({ data: options })}
				disabled
				initialValue={['cat', 'dog']}
			>
				{{
					label: 'Disabled'
				}}
			</ChipTypeahead>
		</Example>
	);
});
