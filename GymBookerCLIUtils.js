const { getRollingDate, getFullDate, dayToDate } = require("./Utils");
const util = require("util");
const exec = util.promisify(require("child_process").exec);
const UserDetails = require("./UserDetails");
const credentialsList = UserDetails.credentialsList;
const credentialsListResorted = UserDetails.credentialsListResorted;

function getCredentialsList(email, sorted) {
  let customCredentialsList = [];
  let list = sorted ? credentialsListResorted : credentialsList;
  if (email.includes("@")) {
    list.forEach((credentials) => {
      if (credentials.userName === email) {
        customCredentialsList = [
          {
            userName: credentials.userName,
            password: credentials.password,
          },
        ];
      }
    });
  } else {
    // If a number "X" is passed as email, it means we need to make "X" reservations
    // So go to credentialsList and select any "X" # of the credentials from there
    for (let i = 0; i < parseInt(email); i++) {
      customCredentialsList.push(list[i]);
    }
  }

  return customCredentialsList;
}

function processDayOfMonth(dayOfMonth) {
  if (dayOfMonth === "lastAvailable") {
    return getRollingDate(3);
  } else {
    return dayOfMonth;
  }
}

async function processArguments(
  hr,
  amenityType,
  email,
  dayOfMonth,
  weekDay,
  sorted
) {
  let abort = false;
  console.log(
    `Today: ${new Date().getDate()} Booking-day: ${
      dayOfMonth ? dayOfMonth : weekDay
    }  Hour: ${hr}  Amenity: ${amenityType}  Email: ${email}`
  );

  let processedCredentialsList = getCredentialsList(email, sorted);
  let processedDayOfMonth = dayOfMonth
    ? processDayOfMonth(dayOfMonth)
    : dayToDate(weekDay);

  if (getFullDate(processedDayOfMonth) > getRollingDate(3, (fullDate = true))) {
    console.log("processDayOfMonth - Day out of available booking window");
    abort = true;
  }

  // exclude sat and thu from the recurring gym booking
  if (dayOfMonth === "lastAvailable") {
    if (
      dayToDate("sat") === processedDayOfMonth ||
      dayToDate("thu") === processedDayOfMonth
    ) {
      console.log(
        "lastAvailable is sat or thu, taken care of by the other cron tasks"
      );
      abort = true;
    }
  }

  return {
    processedCredentialsList: processedCredentialsList,
    processedDayOfMonth: processedDayOfMonth,
    abort: abort,
  };
}

async function openLogs(hr, weekDay, dayOfMonth, amenityType) {
  try {
    let logFile;
    if (dayOfMonth && dayOfMonth === "lastAvailable") {
      logFile = `cron${amenityType.toUpperCase()}_DAILY_${parseInt(
        hr.split(":")[0]
      )}.log`;
    } else {
      logFile = `cron${amenityType.toUpperCase()}_${weekDay.toUpperCase()}_${parseInt(
        hr.split(":")[0]
      )}.log`;
    }

    const { stdout } = await exec(`cd /tmp && open ${logFile}`);
    console.log(stdout);
  } catch (e) {
    console.log(`ERROR: logFile: unable to open logFile. Error: ${e}`);
  }
}

async function openSheet() {
  try {
    const { stdout } = await exec(
      `cd /Users/naser/Desktop/Projects/AutoBook && open bookingHistory.xls`
    );
    console.log(stdout);
  } catch (e) {
    console.log(`ERROR: logFile: unable to open logFile. Error: ${e}`);
  }
}

module.exports = {
  getCredentialsList,
  processDayOfMonth,
  processArguments,
  openLogs,
  openSheet,
};
