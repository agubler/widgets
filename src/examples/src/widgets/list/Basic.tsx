import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { data, Data } from '../../data';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

const template = createResourceTemplate<Data>('id');

export default factory(function Basic({ id, middleware: { icache, resource } }) {
	const { createOptions } = resource;
	const options = createOptions((curr, next) => ({ ...curr, ...next }));
	// options({ size: 5 });
	return (
		<Example>
			<List
				resource={resource({
					template: template({ id, data }),
					options,
					transform: { value: 'id', label: 'summary' }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
