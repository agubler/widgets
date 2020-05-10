import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create();

export default factory(function Disabled() {
	return (
		<Example>
			<ChipTypeahead
				resource={asyncTemplate({ data: exampleData })}
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
