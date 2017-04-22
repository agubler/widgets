import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { Keys } from '../common/util';

import * as css from './styles/basicMenu.m.css';

export interface ContainerProperties extends WidgetProperties {
}

export interface ItemWrapperProperties extends WidgetProperties {
	key: string;
	onFocusItem: Function;
	activeItem: boolean;
	scheduleItemFocus: boolean;
}

export interface ItemProperties extends WidgetProperties {
	title: string;
	onClick?: Function;
}

export class Container extends WidgetBase<ContainerProperties> {

	private _activeItem = 0;
	private _scheduleFocus = false;

	private _keyDown(event: KeyboardEvent) {
		switch (event.which) {
			case Keys.Up:
				event.preventDefault();
				event.stopPropagation();
				this._activeItem = this._activeItem === 0 ? this.children.length - 1 : this._activeItem - 1;
				this._scheduleFocus = true;
				this.invalidate();
				break;
			case Keys.Down:
				event.preventDefault();
				event.stopPropagation();
				this._activeItem = this._activeItem === this.children.length - 1 ? 0 : this._activeItem + 1;
				this._scheduleFocus = true;
				this.invalidate();
				break;
		}
	}

	private _onFocusItem(item?: number) {
		this._scheduleFocus = false;
		if (item !== undefined) {
			this._activeItem = item;
			this.invalidate();
		}
	}

	protected render(): DNode {
		const wrappedItems = this.children.map((child, i) => {
			const activeItem = this._activeItem === i;
			const scheduleItemFocus = this._scheduleFocus && activeItem;
			return w(ItemWrapper, { key: String(i), onFocusItem: this._onFocusItem, scheduleItemFocus, activeItem }, [ child ]);
		});

		return v('ul', { key: this.properties.key, onkeydown: this._keyDown }, wrappedItems);
	}
}

@theme(css)
export class ItemWrapper extends ThemeableMixin(WidgetBase)<ItemWrapperProperties> {

	protected onElementCreated(element: HTMLElement, key: string) {
		if (this.properties.scheduleItemFocus) {
			element.focus();
			this.properties.onFocusItem();
		}
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (this.properties.scheduleItemFocus) {
			element.focus();
			this.properties.onFocusItem();
		}
	}

	protected onClick(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onFocusItem(parseInt(this.properties.key, 10));
	}

	protected render(): DNode {
		return v('li', {
			key: this.properties.key,
			onclick: this.onClick,
			tabIndex: this.properties.activeItem ? 0 : -1,
			classes: this.classes(css.item)
		}, this.children);
	}
}

export class Item extends ThemeableMixin(WidgetBase)<ItemProperties> {

	private _onClick(event: MouseEvent) {
		this.properties.onClick && this.properties.onClick();
	}

	protected render(): DNode {
		return v('div', { onclick: this._onClick, key: this.properties.key }, [ this.properties.title, ...this.children ]);
	}
}
