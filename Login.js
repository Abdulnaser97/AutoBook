const { getElement } = require("./Utils");

var webdriver = require("selenium-webdriver");
var until = webdriver.until;
var By = webdriver.By;
var Key = webdriver.Key;
var element = webdriver.WebElement;

async function Login(driver, credentials) {
  let UNField = await getElement(driver, `.//input[@id="username"]`);
  await UNField.sendKeys(credentials.userName);

  let pwdField = await getElement(driver, `.//input[@id="password"]`);
  await pwdField.sendKeys(credentials.password);

  let loginButtons = await driver.findElements(
    By.xpath(`.//button[@id='login-button']`)
  );

  let loginButton = loginButtons[0];
  await loginButton.click();
}

module.exports = Login;
