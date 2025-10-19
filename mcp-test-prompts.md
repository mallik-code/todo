1. Using playwrite open http://localhost:3001, then test log in using the default credentials (username: user1, password: password1), then logs out, and finally asserts that the user is returned to the login page.

2. Open the browser (use headed mode not headless), navigate to the frontend URL (http://localhost:3001). Then, perform the following actions sequentially: 1. Fill in 'user1' as the username and 'password1' as the password. 2. Click the Login button. 3. Click the Logout button. 4. Assert that the current URL is back to the login page.

3. Open the browser (use headed mode not headless), navigate to the frontend URL (http://localhost:3001). Then, perform the following actions sequentially: 1. Fill in 'user1' as the username and 'password1' as the password. 2. Click the Login button. 3. Click the Logout button, take more time to logout. 4. Assert that the current URL is back to the login page.

4. Open the browser (use headed mode not headless), navigate to the frontend URL (http://localhost:3001). Then, perform the following actions sequentially: 1. You only fill 'user1' and 'password1' in Username the password fields. 2. Click the Login button.

5. Open the browser (use headed mode), navigate to the frontend URL (http://localhost:3001). Wait for the 'Login' page to be fully interactive. Then, perform the following actions sequentially using user-facing attributes (like labels or roles) for locators: 1. Fill the field labeled 'Username' with 'user1'. 2. Fill the field labeled 'Password' with 'password1'. 3. Click the 'Login' button. End by taking a screenshot named 'post-login-attempt.png'.
