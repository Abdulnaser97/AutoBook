#! /usr/local/bin node

const util = require("util");
const exec = util.promisify(require("child_process").exec);

// Specify script to run cron scheduler as well as its contaning folder path
const REPO_PATH = "/Users/naser/Desktop/Projects/AutoBook";
const SCRIPT = "GymBookerCLI";

const {} = require("./Utils");
const { cmds } = require("./UserDetails");

async function cronCaller() {
  var bookingTime;
  var amenityType;
  var profile;
  process.argv.forEach((val, index) => {
    if (val.includes("hr=")) {
      bookingTime = val.substr("hr=".length + 2);
    } else if (val.includes("amenityType=")) {
      amenityType = val.substr("amenityType=".length + 2);
    } else if (val.includes("profile=")) {
      profile = val.substr("profile=".length + 2);
    }
  });

  const today = new Date();
  const tomorrow = new Date(today);
  //tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setDate(tomorrow.getDate());

  var day = tomorrow.getDate();
  var month = tomorrow.getMonth() + 1;
  if (amenityType && profile) {
    var cmd = `00 00 ${day} ${month} * cd ${REPO_PATH} && /usr/local/bin/node ${SCRIPT} --hr=${bookingTime} --amenityType=${amenityType} --profile=${profile} >/tmp/cronLogs${SCRIPT}.log 2>/tmp/cronErrLogs${SCRIPT}.log`;
  } else {
    var cmd = `00 00 ${day} ${month} * cd ${REPO_PATH} && /usr/local/bin/node ${SCRIPT} --hr=${bookingTime} --amenityType=Gym --profile=abdln.lly@gmail.com >/tmp/cronLogs${SCRIPT}.log 2>/tmp/cronErrLogs${SCRIPT}.log`;
  }

  console.log(cmd);

  cmd = `0 0 * 8 * cd /Users/naser/Desktop/Projects/AutoBook && /usr/local/bin/node GymBookerCLI --hr=6:00pm --weekDay=fri --amenityType=Pool --credentials=7 >/tmp/FriCronLogsPool.log 2>/tmp/FriCronErrPool.log`;

  const { stdout, stderr } = await exec(
    `(crontab -l 2>/dev/null; echo "${cmd}") | crontab -`
  );
  console.log(stdout);
  console.log(stderr);
}

async function batchSchedule(cmds) {
  for (cmd of cmds) {
    const { stdout, stderr } = await exec(
      `(crontab -l 2>/dev/null; echo "${cmd}") | crontab -`
    );
    console.log(stdout);
    console.log(stderr);
  }
}

cronCaller();
//batchSchedule(cmds);
