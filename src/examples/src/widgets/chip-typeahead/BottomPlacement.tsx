import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create();

export default factory(function Bottom() {
	return (
		<Example>
			<ChipTypeahead resource={asyncTemplate({ data: exampleData })} placement="bottom">
				{{
					label: 'Select Applicable States'
				}}
			</ChipTypeahead>
		</Example>
	);
});
