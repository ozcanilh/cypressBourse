class LoginPage {
  constructor() {
    this.elements = {
      usernameInput: '[data-test="username"]',
      passwordInput: '[data-test="password"]',
      loginButton: '[data-test="login-button"]',
    };
  }

  getUsernameInput() {
    return this.elements.usernameInput;
  }

  getPasswordInput() {
    return this.elements.passwordInput;
  }

  getLoginButton() {
    return this.elements.loginButton;
  }
}

export default new LoginPage();
