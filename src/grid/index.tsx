import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import resize from '@dojo/framework/core/middleware/resize';
import { createStoreMiddleware } from '@dojo/framework/core/middleware/store';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { Store } from '@dojo/framework/stores/Store';
import './utils';

import { Fetcher, ColumnConfig, GridState, Updater } from './interfaces';
import {
	fetcherProcess,
	pageChangeProcess,
	sortProcess,
	filterProcess,
	updaterProcess
} from './processes';

import Header, { SortRenderer, FilterRenderer } from './Header';
import Body from './Body';
import Footer from './Footer';
import * as css from '../theme/grid.m.css';
import * as fixedCss from './styles/grid.m.css';

const defaultGridMeta = {
	page: 1,
	total: undefined,
	sort: undefined,
	filter: undefined,
	isSorting: false,
	editedRow: undefined
};

export interface CustomRenderers {
	sortRenderer?: SortRenderer;
	filterRenderer?: FilterRenderer;
}

interface State {
	scrollLeft: number;
	resetScroll: boolean;
}

const icache = createICacheMiddleware<State>();
const store = createStoreMiddleware<GridState>();

export interface GridProperties {
	/** The full configuration for the grid columns */
	columnConfig: ColumnConfig[];
	/** function that returns results for the page reflected */
	fetcher: Fetcher;
	/** gird height in px */
	height: number;
	/** function that updates an item from a edit made in the grid */
	updater?: Updater;
	/** options store, if no store is passed each grid will factory their own grid */
	store?: Store<any> | ReturnType<ReturnType<typeof createStoreMiddleware>>['api'];
	/** the path to store the grid data in */
	storeId?: string;
	/** set of custom renderers for sorting or filtering */
	customRenderers?: CustomRenderers;
}

const factory = create({ theme, icache, store, dimensions, resize }).properties<GridProperties>();

function isStoreInstance(store: any): store is Store<GridState> {
	return store instanceof Store;
}

const PAGE_SIZE = 100;

const Grid = factory(function Grid({
	id,
	properties,
	middleware: { theme: themeMiddleware, icache, store: storeMiddleware, dimensions, resize }
}) {
	const {
		columnConfig,
		storeId = `grid-${id}`,
		theme,
		classes,
		height,
		customRenderers = {}
	} = properties();
	const gridStore = (properties().store || storeMiddleware) as
		| Store<GridState>
		| ReturnType<typeof store>['api'];
	const { get, path } = gridStore;
	const { sortRenderer, filterRenderer } = customRenderers;
	const executor = (isStoreInstance(gridStore)
		? (process: any) => process(gridStore)
		: gridStore.executor) as ReturnType<typeof store>['api']['executor'];
	const themeCss = themeMiddleware.classes(css);
	const scrollLeft = icache.getOrSet('scrollLeft', 0);
	const hasFilters = columnConfig.some((config) => !!config.filterable);
	const meta = get(path(storeId, 'meta')) || defaultGridMeta;
	const pages = get(path(storeId, 'data', 'pages')) || {};
	const headerHeight = dimensions.get('header');
	const footerHeight = dimensions.get('footer');
	const bodyHeight = height - headerHeight.size.height - footerHeight.size.height;
	const resetScroll = icache.getOrSet('resetScroll', false);
	if (resetScroll) {
		icache.set('resetScroll', false);
	}
	resize.get('root');

	if (bodyHeight <= 0) {
		return <div key="root" classes={[themeCss.root, fixedCss.rootFixed]} role="table" />;
	}

	return (
		<div
			key="root"
			classes={[themeCss.root, fixedCss.rootFixed]}
			role="table"
			aria-rowcount={meta.total && `${meta.total}`}
		>
			<div
				key="header"
				scrollLeft={scrollLeft}
				classes={[
					themeCss.header,
					fixedCss.headerFixed,
					hasFilters && themeCss.filterGroup
				]}
				row="rowgroup"
			>
				<Header
					theme={theme}
					classes={classes}
					columnConfig={columnConfig}
					sorter={(columnId: string, direction: 'asc' | 'desc') => {
						const { fetcher, storeId = `grid-${id}` } = properties();
						executor(sortProcess)({ id: storeId, fetcher, columnId, direction });
					}}
					filterer={(columnId: string, value: any) => {
						const { fetcher, storeId = `grid-${id}` } = properties();
						executor(filterProcess)({
							id: storeId,
							fetcher,
							filterOptions: { columnId, value }
						});
						icache.set('resetScroll', true);
					}}
					sort={meta.sort}
					filter={meta.filter}
					sortRenderer={sortRenderer}
					filterRenderer={filterRenderer}
				/>
			</div>
			<Body
				theme={theme}
				classes={classes}
				pages={pages}
				totalRows={meta.total}
				pageSize={PAGE_SIZE}
				resetScroll={resetScroll}
				columnConfig={columnConfig}
				fetcher={(page: number, pageSize: number) => {
					const { storeId = `grid-${id}`, fetcher } = properties();
					executor(fetcherProcess)({ id: storeId, fetcher, page, pageSize });
				}}
				pageChange={(page: number) => {
					const { storeId = `grid-${id}` } = properties();
					executor(pageChangeProcess)({ id: storeId, page });
				}}
				updater={(page: number, rowNumber: number, columnId: string, value: string) => {
					const { storeId = `grid-${id}`, updater } = properties();
					executor(updaterProcess)({
						id: storeId,
						page,
						columnId,
						rowNumber,
						value,
						updater
					});
				}}
				onScroll={(value: number) => {
					icache.set('scrollLeft', value);
				}}
				height={bodyHeight}
			/>
			<div key="footer">
				<Footer
					theme={theme}
					classes={classes}
					total={meta.total}
					page={meta.page}
					pageSize={PAGE_SIZE}
				/>
			</div>
		</div>
	);
});

export default Grid;
