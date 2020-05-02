import { create, tsx } from '@dojo/framework/core/vdom';

import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import states from '@dojo/widgets/examples/src/widgets/list/states';
import Example from '../../Example';
import { createResource, createMemoryTemplate, defaultFilter } from '@dojo/framework/core/resource';

const factory = create();

const resource = createResource(createMemoryTemplate({ filter: defaultFilter }));

export default factory(function FreeText() {
	return (
		<Example>
			<ChipTypeahead strict={false} resource={resource({ data: states })}>
				{{
					label: 'Select All States That Apply, or make up your own'
				}}
			</ChipTypeahead>
		</Example>
	);
});
