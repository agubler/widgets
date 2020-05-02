import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import states from './states';
import Example from '../../Example';
import { createResource, createMemoryTemplate, defaultFilter } from '@dojo/framework/core/resource';

const factory = create({ icache });

const resource = createResource<{ value: string; label?: string }>(
	createMemoryTemplate({
		filter: defaultFilter
	})
);

export default factory(function CustomFilter({ middleware: { icache } }) {
	return (
		<Example>
			<Typeahead
				resource={resource({ data: states })}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Custom Filter'
				}}
			</Typeahead>
			<pre>{icache.getOrSet('value', '')}</pre>
		</Example>
	);
});
