import { ClientFunction, Selector } from 'testcafe';
import { ReactSelector, waitForReact } from 'testcafe-react-selectors';
import { getPageUrl } from './helpers';

const getPageTitle = ClientFunction(() => document.title);
const tasksContainerSelector = Selector('[data-tid="tasks-container"]');
const tasksSelector = Selector('[data-tclass="task"]');
const firstTask = tasksSelector.nth(0);
const firstTaskSettingsBtn = firstTask.find('[data-tid="btn-task-settings"]');
const firstTaskLinksBtn = firstTask.find('[data-tid="btn-task-links"]');
const assertNoConsoleErrors = async t => {
  const { error } = await t.getBrowserConsoleMessages();
  await t.expect(error).eql([]);
};

fixture`Home Page`.page('../../app/app.html').afterEach(assertNoConsoleErrors);

test('e2e', async t => {
  await t.expect(getPageTitle()).eql('Console Workbench');
});

test('should open window', async t => {
  await t.expect(getPageTitle()).eql('Console Workbench');
});

test(
  "should haven't any logs in console of main window",
  assertNoConsoleErrors
);

test('should list initial jobs', async t => {
  await t.expect(tasksSelector().count).eql(1);
});

test('should navigate to /settings', async t => {
  await waitForReact();
  await t
    .hover(tasksContainerSelector)
    .click(
      ReactSelector('Link').withProps({
        to: '/settings'
      })
    )
    .expect(getPageUrl())
    .contains('/settings');
});

test('should navigate to /create', async t => {
  await waitForReact();
  await t
    .hover(tasksContainerSelector)
    .click(
      ReactSelector('Link').withProps({
        to: '/create'
      })
    )
    .expect(getPageUrl())
    .contains('/create');
});

test('should navigate to /job/1/edit', async t => {
  await waitForReact();
  await t
    .hover(firstTask)
    .click(firstTaskSettingsBtn)
    .expect(getPageUrl())
    .contains('/job/1/edit');
});

test('should navigate to /job/1/links', async t => {
  await waitForReact();
  await t
    .setNativeDialogHandler(() => true)
    .hover(firstTask)
    .click(firstTaskLinksBtn)
    .expect(getPageUrl())
    .contains('/job/1/links');
});
