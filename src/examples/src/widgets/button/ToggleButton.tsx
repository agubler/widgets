import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties<any>();

export default factory(function ToggleButton({ properties, middleware: { icache } }) {
	const { theme } = properties();
	const pressed = icache.getOrSet('pressed', false);

	return (
		<Button theme={theme} pressed={pressed} onClick={() => icache.set('pressed', !pressed)}>
			Toggle Button
		</Button>
	);
});
