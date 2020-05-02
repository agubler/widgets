import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import ContextMenu from '@dojo/widgets/context-menu';
import { createResource } from '@dojo/framework/core/resource';
import { ListOption } from '@dojo/widgets/list';

const factory = create({ icache });
const options = [{ value: 'print', label: 'Print' }, { value: 'delete', label: 'Delete' }];
const resource = createResource<ListOption>();

export default factory(function Basic({ middleware: { icache } }) {
	const text = icache.getOrSet(
		'text',
		'This is some text that has a context menu. Right click to view the context menu and take an action on selected text'
	);
	const printedText = icache.getOrSet('printedText', '');

	return (
		<virtual>
			<ContextMenu
				resource={resource({ data: options })}
				onSelect={(value) => {
					const selection = window.getSelection() || '';
					if (value === 'print') {
						icache.set('printedText', selection ? selection.toString() : '');
					} else if (
						value === 'delete' &&
						selection &&
						selection.anchorOffset !== selection.focusOffset
					) {
						icache.set(
							'text',
							`${text.slice(0, selection.anchorOffset)}${text.slice(
								selection.focusOffset
							)}`
						);
					}
				}}
			>
				{text}
			</ContextMenu>
			<div>Printed Text: {printedText}</div>
		</virtual>
	);
});
