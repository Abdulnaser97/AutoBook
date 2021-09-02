require("geckodriver");
var firefox = require("selenium-webdriver/firefox");

var webdriver = require("selenium-webdriver");
var until = webdriver.until;
var By = webdriver.By;
var Key = webdriver.Key;
var element = webdriver.WebElement;

const {
  getElement,
  getElements,
  getSubElement,
  IsDisplayed,
  waitFor,
} = require("./Utils");

const Login = require("./Login");
const userDetails = require("./UserDetails");
const amenities = userDetails.amenities;

async function GymBooker(hour, amenityType, credentialsList, dayOfMonth) {
  let bookingCounter = 0;
  let hr =
    amenityType === "Pool"
      ? `${hour.slice(0, 1)}:15${hour.slice(hour.length - 2, hour.length)}`
      : hour;
  hr = hr.toLowerCase();

  try {
    var builder = new webdriver.Builder().forBrowser("firefox");
    driver = builder.build();
    await driver.get(amenities[amenityType]);

    // Full Screen
    await driver.manage().window().fullscreen();

    // Wait for page load
    await Promise.race([waitFor(driver, `.//button[@id='login-button']`)]).then(
      async () => {
        for (let i = 0; i < credentialsList.length; i++) {
          const successfullyBooked = await Book(
            driver,
            hr,
            dayOfMonth,
            amenityType,
            credentialsList[i]
          );

          await Logout(driver);

          await driver.get(amenities[amenityType]);

          // Full Screen
          await driver.manage().window().fullscreen();
          // Wait for page load
          await Promise.race([
            waitFor(driver, `.//button[@id='login-button']`),
          ]);

          if (successfullyBooked) {
            bookingCounter++;
          }
        }
      }
    );
    await driver.quit();
    return bookingCounter;
  } catch (e) {
    console.log("ERROR in GymBooker()", e);
    throw new Error(`ERROR: in GymBooker()`);
  }
}

async function Book(driver, hr, dayOfMonth, amenityType, credentials) {
  try {
    await Login(driver, credentials);

    await waitFor(driver, `.//*[text()[contains(.,'My Booking')]]`);

    // Choose Date
    await chooseDate(driver, dayOfMonth);
    await Promise.race([waitFor(driver, `.//button[@id="save-booking"]`)]);
    await waitFor(driver, `.//*[text()[contains(.,'My Booking')]]`);
    // Choose Time
    let chooseTimeButton = await getElement(
      driver,
      `.//button[@data-id='timeslots']`
    );
    await chooseTimeButton.click();

    startHour = parseInt(hr.split(":")[0]);
    endHour = startHour === 12 ? 1 : startHour + 1;
    let hour =
      amenityType === "Gym" ? `${hr} - ${hr[0]}` : `${hr} - ${endHour}`;

    let chosenTimeSlot = await getElements(
      driver,
      `.//li//span[text()[contains(., '${hour}')]]`
    );
    if (chosenTimeSlot.length == 0) {
      console.log("EARLY EXIT: Already Booked!");
      return true;
    }
    await chosenTimeSlot[0].click();

    // T&C and self-screening checkboxes
    let checkBoxes = await driver.findElements(
      By.xpath(
        `//*[@class="btn-group vertical"]//span[@class="btn-actual-checkbox"]`
      )
    );
    checkBoxes.map((checkBox) => checkBox.click());

    // Book!
    await waitFor(driver, `.//*[text()[contains(.,'My Booking')]]`);
    let submitButton = await getElement(driver, `//button[@id="save-booking"]`);
    await submitButton.click();

    await driver.sleep(1000);
    // If we get an error that we have reached max # of bookings that means
    //the previous attempt to book has worked
    let maxNumBookingReached = await driver.findElements(
      By.xpath(
        `.//span[text()[contains(.,'You have reached the maximum number of bookings')]]`
      )
    );
    if (await IsDisplayed(maxNumBookingReached)) {
      console.log(
        `Booked ${amenityType} using email ${credentials} !, Max # of booking reached`
      );
    } else {
      console.log(`Booked ${amenityType} using email ${credentials} !`);
    }
    return true;
  } catch (e) {
    console.log("ERROR in Book()", e);
    throw new Error(`Error in Book()`);
  }
}

async function chooseDate(driver, dayOfMonth) {
  try {
    let datePicker = await getElement(
      driver,
      `.//*[@id="datepicker_booking_date"]/span/span`
    );
    await datePicker.click();

    let jsDate = new Date().getDate().toString();
    let className = "day";
    if (dayOfMonth === jsDate) {
      className = "today active day";
    }
    await waitFor(driver, `.//th[@class='dow']`);

    let dateXPath = `.//td[@class='${className}']`;

    if (dayOfMonth) {
      dateXPath = `.//td[@class='${className}' and text()[contains(.,'${dayOfMonth}')]]`;
    }

    // First check if the booking windows extends to next month
    let nextButton = await getElements(
      driver,
      `.//div[@class='datepicker-days']//tr//th[@class='next']`
    );
    let dates;
    if (await IsDisplayed(nextButton)) {
      await nextButton[0].click();
      dates = await driver.findElements(By.xpath(dateXPath));

      // If no day available for booking next month, go back to current month
      if (!(await IsDisplayed(dates))) {
        let prevButton = await getElement(
          driver,
          `.//div[@class='datepicker-days']//tr//th[@class='prev']`
        );
        await prevButton.click();
      }
    }
    dates = await driver.findElements(By.xpath(dateXPath));

    let bookingDate = await dates[dates.length - 1];

    await bookingDate.click();
  } catch (e) {
    console.log("ERROR in chooseDate()", e);
    throw new Error(`Error in chooseDate()`);
  }
}

async function Logout(driver) {
  const logoutMenu = await getElement(driver, `.//span[@class="display_name"]`);
  await logoutMenu.click();

  await waitFor(
    driver,
    `.//a[@data-toggle='dropdown' and @aria-expanded='true']`
  );

  const logoutButton = await getElement(
    driver,
    `.//li/a[text()[contains(.,'Logout')]]`
  );
  await logoutButton.click();
}
module.exports = GymBooker;
