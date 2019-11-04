import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';

import * as css from '../theme/grid-footer.m.css';

export interface FooterProperties {
	total?: number;
	page: number;
	pageSize: number;
}

const factory = create({ theme }).properties<FooterProperties>();

export const Footer = factory(function Footer({ properties, middleware: { theme } }) {
	const { total, page, pageSize } = properties();
	const themedCss = theme.classes(css);

	return (
		<div classes={[themedCss.root]}>
			{total !== undefined &&
				`Page ${page} of ${Math.ceil(total / pageSize)}. Total rows ${total}`}
		</div>
	);
});

export default Footer;
