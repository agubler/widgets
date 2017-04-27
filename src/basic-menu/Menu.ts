import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode, WNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, isWNode, w } from '@dojo/widget-core/d';
import { Keys } from '../common/util';

import * as css from './styles/basicMenu.m.css';

export interface ContainerProperties extends WidgetProperties {
	key: string;
	onFocus?: Function;
	role?: string;
	openPath?: string[];
	selectedKey?: string;
	autoFocus?: boolean;
}

export interface ItemProperties extends WidgetProperties {
	title: string;
	action?: Function;
}

export interface WrapperProperties extends WidgetProperties {
	key: string;
	parent: string;
	openPath: string[];
	selectedKey?: string;
	onFocus: Function;
	onAction?: Function;
	item: WNode;
	scheduleFocus: boolean;
	autoFocus: boolean;
	setScheduleFocus: Function;
}

export class Container extends WidgetBase<ContainerProperties> {

	private _scheduleFocus = false;

	public scheduleFocus(value: boolean) {
		this._scheduleFocus = value;
	}

	private _keyDown(event: KeyboardEvent) {
		let nextActiveItem;
		let selected = false;
		switch (event.which) {
			case Keys.Up:
				event.preventDefault();
				event.stopPropagation();
				for (let i = this.children.length; i >= 0; i--) {
					const child = this.children[i];
					if (isWNode(child)) {
						if (selected) {
							nextActiveItem = child.properties.key;
							break;
						}
						if (child.properties.key === this.properties.selectedKey) {
							selected = true;
							continue;
						}
					}
				}
				if (!nextActiveItem) {
					nextActiveItem = (<any> this.children)[this.children.length - 1].properties.key;
				}
				this.scheduleFocus(true);
				this.properties.onFocus && this.properties.onFocus(nextActiveItem, undefined);
				break;
			case Keys.Down:
				event.preventDefault();
				event.stopPropagation();
				for (let i = 0; i < this.children.length; i++) {
					const child = this.children[i];
					if (isWNode(child)) {
						if (selected) {
							nextActiveItem = child.properties.key;
							break;
						}
						if (child.properties.key === this.properties.selectedKey) {
							selected = true;
							continue;
						}
					}
				}
				if (!nextActiveItem) {
					nextActiveItem = (<any> this.children)[0].properties.key;
				}
				this.scheduleFocus(true);
				this.properties.onFocus && this.properties.onFocus(nextActiveItem, undefined);
				break;
		}
	}

	protected _onFocus(value: string, path: string[], expandTo?: string) {
		if (expandTo && path.indexOf(expandTo) !== -1) {
			path = path.slice(0, path.indexOf(expandTo) + 1);
		}
		this.scheduleFocus(false);
		this.properties.onFocus && this.properties.onFocus(value, path);
	}

	protected render(): DNode {
		const { openPath = [ this.properties.key ], selectedKey } = this.properties;
		const open = openPath.indexOf(this.properties.key) !== -1;
		let children: DNode[] = [];
		if (open) {
			const childExists = this.children.some((child: WNode) => {
				return child.properties.key === selectedKey;
			});
			children = this.children.map((child: WNode, i) => {

				if (!selectedKey && i === 0) {
					this._onFocus((<any> child).properties.key, openPath);
				}

				return w(Wrapper, {
					key: <string> child.properties.key,
					parent: this.properties.key,
					item: child,
					openPath,
					selectedKey: i === 0 && !childExists ? child.properties.key : selectedKey,
					onFocus: this._onFocus,
					autoFocus: this.properties.autoFocus || false,
					scheduleFocus: selectedKey === child.properties.key && this._scheduleFocus,
					setScheduleFocus: this.scheduleFocus
				});
			});
		}

		return open ?
			v('ul', {
				id: this.properties.key,
				key: this.properties.key,
				onkeydown: this._keyDown,
				'aria-labelledby': (<any> this.properties).labelledBy,
				role: this.properties.role || 'menubar'
			}, children) : null;
	}
}

class Wrapper extends WidgetBase<WrapperProperties> {

	private _collapseMenu(scheduleFocus: boolean = true) {
		let result = false;
		const container = this.getContainer();
		let openPath = [ ...this.properties.openPath ];
		if (container && container.properties.key) {
			const containerKey = container.properties.key;
			const pathIndex = openPath.indexOf(containerKey);
			if (pathIndex === (openPath.length - 1)) {
				result = true;
				openPath.pop();
				this.properties.onFocus(this.properties.key, openPath, container.properties.key);
				this.properties.setScheduleFocus(scheduleFocus);
			}
		}
		return result;
	}

