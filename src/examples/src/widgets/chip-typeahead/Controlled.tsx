import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={asyncTemplate({ data: exampleData })}
				value={icache.getOrSet('value', [])}
				onValue={(value) => icache.set('value', value)}
			>
				{{
					label: 'Chip Typeahead'
				}}
			</ChipTypeahead>
			<br />
			<div>
				The selected values are:
				<ul>
					{icache.getOrSet('value', []).map((value, index) => (
						<li key={value}>
							<a
								href="#"
								onclick={(event) => {
									event.preventDefault();
									const value = icache.getOrSet('value', []);
									value.splice(index, 1);
									icache.set('value', value);
								}}
							>
								{value} <Icon type="closeIcon" />
							</a>
						</li>
					))}
				</ul>
			</div>
		</Example>
	);
});
