import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import { ListItem } from '@dojo/widgets/list';
import Example from '../../Example';
import { createResource, createMemoryTemplate, defaultFilter } from '@dojo/framework/core/resource';

const factory = create();
const options = [
	{ value: 'apples', label: 'Apples' },
	{ value: 'tacos', label: 'Tacos' },
	{ value: 'pizza', label: 'Pizza' }
];

const resource = createResource(createMemoryTemplate({ filter: defaultFilter }));

export default factory(function CustomRenderer() {
	return (
		<Example>
			<ChipTypeahead resource={resource(options)} transform={defaultTransform}>
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
