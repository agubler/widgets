import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { w, v } from '@dojo/widget-core/d';
import { Container, Item } from '../Menu';

const AppBase = StatefulMixin(WidgetBase);

let menuOneActiveItem = 0;
let menuTwoActiveItem = 0;
let subMenuActiveItem = 0;

function onMenuOneItemChange(value: number) {
	menuOneActiveItem = value;
	projector.invalidate();
}

function onMenuTwoItemChange(value: number) {
	menuTwoActiveItem = value;
	projector.invalidate();
}

function onSubMenutemChange(value: number) {
	subMenuActiveItem = value;
	projector.invalidate();
}

let subMenuOpenState = false;

function toggleSubMenu(state?: boolean) {
	subMenuOpenState = state !== undefined ? state : !subMenuOpenState;
	subMenuActiveItem = 0;
	projector.invalidate();
}

export class App extends AppBase<WidgetProperties> {

	render() {
		return v('div', [
			w(Container, { key: 'container-1', activeItem: menuOneActiveItem, onFocus: onMenuOneItemChange }, [
				w(Item, { key: 'container-1-item-1', title: 'item1' } ),
				w(Item, { key: 'container-1-item-2', title: 'item2' } ),
				w(Item, { key: 'container-1-item-3', title: 'item3' } ),
				w(Item, { key: 'container-1-item-4', title: 'item4' } )
			]),
			w(Container, { key: 'container-2', activeItem: menuTwoActiveItem, onFocus: onMenuTwoItemChange }, [
				w(Item, { key: 'container-2-item-1', title: 'item5' } ),
				w(Item, { key: 'container-2-item-2', title: 'item6' } ),
				w(Item, { key: 'container-2-item-3', title: 'item7' } ),
				w(Item, { key: 'container-2-item-4', title: 'item8' } ),
				w(Item, { key: 'container-2-item-5', title: 'sub menu', action: toggleSubMenu }, [
					w(Container, {
						key: 'container-3',
						open: subMenuOpenState,
						activeItem: subMenuActiveItem,
						onFocus: onSubMenutemChange
					}, [
						w(Item, { key: 'container-3-item-1', title: 'sub menu item 1' } ),
						w(Item, { key: 'container-3-item-2', title: 'sub menu item 2' } ),
						w(Item, { key: 'container-3-item-3', title: 'sub menu item 3' } )
					])
				])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
