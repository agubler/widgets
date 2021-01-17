import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

interface Animal {
	name: string;
	type: string;
}

const animals: Animal[] = [
	{ name: 'whiskers', type: 'feline' },
	{ name: 'fido', type: 'kanine' },
	{ name: 'mickey', type: 'rodent' }
];

const template = createResourceTemplate<Animal>('name');

export default factory(function CustomTransformer({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<List
				resource={resource({
					template: template({ id, data: animals }),
					transform: { value: 'type', label: 'name' }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