	private _expandMenu(expand: boolean = true) {
		let openPath = [ ...this.properties.openPath ];
		const container = this.getContainer();
		if (container && container.properties.key) {
			const containerKey = container.properties.key;
			const pathIndex = openPath.indexOf(containerKey);
			if (pathIndex === -1) {
				openPath = openPath.slice(0, openPath.indexOf(this.properties.parent) + 1);
				openPath.push(containerKey);
				this.properties.onFocus(this.properties.key, openPath, container.properties.key);
				this.properties.setScheduleFocus(true);
			}
		}
	}

	render() {
		const { item: wrappedItem } = this.properties;
		const container = wrappedItem.children[0];
		if (isWNode(container)) {
			const containerProperties: any = container.properties;
			// pass the container properties down.
			containerProperties.openPath = this.properties.openPath;
			containerProperties.selectedKey = this.properties.selectedKey;
			containerProperties.onFocus = this.properties.onFocus;
			containerProperties.autoFocus = true;
			containerProperties.expandMenu = this._expandMenu.bind(this);
			containerProperties.collapseMenu = this._collapseMenu.bind(this);
			// add toggle menu to item
			(<any> wrappedItem).properties.expandMenu = this._expandMenu.bind(this);
			(<any> wrappedItem).properties.collapseMenu = this._collapseMenu.bind(this);
			(<any> wrappedItem).properties.controls = container.properties.key;

		}
		(<any> wrappedItem).properties.openPath = this.properties.openPath;
		(<any> wrappedItem).properties.onFocus = this.properties.onFocus;
		(<any> wrappedItem).properties.parent = this.properties.parent;
		(<any> wrappedItem).properties.selectedKey = this.properties.selectedKey;
		(<any> wrappedItem).properties.scheduleFocus = this.properties.scheduleFocus;
		(<any> wrappedItem).properties.autoFocus = this.properties.autoFocus;

		return wrappedItem;
	}

	private getContainer(): WNode | undefined {
		const container = this.properties.item.children[0];
		if (isWNode(container)) {
			return container;
		}
		return undefined;
	}
}

let createFocusCount = 0;
let updatedFocusCount = 0;

@theme(css)
export class Item extends ThemeableMixin(WidgetBase)<any> {

	private onClick(event: MouseEvent) {
		console.log('click');
		event.stopPropagation();
		event.preventDefault();
		this.performAction();
	}

	private performAction() {
		const { action, openPath, controls, expandMenu, collapseMenu } = this.properties;
		const subMenuAction = openPath.indexOf(controls) > -1 ? collapseMenu : expandMenu;
		if (subMenuAction) {
			subMenuAction();
		}
		else {
			this.properties.onFocus(
				this.properties.key,
				this.properties.openPath,
				this.properties.parent);
			if (action) {
				action();
			}
		}
	}

	private onKeyDown(event: KeyboardEvent) {
		switch (event.which) {
			case Keys.Space:
				event.preventDefault();
				event.stopPropagation();
				this.performAction();
			break;
			case Keys.Right:
				if (this.properties.expandMenu) {
					event.preventDefault();
					event.stopPropagation();
					this.properties.expandMenu();
				}
			break;
			case Keys.Left:
			case Keys.Escape:
				if (this.properties.collapseMenu) {
					const result = this.properties.collapseMenu(true);
					if (result) {
						event.preventDefault();
						event.stopPropagation();
					}
				}
			break;
		}
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === this.getFocusTarget()) {
			const { onFocus, scheduleFocus = false } = this.properties;
			if (scheduleFocus  || (this.properties.autoFocus && this.properties.key === this.properties.selectedKey)) {
				console.log('focus from created', ++createFocusCount, 'key', this.properties.key, 'path', this.properties.openPath);
				element.focus();
				onFocus(this.properties.key, this.properties.openPath);
			}
		}
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === this.getFocusTarget()) {
			const { onFocus, scheduleFocus = false } = this.properties;
			if (scheduleFocus) {
				console.log('focus from updated', ++updatedFocusCount, 'key', this.properties.key, 'path', this.properties.openPath);
				element.focus();
				onFocus(this.properties.key, this.properties.openPath);
			}
		}
	}

	protected getFocusTarget() {
		return `item-label-${this.properties.key}`;
	}

	protected render(): DNode {
		return v('li', {
			id: this.properties.key,
			onkeydown: this.onKeyDown,
			onclick: this.onClick,
			key: this.properties.key,
			classes: this.classes(css.item),
			role: 'none'
		}, [
			v('div', {
				tabIndex: this.properties.selectedKey === this.properties.key ? 0 : -1,
				classes: this.classes(css.item),
				key: `item-label-${this.properties.key}`,
				role: 'menuitem'
			}, [ this.properties.title ]),
			...this.children
		]);
	}
}
