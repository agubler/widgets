import { tsx, create, isWNode } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import * as fixedCss from './styles/hstack.m.css';
import * as css from '../theme/default/hstack.m.css';
import Spacer from './Spacer';

export interface HStackProperties {
	/** The alignment of the stack */
	align?: 'start' | 'middle' | 'end';
	/** The spacing between children, defaults to `none` */
	spacing?: 'small' | 'medium' | 'large' | 'none';
	/** Adds padding to the stack container */
	padding?: 'small' | 'medium' | 'large' | 'none';
	/** Stretches the container to fit the space */
	stretch?: boolean;
}

const factory = create({ theme }).properties<HStackProperties>();

const spacer = <Spacer />;

export const HStack = factory(function HStack({ properties, middleware: { theme }, children }) {
	const { align = 'middle', spacing = 'none', padding = false, stretch = false } = properties();
	const themeCss = theme.classes(css);
	let spacingClass: string | undefined;
	let paddingClass: string | undefined;
	let alignClass: string | undefined;

	switch (spacing) {
		case 'small':
			spacingClass = themeCss.smallSpacing;
			break;
		case 'medium':
			spacingClass = themeCss.mediumSpacing;
			break;
		case 'large':
			spacingClass = themeCss.largeSpacing;
			break;
		default:
			break;
	}
	switch (padding) {
		case 'small':
			paddingClass = themeCss.smallPadding;
			break;
		case 'medium':
			paddingClass = themeCss.mediumPadding;
			break;
		case 'large':
			paddingClass = themeCss.largePadding;
			break;
		default:
			break;
	}
	switch (align) {
		case 'start':
			alignClass = fixedCss.top;
			break;
		case 'middle':
			alignClass = fixedCss.middle;
			break;
		case 'end':
			alignClass = fixedCss.bottom;
			break;
		default:
			break;
	}

	const wrappedChildren = children().map((child) => {
		if (isWNode(child) && spacer.widgetConstructor === child.widgetConstructor) {
			return child;
		}
		if (!child) {
			return null;
		}
		return <div classes={[spacingClass, fixedCss.child]}>{child}</div>;
	});

	return (
		<div
			classes={[
				theme.variant(),
				fixedCss.root,
				alignClass,
				paddingClass,
				stretch && fixedCss.stretch
			]}
		>
			{wrappedChildren}
		</div>
	);
});

export default HStack;