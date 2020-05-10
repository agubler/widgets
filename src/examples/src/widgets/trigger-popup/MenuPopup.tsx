import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import Button from '@dojo/widgets/button';
import TriggerPopup from '@dojo/widgets/trigger-popup';
import Example from '../../Example';
import { asyncTemplate, exampleData } from '../templates';

const factory = create();

export default factory(function MenuTriggerPopup() {
	return (
		<Example>
			<TriggerPopup position="below">
				{{
					trigger: (onToggleOpen) => <Button onClick={onToggleOpen}>Menu Popup</Button>,
					content: (onClose) => (
						<div styles={{ border: '1px solid black' }}>
							<List
								resource={asyncTemplate({ data: exampleData })}
								onValue={onClose}
							/>
						</div>
					)
				}}
			</TriggerPopup>
		</Example>
	);
});
