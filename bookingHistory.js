const XLSX = require("xlsx");

async function logBooking(bookingEntry) {
  const fileName = "bookingHistory";

  var workbook = null;

  try {
    workbook = XLSX.readFile(`${fileName}.xls`);
  } catch (e) {
    if (!workbook) {
      workbook = XLSX.utils.book_new(); // Create xlsx book

      const data = [];
      data.push([
        "Script Run Date",
        "Booking Date",
        "Amenity Type",
        "Number Of Requested Bookings",
        " Number Booked",
      ]);

      const sheet = XLSX.utils.aoa_to_sheet(data); // Create a sheet
      XLSX.utils.book_append_sheet(workbook, sheet, "sheet1"); // Attach the sheet
    }
  }

  var first_sheet_name = workbook.SheetNames[0];

  /* Get worksheet */
  let worksheet = workbook.Sheets[first_sheet_name];

  var date = new Date().toJSON().slice(0, 10).replace(/-/g, "/");

  /* Append row */
  await XLSX.utils.sheet_add_json(
    worksheet,
    [
      {
        A: `${date}`,
        B: `${bookingEntry.bookingDate}`,
        C: `${bookingEntry.amenityType}`,
        D: `${bookingEntry.numberOfRequestedBookings}`,
        E: `${bookingEntry.numberBooked}`,
      },
    ],
    {
      header: ["A", "B"],
      skipHeader: true,
      origin: -1,
    }
  );

  XLSX.writeFile(workbook, `${fileName}.xls`); // Save the file
}

// Retrieve last booking attempt stored in the xlsx file and convert them array of JSON objects

async function getLastBooking() {
  const fileName = "bookingHistory";

  var workbook = null;

  try {
    workbook = XLSX.readFile(`${fileName}.xls`);
  } catch (e) {
    throw new Error("Couldn't load workbook");
  }

  var first_sheet_name = workbook.SheetNames[0];

  /* Get worksheet */
  let worksheet = workbook.Sheets[first_sheet_name];

  // Get the names column
  const bookingRow = await XLSX.utils.sheet_to_json(worksheet, {
    header: "A",
  });

  return bookingRow;
}

module.exports = {
  logBooking,
  getLastBooking,
};
