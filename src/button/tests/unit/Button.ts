const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';

import Button from '../../index';
import Icon from '../../../icon/index';
import * as css from '../../../theme/button.m.css';
import { isFocusedComparator, isNotFocusedComparator, noop, stubEvent } from '../../../common/tests/support/test-helpers';

const compareFocusFalse = {
	selector: 'button',
	property: 'focus',
	comparator: isNotFocusedComparator
};

const compareFocusTrue = {
	selector: 'button',
	property: 'focus',
	comparator: isFocusedComparator
};

const baseAssertion = assertionTemplate(() => {
	return v('button', {
		'~key': 'button',
		'aria-controls': null,
		'aria-expanded': null,
		'aria-haspopup': null,
		'aria-pressed': null,
		classes: [css.root, null, null, null],
		disabled: undefined,
		id: undefined,
		name: undefined,
		focus: noop,
		onblur: noop,
		onclick: noop,
		onfocus: noop,
		onkeydown: noop,
		onkeypress: noop,
		onkeyup: noop,
		onmousedown: noop,
		onmouseup: noop,
		ontouchstart: noop,
		ontouchend: noop,
		ontouchcancel: noop,
		type: undefined,
		value: undefined
	}, [null]);
});

registerSuite('Button', {
	tests: {
		'no content'() {
			const h = harness(() => w(Button, {}), [compareFocusFalse]);
			h.expect(baseAssertion);
		},

		'properties and attributes'() {
			const h = harness(() => w(Button, {
				type: 'submit',
				name: 'bar',
				widgetId: 'qux',
				aria: {
					describedBy: 'baz'
				},
				disabled: true,
				popup: {
					expanded: true,
					id: 'popupId'
				},
				pressed: true,
				value: 'value'
			}, ['foo']), [compareFocusFalse]);

			const assertion = baseAssertion
				.setProperty('~button', 'aria-controls', 'popupId')
				.setProperty('~button', 'aria-describedby', 'baz')
				.setProperty('~button', 'aria-expanded', 'true')
				.setProperty('~button', 'aria-haspopup', 'true')
				.setProperty('~button', 'aria-pressed', 'true')
				.setProperty('~button', 'classes', [css.root, css.disabled, css.popup, css.pressed])
				.setProperty('~button', 'name', 'bar')
				.setProperty('~button', 'id', 'qux')
				.setProperty('~button', 'type', 'submit')
				.setProperty('~button', 'value', 'value')
				.setProperty('~button', 'disabled', true)
				.setChildren('~button', [
					'foo',
					v('span', { classes: css.addon }, [
						w(Icon, { type: 'downIcon', theme: undefined, classes: undefined })
					])
				]);

			h.expect(assertion);
		},

		'popup = true'() {
			const h = harness(() => w(Button, {
				popup: true
			}), [compareFocusFalse]);

			const assertion = baseAssertion
				.setProperty('~button', 'aria-controls', '')
				.setProperty('~button', 'aria-expanded', 'false')
				.setProperty('~button', 'aria-haspopup', 'true')
				.setProperty('~button', 'classes', [css.root, null, css.popup, null])
				.setChildren('~button', [
					v('span', { classes: css.addon }, [
						w(Icon, { type: 'downIcon', theme: undefined, classes: undefined })
					])
				]);

			h.expect(assertion);
		},

		events() {
			let blurred = false;
			let clicked = false;
			let focused = false;
			let keydown = false;
			let keypress = false;
			let keyup = false;
			let mousedown = false;
			let mouseup = false;
			let touchstart = false;
			let touchend = false;
			let touchcancel = false;

			const h = harness(() => w(Button, {
				onBlur: () => { blurred = true; },
				onClick: () => { clicked = true; },
				onFocus: () => { focused = true; },
				onKeyDown: () => { keydown = true; },
				onKeyPress: () => { keypress = true; },
				onKeyUp: () => { keyup = true; },
				onMouseDown: () => { mousedown = true; },
				onMouseUp: () => { mouseup = true; },
				onTouchStart: () => { touchstart = true; },
				onTouchEnd: () => { touchend = true; },
				onTouchCancel: () => { touchcancel = true; }
			}));

			h.trigger('button', 'onblur');
			h.trigger('button', 'onclick', stubEvent);
			h.trigger('button', 'onfocus');
			h.trigger('button', 'onkeydown', stubEvent);
			h.trigger('button', 'onkeypress', stubEvent);
			h.trigger('button', 'onkeyup', stubEvent);
			h.trigger('button', 'onmousedown', stubEvent);
			h.trigger('button', 'onmouseup', stubEvent);
			h.trigger('button', 'ontouchstart', stubEvent);
			h.trigger('button', 'ontouchend', stubEvent);
			h.trigger('button', 'ontouchcancel', stubEvent);

			assert.isTrue(blurred);
			assert.isTrue(clicked);
			assert.isTrue(focused);
			assert.isTrue(keydown);
			assert.isTrue(keypress);
			assert.isTrue(keyup);
			assert.isTrue(mousedown);
			assert.isTrue(mouseup);
			assert.isTrue(touchstart);
			assert.isTrue(touchend);
			assert.isTrue(touchcancel);
		}
	}
});
