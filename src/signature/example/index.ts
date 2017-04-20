import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { WidgetProperties } from '@dojo/widget-core/interfaces';
import { ProjectorMixin } from '@dojo/widget-core/mixins/Projector';
import { w } from '@dojo/widget-core/d';

import Signature from './../Signature';

export class App extends WidgetBase<WidgetProperties> {
	protected render(): DNode {
		return w(Signature, {});
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
