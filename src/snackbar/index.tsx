import { RenderResult } from '@dojo/framework/core/interfaces';
import theme from '@dojo/framework/core/middleware/theme';
import { tsx, create } from '@dojo/framework/core/vdom';
import * as css from '../theme/snackbar.m.css';

export interface SnackbarProperties {
	/**  */
	open: boolean;
	/**  */
	type?: 'success' | 'error';
	/**  */
	leading?: boolean;
	/**  */
	stacked?: boolean;
}

export interface SnackbarChildren {
	messageRenderer: () => RenderResult;
	actionsRenderer?: () => RenderResult;
}

const factory = create({ theme })
	.properties<SnackbarProperties>()
	.children<SnackbarChildren>();

const Snackbar = factory(function Snackbar({ middleware: { theme }, properties, children }) {
	const { actionsRenderer, messageRenderer } = children()[0];
	const { type, open, leading, stacked } = properties();
	const themedCss = theme.classes(css);
	return (
		<div
			key="root"
			classes={[
				themedCss.root,
				open && themedCss.open,
				type && themedCss[type],
				leading && themedCss.leading,
				stacked && themedCss.stacked
			]}
		>
			<div key="content" classes={[themedCss.content]}>
				<div key="label" classes={[themedCss.label]} role="status" aria-live="polite">
					{messageRenderer()}
				</div>
				{actionsRenderer && (
					<div key="actions" classes={[themedCss.actions]}>
						{actionsRenderer()}
					</div>
				)}
			</div>
		</div>
	);
});

export default Snackbar;
