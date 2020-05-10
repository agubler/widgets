import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create();

export default factory(function Duplicates() {
	return (
		<Example>
			<ChipTypeahead resource={asyncTemplate({ data: exampleData })} duplicates>
				{{
					label: 'Select Pizza Toppings'
				}}
			</ChipTypeahead>
		</Example>
	);
});
