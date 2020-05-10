import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<ChipTypeahead resource={asyncTemplate({ data: exampleData })}>
				{{
					label: 'Select All States That Apply'
				}}
			</ChipTypeahead>
		</Example>
	);
});
