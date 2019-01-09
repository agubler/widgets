const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import { v, w } from '@dojo/framework/widget-core/d';
import Focus from '@dojo/framework/widget-core/meta/Focus';
import harness from '@dojo/framework/testing/harness';

import Label from '../../../label/index';
import Checkbox, { Mode, CheckboxProperties } from '../../index';
import * as css from '../../../theme/checkbox.m.css';
import { noop, MockMetaMixin, stubEvent } from '../../../common/tests/support/test-helpers';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';

const compareId = { selector: 'input', property: 'id', comparator: (property: any) => typeof property === 'string' };
const compareForId = { selector: '@label', property: 'forId', comparator: (property: any) => typeof property === 'string' };

const baseAssertion = assertionTemplate(() => {
	return v('div', {
		key: 'root',
		classes: [ css.root, null, null, null, null, null, null, null, null ]
	}, [
		v('div', { '~key': 'container', classes: css.inputWrapper }, [
			v('input', {
				id: '',
				classes: css.input,
				checked: false,
				disabled: undefined,
				focus: noop,
				'aria-invalid': null,
				name: undefined,
				readOnly: undefined,
				'aria-readonly': null,
				required: undefined,
				type: 'checkbox',
				value: undefined,
				onblur: noop,
				onchange: noop,
				onclick: noop,
				onfocus: noop,
				onmousedown: noop,
				onmouseup: noop,
				ontouchstart: noop,
				ontouchend: noop,
				ontouchcancel: noop
			})
		])
	]);
});

const baseAssertionWithLabel = baseAssertion.setChildren('@root', [
	...baseAssertion.getChildren('@root'),
	w(Label, {
		key: 'label',
		theme: undefined,
		classes: undefined,
		disabled: undefined,
		focused: false,
		hidden: undefined,
		invalid: undefined,
		readOnly: undefined,
		required: undefined,
		forId: '',
		secondary: true
	}, [ 'foo' ])
]);

const expectedToggle = function(labels = false, checked = false) {
	if (labels) {
		return [
			v('div', {
				key: 'offLabel',
				classes: css.offLabel,
				'aria-hidden': checked ? 'true' : null
			}, [ 'off' ]),
			v('div', {
				key: 'toggle',
				classes: css.toggleSwitch
			}),
			v('div', {
				key: 'onLabel',
				classes: css.onLabel,
				'aria-hidden': checked ? null : 'true'
			}, [ 'on' ])
		];
	}

	return [
		null,
		v('div', {
			key: 'toggle',
			classes: css.toggleSwitch
		}),
		null
	];
};

