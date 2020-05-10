import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create({ icache });

export default factory(function Dividers({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={asyncTemplate({ data: exampleData })}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
