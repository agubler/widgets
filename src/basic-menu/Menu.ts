import { WidgetBase, afterRender } from '@dojo/widget-core/WidgetBase';
import { Constructor, DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, isWNode, isHNode } from '@dojo/widget-core/d';
import { Keys } from '../common/util';

import * as css from './styles/basicMenu.m.css';

export interface ContainerProperties extends WidgetProperties {
	open?: boolean;
	activeItem: number;
	onFocus: Function;
	role?: string;
}

export interface ItemProperties extends WidgetProperties {
	title: string;
	action?: Function;
	onClick?: Function;
}

export class Container extends FocusManagerMixin(WidgetBase)<ContainerProperties> {

	private _keyDown(event: KeyboardEvent) {
		let nextActiveItem;
		switch (event.which) {
			case Keys.Up:
				event.preventDefault();
				event.stopPropagation();
				nextActiveItem = this.properties.activeItem === 0 ? this.children.length - 1 : this.properties.activeItem - 1;
				this.scheduleFocus(true);
				this.properties.onFocus(nextActiveItem);
				break;
			case Keys.Down:
				event.preventDefault();
				event.stopPropagation();
				nextActiveItem = this.properties.activeItem === this.children.length - 1 ? 0 : this.properties.activeItem + 1;
				this.scheduleFocus(true);
				this.properties.onFocus(nextActiveItem);
				break;
		}
	}

	protected render(): DNode {
		const { open = true } = this.properties;

		return open ?
			v('ul', {
				id: this.properties.key,
				key: this.properties.key,
				onkeydown: this._keyDown,
				'aria-labelledby': (<any> this.properties).labelledBy,
				role: this.properties.role || 'menubar'
			}, this.children) : null;
	}
}

@theme(css)
export class Item extends FocusSchedulerMixin(ThemeableMixin(WidgetBase))<any> {

	// TODO update the index and call the action
	private onClick(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onFocus(this.properties.index);
		this.properties.action && this.properties.action();
	}

	// TODO seperate orientation key module perhaps?
	private onKeyDown(event: KeyboardEvent) {
		switch (event.which) {
			case Keys.Space:
				event.preventDefault();
				event.stopPropagation();
				this.properties.action && this.properties.action();
			break;
			case Keys.Right:
				if (this.properties.action) {
					event.preventDefault();
					event.stopPropagation();
					this.properties.action(true);
				}
			break;
			case Keys.Left:
			case Keys.Escape:
				if (this.properties.action && (!this.hasSubMenu() || this.hasOpenSubMenu())) {
					event.preventDefault();
					event.stopPropagation();
					this.properties.retrieveFocus();
					this.properties.action(false);
				}
			break;
		}
	}

	protected getFocusTarget() {
		return `item-label-${this.properties.key}`;
	}

	// TODO this assumes that the children is a Container! I think this is better off to be a property...
	protected render(): DNode {
		return v('li', {
			id: this.properties.key,
			onclick: this.onClick,
			onkeydown: this.onKeyDown,
			key: this.properties.key,
			classes: this.classes(css.item),
			role: 'none'
		}, [
			v('div', {
				tabIndex: this.properties.activeItem ? 0 : -1,
				classes: this.classes(css.item),
				key: `item-label-${this.properties.key}`,
				role: 'menuitem'
			}, [ this.properties.title ]),
			...this.children
		]);
	}

	// TODO don't like this
	@afterRender()
	protected a11y(result: DNode) {
		if (isHNode(result) || isWNode(result)) {
			if (result.children && result.children.length === 2) {
				(<any> result.children[1]).properties.labelledBy = this.properties.key;
				(<any> result.children[1]).properties.autoFocus = true;
				(<any> result.children[1]).properties.role = 'menu';
				(<any> result.children[0]).properties['aria-controls'] = (<any> result.children[1]).properties.key;
			}
		}

		return result;
	}

	private hasSubMenu() {
		return this.children && this.children[0];
	}

	private hasOpenSubMenu() {
		return this.hasSubMenu() && (<any> this.children[0]).properties.open;
	}
}

interface FocusManagerMixin {
	scheduleFocus(value: boolean): void;
}

function FocusManagerMixin<T extends Constructor<WidgetBase<any>>>(Base: T): T & Constructor<FocusManagerMixin> {

	class FocusManager extends Base {

		private _scheduleFocus = false;

		public scheduleFocus(value: boolean) {
			this._scheduleFocus = value;
		}

		@afterRender()
		protected decorateFocus(result: DNode) {

			/*decorate(result, () => {})*/
			if (!(typeof result === 'string') && result !== null) {
				const { _scheduleFocus, onFocus, retrieveFocus, properties: { activeItem, autoFocus } } = this;
				result.children.forEach((node: DNode, i) => {
					if (isWNode(node)) {
						const active = i === activeItem;
						(<any> node.properties).index = i;
						(<any> node.properties).activeItem = active;
						(<any> node.properties).retrieveFocus = retrieveFocus;
						(<any> node.properties).autoFocus = autoFocus && active;
						(<any> node.properties).scheduleFocus = _scheduleFocus && active;
						(<any> node.properties).onFocus = onFocus;
					}
				});
			}
			return result;
		}

		private onFocus(item?: number) {
			this.scheduleFocus(false);
			if (item !== undefined) {
				this.properties.onFocus(item);
			}
		}

		private retrieveFocus() {
			this.scheduleFocus(true);
		}
	}

	return FocusManager;
}

let createFocusCount = 0;
let updatedFocusCount = 0;

function FocusSchedulerMixin<T extends Constructor<WidgetBase<any>>>(Base: T): T {

	class FocusScheduler extends Base {

		protected onElementCreated(element: HTMLElement, key: string) {
			if (key === this.getFocusTarget()) {
				const { onFocus, scheduleFocus = false } = this.properties;
				if (scheduleFocus || this.properties.autoFocus) {
					console.log('focus from created', ++createFocusCount);
					element.focus();
					onFocus();
				}
			}
		}

		protected onElementUpdated(element: HTMLElement, key: string) {
			if (key === this.getFocusTarget()) {
				const { onFocus, scheduleFocus = false } = this.properties;
				if (scheduleFocus) {
					console.log('focus from updated', ++updatedFocusCount);
					element.focus();
					onFocus();
				}
			}
		}

		protected getFocusTarget() {
			return this.properties.key;
		}
	}

	return FocusScheduler;
}
