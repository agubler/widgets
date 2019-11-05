import global from '@dojo/framework/shim/global';
import { create, tsx, renderer } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { DNode } from '@dojo/framework/core/interfaces';

import { GridPages, ColumnConfig } from './interfaces';
import PlaceholderRow from './PlaceholderRow';
import Row from './Row';

import * as fixedCss from './styles/body.m.css';
import * as css from '../theme/grid-body.m.css';

export interface BodyProperties {
	totalRows?: number;
	pageSize: number;
	pages: GridPages;
	height: number;
	columnConfig: ColumnConfig[];
	placeholderRowRenderer?: (index?: number) => DNode;
	fetcher: (page: number, pageSize: number) => void;
	updater: (page: number, rowNumber: number, columnId: string, value: string) => void;
	pageChange: (page: number) => void;
	onScroll: (value: number) => void;
	resetScroll: boolean;
}

const offscreen = (row: () => DNode) => {
	const div = global.document.createElement('div');
	const r = renderer(row);
	div.style.position = 'absolute';
	global.document.body.appendChild(div);
	r.mount({ domNode: div, sync: true });
	const dimensions = div.getBoundingClientRect();
	global.document.body.removeChild(div);
	return dimensions;
};

const defaultPlaceholderRowRenderer = (index = 0) => {
	return <PlaceholderRow key={index} />;
};

interface BodyState {
	start: number;
	end: number;
	dimensions: {
		rowHeight: number;
		rowsInView: number;
		renderPageSize: number;
	};
}

const icache = createICacheMiddleware<BodyState>();
const factory = create({ icache, theme }).properties<BodyProperties>();

export const Body = factory(function Body({
	middleware: { icache, theme: themeMiddleware },
	properties
}) {
	const {
		pageSize,
		fetcher,
		pages,
		height,
		columnConfig,
		placeholderRowRenderer = defaultPlaceholderRowRenderer,
		pageChange,
		totalRows,
		updater,
		resetScroll,
		theme,
		classes
	} = properties();
	const themeCss = themeMiddleware.classes(css);
	const start = icache.getOrSet('start', 0);
	const end = icache.getOrSet('end', 100);
	const { renderPageSize, rowHeight, rowsInView } = icache.getOrSet('dimensions', () => {
		const dimensions = offscreen(placeholderRowRenderer);
		const rowHeight = dimensions.height;
		const rowsInView = Math.ceil(height / rowHeight);
		const renderPageSize = rowsInView * 2;
		return {
			rowHeight,
			rowsInView,
			renderPageSize
		};
	});

	const startPage = Math.max(Math.ceil(start / pageSize), 1);
	const endPage = Math.ceil(end / pageSize);
	let data = pages[`page-${startPage}`] || [];
	if (!data.length && (totalRows === undefined || totalRows > 0)) {
		fetcher(startPage, pageSize);
	}
	if (startPage !== endPage) {
		const endData = pages[`page-${endPage}`] || [];
		if (!endData.length) {
			fetcher(endPage, pageSize);
		}
		const midScreenPage = Math.max(Math.ceil((start + rowsInView / 2) / pageSize), 1);
		pageChange(midScreenPage);
		data = [...data, ...endData];
	} else {
		pageChange(startPage);
	}
	const rows: DNode[] = [];

	for (let i = start; i < end; i++) {
		const offset = i - (startPage * pageSize - pageSize);
		const item = data[offset];
		if (item) {
			rows.push(
				<Row
					id={i}
					key={i}
					theme={theme}
					classes={classes}
					item={item}
					columnConfig={columnConfig}
					updater={(rowNumber: number, columnId: string, value: any) => {
						const { pageSize } = properties();
						const page = Math.max(Math.ceil(rowNumber / pageSize), 1);
						const pageItemNumber = rowNumber - (page - 1) * pageSize;
						updater(page, pageItemNumber, columnId, value);
					}}
				/>
			);
		} else {
			if (totalRows === undefined || (i > -1 && i < totalRows)) {
				rows.push(placeholderRowRenderer(i));
			}
		}
	}

	const topPaddingHeight = rowHeight * start;
	let bottomPaddingHeight = 0;
	if (!totalRows || totalRows >= pageSize) {
		bottomPaddingHeight =
			(totalRows || 0) * rowHeight - topPaddingHeight - (end - start) * rowHeight;
	}
	const rootProperties = {
		key: 'root',
		onscroll: ({ target }: UIEvent<HTMLElement>) => {
			const { totalRows = 0, onScroll } = properties();
			const scrollTop = target.scrollTop;
			const scrollLeft = target.scrollLeft;
			const topRow = Math.round(scrollTop / rowHeight);
			const bottomRow = topRow + rowsInView;
			let start = icache.getOrSet('start', 0);
			let end = icache.getOrSet('end', 100);
			if (topRow <= start) {
				start = Math.max(0, topRow - renderPageSize);
				end = Math.min(totalRows, start + renderPageSize * 2);
			}
			if (bottomRow >= end) {
				start = Math.min(topRow, totalRows - renderPageSize);
				end = Math.min(totalRows, start + renderPageSize * 2);
			}
			if (icache.get('start') !== start) {
				icache.set('start', start);
			}
			if (icache.get('end') !== end) {
				icache.set('end', end);
			}
			onScroll(scrollLeft);
		},
		classes: [themeCss.root, fixedCss.rootFixed],
		role: 'rowgroup',
		styles: { height: `${height}px` }
	};
	if (resetScroll) {
		(rootProperties as any).scrollTop = 0;
	}

	return (
		<div {...rootProperties}>
			<div key="top" styles={{ height: `${topPaddingHeight}px` }} />
			{...rows}
			<div key="bottom" styles={{ height: `${bottomPaddingHeight}px` }} />
		</div>
	);
});

export default Body;
