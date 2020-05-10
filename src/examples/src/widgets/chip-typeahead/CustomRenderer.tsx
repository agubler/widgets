import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import { ListItem } from '@dojo/widgets/list';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create();

export default factory(function CustomRenderer() {
	return (
		<Example>
			<ChipTypeahead resource={asyncTemplate({ data: exampleData })}>
				{{
					label: 'Favorite Foods',
					items: (item, props) => (
						<ListItem {...props}>
							{item.selected ? '❤️' : '🤢'} {item.label}
						</ListItem>
					),
					selected: (value) => {
						switch (value) {
							case 'apples':
								return '🍎';
							case 'tacos':
								return '🌮';
							case 'pizza':
								return '🍕';
						}
					}
				}}
			</ChipTypeahead>
		</Example>
	);
});
