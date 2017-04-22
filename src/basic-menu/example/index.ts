import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { StatefulMixin } from '@dojo/widget-core/mixins/Stateful';
import { w, v } from '@dojo/widget-core/d';
import { Container, Item } from '../Menu';

const AppBase = StatefulMixin(WidgetBase);

export class App extends AppBase<WidgetProperties> {

	render() {
		return v('div', [
			w(Container, { key: '1' }, [
				w(Item, { key: '1', title: 'item1' } ),
				w(Item, { key: '2', title: 'item2' } ),
				w(Item, { key: '3', title: 'item3' } ),
				w(Item, { key: '4', title: 'item4' } )
			]),
			w(Container, { key: '2' }, [
				w(Item, { key: '1', title: 'item5' } ),
				w(Item, { key: '2', title: 'item6' } ),
				v('div', [ 'item' ]),
				w(Item, { key: '3', title: 'item7' } ),
				w(Item, { key: '4', title: 'item8' } )
			])
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
