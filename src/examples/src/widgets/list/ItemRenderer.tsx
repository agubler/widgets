import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListItem } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create({ icache });

export default factory(function ItemRenderer({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={asyncTemplate({ data: exampleData })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			>
				{({ value }, props) => {
					const color = value.length > 7 ? 'red' : 'blue';
					return (
						<ListItem {...props}>
							<div styles={{ color: color }}>{value}</div>
						</ListItem>
					);
				}}
			</List>
			<p>{`Clicked On: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
