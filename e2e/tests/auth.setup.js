import { test as setup, expect } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'node:fs';

const _API_URL = 'http://127.0.0.1:8000';

const _PERMISSION_CUSTOMERS_READ = 0x40;

const _ADMINISTRATOR_USERNAME = 'administrator';

let apiContext;
let administrator_password;

setup.beforeAll(async ({ playwright }) => {
    const envFile = fs.readFileSync('../.env');
    const env = dotenv.parse(envFile);

    administrator_password = env.IRIS_ADM_PASSWORD

    apiContext = await playwright.request.newContext({
        baseURL: _API_URL,
        extraHTTPHeaders: {
            'Authorization': `Bearer ${env.IRIS_ADM_API_KEY}`,
            'Content-Type': 'application/json'
        },
    });
});

async function authenticate(page, login, password) {
    await page.goto('/');
    await page.getByRole('textbox', { name: 'Username' }).fill(login);
    await page.getByRole('textbox', { name: 'Password' }).fill(password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    // FIXME: It should be: await page.waitForURL('/dashboard'); No wildcard.
    // Wait until the page receives the cookies.
    await page.waitForURL('/dashboard*');
    const authFile = `./playwright/.auth/${login}.json`;
    await page.context().storageState({ path: authFile });
}

setup('authenticate as administrator', async ({ page }) => {
    await authenticate(page, _ADMINISTRATOR_USERNAME, administrator_password);
});

setup('authenticate as user with customers read rights', async ({ page }) => {
    // TODO when this method is called a second time, all these request will fail
    //      think about a better ways of doing things, some possible strategies
    //      - find a way to create a new valid database before and empty the database after
    //      - find a way to remove elements from the database to roughly get back to the initial state
    //      - code so that these requests are robust (check the group exists, user exists, link between the two is set...)
    //      - global setup and teardown? https://playwright.dev/docs/test-global-setup-teardown
    let response = await apiContext.post('/manage/groups/add', {
        data: {
            group_name: 'group_customers_r',
            group_description: 'Group with rights: customers_read',
            group_permissions: [_PERMISSION_CUSTOMERS_READ]
        }
    });
    const groupIdentifier = (await response.json()).data.group_id;
    const login = 'user_customers_r';
    const password = 'aA.1234567890';
    response = await apiContext.post('/manage/users/add', {
        data: {
            user_name: login,
            user_login: login,
            user_email: `${login}@eu`,
            user_password: password
        }
    });
    const userIdentifier = (await response.json()).data.id;
    response = await apiContext.post(`/manage/users/${userIdentifier}/groups/update`, {
        data: {
            groups_membership: [groupIdentifier]
        }
    });

    await authenticate(page, login, password);
});

setup.afterAll(async ({ }) => {
  // Dispose all responses.
  await apiContext.dispose();
});

