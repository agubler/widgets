import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create();

export default factory(function FreeText() {
	return (
		<Example>
			<ChipTypeahead strict={false} resource={asyncTemplate({ data: exampleData })}>
				{{
					label: 'Select All States That Apply, or make up your own'
				}}
			</ChipTypeahead>
		</Example>
	);
});
