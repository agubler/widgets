import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import { ListItem } from '@dojo/widgets/list';
import Example from '../../Example';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];
const resource = createResource<{ value: string }>();

export default factory(function CustomRenderer({ middleware: { icache } }) {
	return (
		<Example>
			<Select
				resource={resource({ data: options })}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Select',
					items: ({ selected, value }, props) => {
						return (
							<ListItem {...props}>
								{selected && <span>✅ </span>}
								{value}
							</ListItem>
						);
					}
				}}
			</Select>
			<pre>{icache.getOrSet('value', '')}</pre>
		</Example>
	);
});
