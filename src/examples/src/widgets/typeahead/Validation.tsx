import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create({ icache });

export default factory(function Validation({ middleware: { icache } }) {
	return (
		<Example>
			<Typeahead
				resource={asyncTemplate({ data: exampleData })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				required
			>
				{{
					label: 'Validation'
				}}
			</Typeahead>
			<pre>{icache.getOrSet('value', '')}</pre>
		</Example>
	);
});
