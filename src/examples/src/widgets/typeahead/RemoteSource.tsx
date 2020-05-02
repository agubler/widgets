import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import { createResource, DataTemplate } from '@dojo/framework/core/resource';
import Example from '../../Example';

const fetcher = async (options: any) => {
	const { offset, size, query } = options;
	let url = `https://mixolydian-appendix.glitch.me/user?`;

	const pageNumber = offset / size + 1;
	url = `${url}page=${pageNumber}&size=${size}`;

	if (query) {
		query.forEach(({ keys, value }: { keys: string[]; value: string }) => {
			url = `${url}&${keys}=${value}`;
		});
	}

	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();

	return {
		data: data.data,
		total: data.total
	};
};

const template: DataTemplate<{ firstName: string; lastName: string }> = {
	read: fetcher
};
const resource = createResource(template);

const factory = create({ icache });

export default factory(function Remote({ middleware: { icache } }) {
	return (
		<Example>
			<Typeahead
				helperText="Type to filter by last name"
				resource={resource({ transform: { value: 'lastName', label: 'lastName' } })}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Remote Source Typeahead'
				}}
			</Typeahead>
			<pre>{icache.getOrSet('value', '')}</pre>
		</Example>
	);
});
