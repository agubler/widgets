import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '@dojo/framework/core/middleware/theme';
import { ColumnConfig, SortOptions } from './interfaces';
import { DNode } from '@dojo/framework/core/interfaces';
import TextInput from '../text-input/index';
import Icon from '../icon/index';

import * as css from '../theme/grid-header.m.css';
import * as fixedCss from './styles/header.m.css';

export interface SortRenderer {
	(column: ColumnConfig, direction: undefined | 'asc' | 'desc', sorter: () => void): DNode;
}

export interface FilterRenderer {
	(
		column: ColumnConfig,
		filterValue: string,
		doFilter: (value: string) => void,
		title: string | DNode
	): DNode;
}

export interface HeaderProperties {
	columnConfig: ColumnConfig[];
	sorter: (columnId: string, direction: 'asc' | 'desc') => void;
	filterer: (columnId: string, value: any) => void;
	filter?: {
		[index: string]: string;
	};
	sort?: SortOptions;
	sortRenderer?: SortRenderer;
	filterRenderer?: FilterRenderer;
}

const factory = create({ theme }).properties<HeaderProperties>();

export const Header = factory(function Header({
	properties,
	middleware: { theme: themeMiddleware }
}) {
	const {
		theme,
		classes,
		columnConfig,
		sort,
		filterer,
		filter = {},
		sorter,
		sortRenderer,
		filterRenderer
	} = properties();
	const themedCss = themeMiddleware.classes(css);

	return (
		<div classes={[themedCss.root, fixedCss.rootFixed]} role="row">
			{columnConfig.map((config) => {
				const { filterable, sortable, id } = config;
				const title = typeof config.title === 'string' ? config.title : config.title();
				const isSorted = Boolean(sort && sort.columnId === config.id);
				const isSortedAsc = Boolean(
					sort && sort.columnId === config.id && sort.direction === 'asc'
				);
				const isSortedDesc = Boolean(
					sort && sort.columnId === config.id && sort.direction === 'desc'
				);
				const filterKeys = Object.keys(filter);
				const direction = !isSorted ? undefined : isSortedAsc ? 'asc' : 'desc';
				const filterValue = filterKeys.indexOf(config.id) > -1 ? filter[config.id] : '';
				const doFilter = (value: string) => {
					filterer(config.id, value);
				};
				const doSort = () => {
					const direction = sort
						? sort.columnId !== id
							? 'desc'
							: sort.direction === 'desc'
							? 'asc'
							: 'desc'
						: 'desc';
					sorter(id, direction);
				};

				return (
					<div
						aria-sort={isSorted ? (isSortedAsc ? 'ascending' : 'descending') : null}
						classes={[themedCss.cell, fixedCss.cellFixed]}
						role="columnheader"
					>
						<div
							classes={
								sortable && [
									themedCss.sortable,
									isSorted && themedCss.sorted,
									isSortedDesc && themedCss.desc,
									isSortedAsc && themedCss.asc
								]
							}
							onclick={sortable ? doSort : undefined}
						>
							{title}
							{sortable &&
								(sortRenderer ? (
									sortRenderer(config, direction, doSort)
								) : (
									<button classes={[themedCss.sort]} onclick={doSort}>
										<Icon
											theme={theme}
											classes={classes}
											type={direction === 'asc' ? 'upIcon' : 'downIcon'}
											altText={`Sort by ${title}`}
										/>
									</button>
								))}
						</div>
						{filterable &&
							(filterRenderer ? (
								filterRenderer(config, filterValue, doFilter, title)
							) : (
								<TextInput
									key="filter"
									theme={theme}
									classes={classes}
									extraClasses={{ root: css.filter }}
									label={`Filter by ${title}`}
									labelHidden={true}
									type="search"
									value={filterValue}
									onValue={doFilter}
								/>
							))}
					</div>
				);
			})}
		</div>
	);
});

export default Header;
