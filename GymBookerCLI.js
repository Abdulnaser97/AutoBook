const GymBooker = require("./GymBooker");
const { getFullDate } = require("./Utils");
const { switchOutputAudio, changeVolume } = require("./MacAudio");
const { logBooking } = require("./bookingHistory");
const {
  processArguments,
  openLogs,
  openSheet,
} = require("./GymBookerCLIUtils");

let properties = [
  { ask: "Enter hour [HH:MM]: ", name: "hr", value: "" },
  {
    ask: "Enter Amenity Type (Gym, Pool): ",
    name: "amenityType",
    value: "Gym",
  },
  {
    ask: "Enter credentials to use for booking [email address]: ",
    name: "credentials",
    value: "abdln.lly@gmail.com",
  },
  {
    ask: "Enter Day of Month (e.g. 1, 2, 25): ",
    name: "dayOfMonth",
    value: "",
  },
  {
    ask: "Enter week day (e.g. Mon, Fri, Sat): ",
    name: "weekDay",
    value: "",
  },
  {
    ask: "Sorted?",
    name: "sorted",
    value: "",
  },
];

// print process.argv
process.argv.forEach((val, index) => {
  //console.log(`${index}: ${val}`);
  if (val.includes("hr=")) {
    properties[0].value = val.substr("hr=".length + 2);
  } else if (val.includes("amenityType=")) {
    properties[1].value = val.substr("amenityType=".length + 2);
  } else if (val.includes("credentials=")) {
    properties[2].value = val.substr("credentials=".length + 2);
  } else if (val.includes("dayOfMonth=")) {
    properties[3].value = val.substr("dayOfMonth=".length + 2);
  } else if (val.includes("weekDay=")) {
    properties[4].value = val.substr("weekDay=".length + 2);
  } else if (val.includes("sorted=")) {
    properties[5].value = val.substr("sorted=".length + 2);
  }
});

async function GymBookerCLI(
  hr,
  amenityType,
  email,
  dayOfMonth,
  weekDay,
  sorted
) {
  // Mute volume
  switchOutputAudio("MacBook Pro Speakers");
  changeVolume("MacBook Pro Speakers", 0);

  let repeatCounter = 0;
  const maxRepeats = 3;
  let err = false;

  let bookingSummary = {
    bookingDate: "",
    amenityType: "",
    numberOfRequestedBookings: "",
    numberBooked: "",
  };

  const { processedCredentialsList, processedDayOfMonth, abort } =
    await processArguments(hr, amenityType, email, dayOfMonth, weekDay, sorted);

  // log attempt to excelsheet
  bookingSummary.bookingDate = getFullDate(processedDayOfMonth);
  bookingSummary.amenityType = amenityType;
  bookingSummary.numberOfRequestedBookings = email;

  // Handle corner cases
  if (abort) {
    return;
  }

  do {
    try {
      const numOfBookings = await GymBooker(
        hr,
        amenityType,
        processedCredentialsList,
        processedDayOfMonth
      );

      bookingSummary.numberBooked = numOfBookings;

      if ((await numOfBookings) == 0) {
        throw new Error(" number of booking is 0!");
      }
      console.log(
        `Successfully Booked ${numOfBookings} ${amenityType} slot/s on day ${processedDayOfMonth} at ${hr}`
      );
      err = false;

      await openLogs(hr, weekDay, dayOfMonth, amenityType);
    } catch (e) {
      console.log("ERROR: GymBookerCLI: ", e);
      repeatCounter++;
      err = true;
    }
  } while (repeatCounter < maxRepeats && err == true);

  // Unmute volume
  changeVolume("MacBook Pro Speakers", 0.6);
  switchOutputAudio("USB Audio Device");

  // Store results in excelsheet
  logBooking(bookingSummary);
  await openSheet();
}

GymBookerCLI(
  properties[0].value,
  properties[1].value,
  properties[2].value,
  properties[3].value,
  properties[4].value,
  properties[5].value
);
