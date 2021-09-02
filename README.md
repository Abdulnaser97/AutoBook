
![Logo](https://github-autobook.s3.us-east-2.amazonaws.com/AutoBookContent/AutoBookLogo.png)

    
# AutoBook

AutoBook is an automation pipeline that allows you to call a selenium script to automate amenities booking (Gym, courts, rooms).

It can also schedule the script to run at 12:00 AM to book before everyone else!

## Bonus
I created [this](https://www.icloud.com/shortcuts/4e2be0ed0ce9483d9f0bb52d96359904) shortcut app that SSH into computer and book effortlessly.

![App Screenshot](https://github-autobook.s3.us-east-2.amazonaws.com/AutoBookContent/AutoBook2.png)


## Some more context

The motivation behind this project is to eliminate the redundant process of booking services and amenities which is not only boring, but requires early bookings
to be able to find available slots that fits your schedule.

It runs daily at 12:00 AM, as soon as booking windows shifts to new dates. Therefore, It doesn't only free up some mental space, but also ensures you are always the first to book! 



You can call different node files to obtain different functionalities as in the table below


| File name |     Description                |
| :-------- | :------------------------- |
| `CronCaller.js` | Schedule the script to run at a specific time |
| `GymBookerCLI.js` | run the script now |


| Arguments |    Format                |    Description                |
| :-------- | :------------------------- | :------------------------- |
| `--hr` | `hh:mm[am/pm]` | Time slot to book |
| `--dayOfMonth` | `[1...31]`| The day of your booking |
| `--amenityType` | `[Gym, Pool]`| Type of amenity|
| `--profile` | `[example@x.com, gg@gg.com]`| The email address of your FireFox profile|

![App Screenshot](https://github-autobook.s3.us-east-2.amazonaws.com/AutoBookContent/AutoBook1.png)


## Notes

* You can also change the configuration in `CronCaller.js` to schedule the script to run **everyday** at a specific time.
* The app features multiple accounts and amenities support if you have more than one membership/amenity.
* In order of the scheduled task to run, ensure that your pc in always on, or schedule a wakeup intervale a couple minutes prior to the scheduled task runtime.

## Usage

* Install the shortcut from [here](https://www.icloud.com/shortcuts/4e2be0ed0ce9483d9f0bb52d96359904).

* Configure the SSH connection in the shortcut to your computer.
  Note: Ensure the ssh connection has Full Disk Access in system preferences.

* Edit the selenium script under  `GymBooker.js`  to taylor it to your booking portal's booking process. 

* Create a Firefox profile and save your booking portal's login credentials there.
* Update `UserDetails.js` with your FireFox profile link and links to the amenities' booking portal.
* Call `CronCaller.js` or `GymBookerCLI.js` through the SSH script in the shortcut app.


## Wanna Chat?

Email: labwani.com@gmail.com

[![portfolio](https://img.shields.io/badge/my_portfolio-000?style=for-the-badge&logo=ko-fi&logoColor=white)](https://www.labwani.com/)
[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/abdulnaser-allabwani/)

## License

[![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)](https://github.com/tterb/atomic-design-ui/blob/master/LICENSEs)

  
