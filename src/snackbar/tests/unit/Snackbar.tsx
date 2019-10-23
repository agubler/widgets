const { describe, it } = intern.getInterface('bdd');

import assertationTemplate from '@dojo/framework/testing/assertionTemplate';
import harness from '@dojo/framework/testing/harness';
import { tsx } from '@dojo/framework/core/vdom';
import Snackbar from '../../index';
import * as css from '../../../theme/snackbar.m.css';
import Button from '../../../button/index';

describe('Snackbar', () => {
	const template = assertationTemplate(() => {
		return (
			<div key="root" classes={[css.root, css.open, undefined, undefined, undefined]}>
				<div key="content" classes={[css.content]}>
					<div
						key="label"
						assertion-key="label"
						classes={[css.label]}
						role="status"
						aria-live="polite"
					>
						test
					</div>
				</div>
			</div>
		);
	});

	it('renders', () => {
		const h = harness(() => (
			<Snackbar open={true}>{{ messageRenderer: () => 'test' }}</Snackbar>
		));
		h.expect(template);
	});

	it('renders non string message', () => {
		const h = harness(() => (
			<Snackbar open={true}>{{ messageRenderer: () => <div>test</div> }}</Snackbar>
		));
		const nonStringTemplate = template.setChildren('@label', [<div>test</div>]);
		h.expect(nonStringTemplate);
	});

	it('renders an array of non string messages', () => {
		const h = harness(() => (
			<Snackbar open={true}>
				{{ messageRenderer: () => [<div>test</div>, <div>test2</div>] }}
			</Snackbar>
		));
		const multipleNonStringTemplate = template.setChildren('@label', [
			<div>test</div>,
			<div>test2</div>
		]);
		h.expect(multipleNonStringTemplate);
	});

	it('renders closed', () => {
		const h = harness(() => (
			<Snackbar open={false}>{{ messageRenderer: () => 'test' }}</Snackbar>
		));
		const openTemplate = template.setProperty('@root', 'classes', [
			css.root,
			false,
			undefined,
			undefined,
			undefined
		]);
		h.expect(openTemplate);
	});

	it('renders success', () => {
		const h = harness(() => (
			<Snackbar type="success" open={true}>
				{{ messageRenderer: () => 'test' }}
			</Snackbar>
		));
		const successTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			css.success,
			undefined,
			undefined
		]);
		h.expect(successTemplate);
	});

	it('renders leading', () => {
		const h = harness(() => (
			<Snackbar leading open={true}>
				{{ messageRenderer: () => 'test' }}
			</Snackbar>
		));
		const successTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			undefined,
			css.leading,
			undefined
		]);
		h.expect(successTemplate);
	});

	it('renders stacked', () => {
		const h = harness(() => (
			<Snackbar stacked open={true}>
				{{ messageRenderer: () => 'test' }}
			</Snackbar>
		));
		const successTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			undefined,
			undefined,
			css.stacked
		]);
		h.expect(successTemplate);
	});

	it('renders error', () => {
		const h = harness(() => (
			<Snackbar type="error" open={true}>
				{{ messageRenderer: () => 'test' }}
			</Snackbar>
		));
		const errorTemplate = template.setProperty('@root', 'classes', [
			css.root,
			css.open,
			css.error,
			undefined,
			undefined
		]);
		h.expect(errorTemplate);
	});

	it('renders a single action', () => {
		const h = harness(() => (
			<Snackbar open>
				{{ messageRenderer: () => 'test', actionsRenderer: () => <Button>Dismiss</Button> }}
			</Snackbar>
		));
		const actionsTemplate = template.insertAfter('~label', [
			<div key="actions" classes={[css.actions]}>
				<Button>Dismiss</Button>
			</div>
		]);
		h.expect(actionsTemplate);
	});

	it('renders more than one action', () => {
		const h = harness(() => (
			<Snackbar open={true}>
				{{
					messageRenderer: () => 'test',
					actionsRenderer: () => [<Button>Retry</Button>, <Button>Close</Button>]
				}}
			</Snackbar>
		));
		const actionsTemplate = template.insertAfter('~label', [
			<div key="actions" classes={[css.actions]}>
				<Button>Retry</Button>
				<Button>Close</Button>
			</div>
		]);
		h.expect(actionsTemplate);
	});
});
