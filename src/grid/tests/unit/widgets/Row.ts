const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';
import Row from '../../../widgets/Row';

import * as fixedCss from '../../../styles/row.m.css';
import * as css from '../../../../theme/grid-row.m.css';
import { ColumnConfig } from '../../../interfaces';
import Cell from '../../../widgets/Cell';
import * as sinon from 'sinon';

const noop = () => {};

describe('Row', () => {
	it('should render without columns', () => {
		const h = harness(() => w(Row, { id: 1, item: {}, columnConfig: [] as any, updater: noop }));
		h.expect(() => v('div', { onclick: noop, classes: [css.root, fixedCss.rootFixed], role: 'row', 'aria-rowindex': '2' }, []));
	});

	it('should render items for column config', () => {
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id'
		};
		const h = harness(() => w(Row, { id: 1, item: { id: 'id' }, columnConfig: [columnConfig], updater: noop }));
		h.expect(() =>
			v('div', { onclick: noop, classes: [css.root, fixedCss.rootFixed], role: 'row', 'aria-rowindex': '2' }, [
				w(Cell, {
					key: 'id',
					updater: noop,
					value: 'id',
					editable: undefined,
					rawValue: 'id',
					classes: undefined,
					theme: undefined
				})
			])
		);
	});

	it('should call custom renderer with item value for column config', () => {
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id',
			renderer: () => 'transformed'
		};
		const h = harness(() => w(Row, { id: 1, item: { id: 'id' }, columnConfig: [columnConfig], updater: noop }));
		h.expect(() =>
			v('div', { onclick: noop, classes: [css.root, fixedCss.rootFixed], role: 'row', 'aria-rowindex': '2' }, [
				w(Cell, {
					key: 'id',
					updater: noop,
					value: 'transformed',
					editable: undefined,
					rawValue: 'id',
					classes: undefined,
					theme: undefined
				})
			])
		);
	});

	it('should call onClick with the item when a row is selected', () => {
		const onClickStub = sinon.stub();
		const columnConfig: ColumnConfig = {
			id: 'id',
			title: 'id'
		};
		const h = harness(() => w(Row, { id: 1, onClick: onClickStub, item: { id: 'id' }, columnConfig: [columnConfig], updater: noop }));
		h.expect(() =>
			v('div', { onclick: noop, classes: [css.root, fixedCss.rootFixed], role: 'row', 'aria-rowindex': '2' }, [
				w(Cell, {
					key: 'id',
					updater: noop,
					value: 'id',
					editable: undefined,
					rawValue: 'id',
					classes: undefined,
					theme: undefined
				})
			])
		);
		h.trigger(`.${css.root}`, 'onclick');
		assert.isTrue(onClickStub.calledOnce);
		assert.deepEqual(onClickStub.firstCall.args[0], { id: 'id' });
	});
});
