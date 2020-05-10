import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import states from './states';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet('activeIndex', 0);

	return (
		<Example>
			<div>
				<button
					type="button"
					onclick={() => {
						icache.set(
							'activeIndex',
							(activeIndex - 1 + states.length) % states.length
						);
					}}
				>
					UP
				</button>
				<button
					type="button"
					onclick={() => {
						icache.set('activeIndex', (activeIndex + 1) % states.length);
					}}
				>
					DOWN
				</button>
				<button
					type="button"
					onclick={() => {
						const activeIndex = icache.get<number>('activeIndex');
						if (activeIndex) {
							const item = states[activeIndex];
							!item.disabled && icache.set('value', states[activeIndex].value);
						}
					}}
				>
					SELECT
				</button>
				<List
					focusable={false}
					itemsInView={4}
					resource={asyncTemplate({ data: exampleData })}
					onActiveIndexChange={(index: number) => {
						icache.set('activeIndex', index);
					}}
					activeIndex={activeIndex}
					value={icache.get('value')}
					onValue={(value) => {
						icache.set('value', value);
					}}
				/>
			</div>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
