var webdriver = require("selenium-webdriver");
var until = webdriver.until;
var By = webdriver.By;
var Key = webdriver.Key;
var element = webdriver.WebElement;

/* Helper Functions */

async function getElement(driver, xpath) {
  let webElements = await driver.findElements(By.xpath(xpath));
  if (webElements.length != 0) {
    return webElements[0];
  } else {
    throw new Error(`ERROR: getElement: Unable to find ${xpath}`);
  }
}

async function getElements(driver, xpath) {
  return await driver.findElements(By.xpath(xpath));
}

async function getSubElement(parentElement, xpath) {
  return await parentElement.findElement(By.xpath(xpath));
}

async function IsDisplayed(webElements) {
  if (webElements.length != 0 && (await webElements[0].isDisplayed())) {
    return true;
  } else {
    return false;
  }
}

async function waitFor(driver, xpath) {
  try {
    await driver.wait(until.elementsLocated(By.xpath(xpath)), 40000);
    const element = await getElement(driver, xpath);
    await driver.wait(until.elementIsEnabled(element), 40000);
  } catch (e) {
    console.log("ERROR: waitFor: ", e);
    await driver.sleep(30000);
  }
}

function getRollingDate(numOfDay, fullDate = false) {
  const today = new Date();
  // Start from today
  const tomorrow = new Date(today);
  // and roll X # of days
  tomorrow.setDate(tomorrow.getDate() + numOfDay);
  if (fullDate) {
    return tomorrow;
  }
  return tomorrow.getDate();
}
/**
 *
 * @param {String} day (e.g. Wed, fri)
 * @returns The day of month of next wed, fri, ..
 */
function dayToDate(day) {
  dayToNum = {
    mon: 1,
    tue: 2,
    wed: 3,
    thu: 4,
    fri: 5,
    sat: 6,
    sun: 7,
  };

  let dayOfWeek = dayToNum[day.toLowerCase()];

  // Find Today's # as day of week (1-7)
  const today = new Date();
  let todayOfWeek = today.getDay();

  if (dayOfWeek > todayOfWeek) {
    return getRollingDate(dayOfWeek - todayOfWeek);
  } else {
    return getRollingDate(7 + dayOfWeek - todayOfWeek);
  }
}

function getFullDate(dayOfMonth) {
  const today = new Date();
  const bookingDate = new Date(today);

  bookingDate.setDate(dayOfMonth);

  // If dayOfMonth is larger than today's day, it's in the same month
  // Else, it falls in next month
  if (today.getDate() > dayOfMonth) {
    bookingDate.setMonth(today.getMonth() + 1);
  }
  return bookingDate;
}

module.exports = {
  getElement,
  getElements,
  getSubElement,
  IsDisplayed,
  waitFor,
  getRollingDate,
  dayToDate,
  getFullDate,
};
