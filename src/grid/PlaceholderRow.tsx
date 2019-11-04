import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';

import * as css from '../theme/grid-placeholder-row.m.css';

const factory = create({ theme });
export const PlaceholderRow = factory(function PlaceholderRow({ middleware: { theme } }) {
	const themedCss = theme.classes(css);
	return (
		<div classes={[themedCss.root]}>
			<div classes={[themedCss.loading]} />
		</div>
	);
});

export default PlaceholderRow;