registerSuite('Checkbox', {
	tests: {
		'default properties'() {
			const h = harness(() => w(Checkbox, {}), [ compareId ]);
			h.expect(baseAssertion);
		},

		'custom properties'() {
			const h = harness(() => w(Checkbox, {
				aria: {
					describedBy: 'foo'
				},
				checked: true,
				widgetId: 'foo',
				name: 'bar',
				value: 'baz'
			}), [ compareId ]);

			const assertion = baseAssertion
				.setProperty('@root', 'classes', [css.root, null, css.checked, null, null, null, null, null, null])
				.setProperty('input', 'aria-describedby', 'foo')
				.setProperty('input', 'name', 'bar')
				.setProperty('input', 'value', 'baz')
				.setProperty('input', 'checked', true);

			h.expect(assertion);
		},

		'label'() {
			const h = harness(() => w(Checkbox, {
				label: 'foo'
			}), [ compareId, compareForId ]);

			h.expect(baseAssertionWithLabel);
		},

		'state classes'() {
			let invalid = true;
			let disabled = true;
			let readOnly = true;
			let required = true;
			const h = harness(() => w(Checkbox, {
				invalid,
				disabled,
				readOnly,
				required
			}), [ compareForId, compareId ]);

			let assertion = baseAssertion
				.setProperty('@root', 'classes', [ css.root, null, null, css.disabled, null, css.invalid, null, css.readonly, css.required ])
				.setProperty('input', 'aria-invalid', 'true')
				.setProperty('input', 'aria-readonly', 'true')
				.setProperty('input', 'disabled', true)
				.setProperty('input', 'readOnly', true)
				.setProperty('input', 'required', true);

			h.expect(assertion);

			invalid = false;
			disabled = false;
			readOnly = false;
			required = false;

			assertion = baseAssertion
				.setProperty('@root', 'classes', [ css.root, null, null, null, null, null, css.valid, null, null ])
				.setProperty('input', 'aria-invalid', null)
				.setProperty('input', 'aria-readonly', null)
				.setProperty('input', 'disabled', false)
				.setProperty('input', 'readOnly', false)
				.setProperty('input', 'required', false);

			h.expect(assertion);
		},

		'state properties on label'() {
			const h = harness(() => w(Checkbox, {
				label: 'foo',
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			}), [ compareId, compareForId ]);

			const assertion = baseAssertionWithLabel
				.setProperty('@root', 'classes', [ css.root, null, null, css.disabled, null, css.invalid, null, css.readonly, css.required ])
				.setProperty('input', 'aria-invalid', 'true')
				.setProperty('input', 'aria-readonly', 'true')
				.setProperty('input', 'disabled', true)
				.setProperty('input', 'readOnly', true)
				.setProperty('input', 'required', true)
				.setProperty('@label', 'invalid',  true)
				.setProperty('@label', 'disabled', true)
				.setProperty('@label', 'readOnly', true)
				.setProperty('@label', 'required', true);

			h.expect(assertion);
		},

		'focused class'() {
			const mockMeta = sinon.stub();
			const mockFocusGet = sinon.stub().returns({
				active: false,
				containsFocus: true
			});
			mockMeta.withArgs(Focus).returns({
				get: mockFocusGet
			});
			const h = harness(() => w(MockMetaMixin(Checkbox, mockMeta), {}), [ compareId ]);

			const assertion = baseAssertion.setProperty(
				'@root',
				'classes',
				[ css.root, null, null, null, css.focused, null, null, null, null ]
			);
			h.expect(assertion);
		},

		'toggle mode'() {
			let properties: CheckboxProperties = {
				mode: Mode.toggle
			};
			const h = harness(() => w(Checkbox, properties), [ compareId, compareForId ]);

			let assertion = baseAssertion
				.setProperty('@root', 'classes', [css.root, css.toggle, null, null, null, null, null, null, null])
				.setChildren('~container', [
					null,
					v('div', {
						key: 'toggle',
						classes: css.toggleSwitch
					}),
					null,
					...baseAssertion.getChildren('~container')
				]);

			h.expect(assertion);

			properties = {
				mode: Mode.toggle,
				offLabel: 'off',
				onLabel: 'on'
			};

			assertion = baseAssertion
				.setProperty('@root', 'classes', [css.root, css.toggle, null, null, null, null, null, null, null])
				.setChildren('~container', [
					v('div', {
						key: 'offLabel',
						classes: css.offLabel,
						'aria-hidden': null
					}, [ 'off' ]),
					v('div', {
						key: 'toggle',
						classes: css.toggleSwitch
					}),
					v('div', {
						key: 'onLabel',
						classes: css.onLabel,
						'aria-hidden': 'true'
					}, [ 'on' ]),
					...baseAssertion.getChildren('~container')
				]);

			h.expect(assertion);

			properties = {
				checked: true,
				mode: Mode.toggle,
				offLabel: 'off',
				onLabel: 'on'
			};

			assertion = assertion
				.setProperty('@root', 'classes', [css.root, css.toggle, css.checked, null, null, null, null, null, null])
				.setProperty('input', 'checked', true)
				.setProperty('@offLabel', 'aria-hidden', 'true')
				.setProperty('@onLabel', 'aria-hidden', null);

			h.expect(assertion);
		},

		events() {
			const onBlur = sinon.stub();
			const onChange = sinon.stub();
			const onClick = sinon.stub();
			const onFocus = sinon.stub();
			const onMouseDown = sinon.stub();
			const onMouseUp = sinon.stub();
			const onTouchStart = sinon.stub();
			const onTouchEnd = sinon.stub();
			const onTouchCancel = sinon.stub();

			const h = harness(() => w(Checkbox, {
				onBlur,
				onChange,
				onClick,
				onFocus,
				onMouseDown,
				onMouseUp,
				onTouchStart,
				onTouchEnd,
				onTouchCancel
			}));

			h.trigger('input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('input', 'onchange', stubEvent);
			assert.isTrue(onChange.called, 'onChange called');
			h.trigger('input', 'onclick', stubEvent);
			assert.isTrue(onClick.called, 'onClick called');
			h.trigger('input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
			h.trigger('input', 'onmousedown', stubEvent);
			assert.isTrue(onMouseDown.called, 'onMouseDown called');
			h.trigger('input', 'onmouseup', stubEvent);
			assert.isTrue(onMouseUp.called, 'onMouseUp called');
			h.trigger('input', 'ontouchstart', stubEvent);
			assert.isTrue(onTouchStart.called, 'onTouchStart called');
			h.trigger('input', 'ontouchend', stubEvent);
			assert.isTrue(onTouchEnd.called, 'onTouchEnd called');
			h.trigger('input', 'ontouchcancel', stubEvent);
			assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
		}
	}
});
