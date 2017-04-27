import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { w, v } from '@dojo/widget-core/d';
import { Container, Item } from '../Menu';

const AppBase = StatefulMixin(WidgetBase);

let selectedKey: string | undefined;
let openPath: string[]; // [ 'container-1', 'container-2', 'container-3' ];

function onFocus(selected: string, path: string[]) {
	/*console.log(selected, path);*/
	selectedKey = selected;
	if (path) {
		openPath = path;
	}
	projector.invalidate();
}

function itemAction(key: string) {
	console.log('an action occurred');
}

export class App extends AppBase<WidgetProperties> {

	render() {
		return v('div', [
			w(Container, { key: 'container-1', openPath, selectedKey, onFocus }, [
				w(Item, { key: 'container-1-item-1', title: 'item1', action: itemAction } ),
				w(Item, { key: 'container-1-item-2', title: 'item2' } ),
				w(Item, { key: 'container-1-item-3', title: 'item3' } ),
				w(Item, { key: 'container-1-item-4', title: 'sub menu 1' }, [
					w(Container, {
						key: 'container-5'
					}, [
						w(Item, { key: 'container-5-item-1', title: 'item 1' } ),
						w(Item, { key: 'container-5-item-2', title: 'item 2' } ),
						w(Item, { key: 'container-5-item-3', title: 'item 3' } )
					])
				]),
				w(Item, { key: 'container-1-item-5', title: 'item4' } ),
				w(Item, { key: 'container-1-item-6', title: 'sub menu 2' }, [
					w(Container, {
						key: 'container-2'
					}, [
						w(Item, { key: 'container-2-item-1', title: 'item 1' } ),
						w(Item, { key: 'container-2-item-2', title: 'item 2' } ),
						w(Item, { key: 'container-2-item-3', title: 'item 3' } ),
						w(Item, { key: 'container-2-item-4', title: 'sub menu' }, [
							w(Container, {
								key: 'container-3'
							}, [
								w(Item, { key: 'container-3-item-1', title: 'item 1' } ),
								w(Item, { key: 'container-3-item-2', title: 'item 2' } ),
								w(Item, { key: 'container-3-item-3', title: 'item 3' } ),
								w(Item, { key: 'container-3-item-4', title: 'sub menu' }, [
									w(Container, {
										key: 'container-4'
									}, [
										w(Item, { key: 'container-4-item-1', title: 'item 1' } ),
										w(Item, { key: 'container-4-item-2', title: 'item 2' } ),
										w(Item, { key: 'container-4-item-3', title: 'item 3' } )
									])
								])
							])
						])
					])
				])
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
