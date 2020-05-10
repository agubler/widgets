import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create({ icache });

export default factory(function Disabled({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={asyncTemplate({ data: exampleData })}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				disabled={(item) => item.value === 'mouse'}
			/>
		</Example>
	);
});
