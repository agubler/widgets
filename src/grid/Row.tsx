import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';

import { ColumnConfig } from './interfaces';
import Cell from './Cell';
import * as fixedCss from './styles/row.m.css';
import * as css from '../theme/grid-row.m.css';

export interface RowProperties {
	id: number;
	item: { [index: string]: any };
	columnConfig: ColumnConfig[];
	updater: (rowNumber: number, columnId: string, value: any) => void;
}

const factory = create({ theme }).properties<RowProperties>();

export const Row = factory(function Row({ properties, middleware: { theme: themeMiddleware } }) {
	const {
		item,
		columnConfig,
		id,
		// theme, classes,
		updater
	} = properties();
	const themedCss = themeMiddleware.classes(css);

	return (
		<div classes={[themedCss.root, fixedCss.rootFixed]} role="row" aria-rowindex={`${id + 1}`}>
			{columnConfig.map((config) => (
				<Cell
					key={config.id}
					value={
						config.renderer
							? config.renderer(`${item[config.id]}`)
							: `${item[config.id]}`
					}
					// theme={theme}
					// classes={classes}
					editable={config.editable}
					rawValue={item[config.id]}
					updater={(value: string) => {
						updater(id, config.id, value);
					}}
				/>
			))}
		</div>
	);
});

export default Row;
