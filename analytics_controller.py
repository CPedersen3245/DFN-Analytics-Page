import json
import re
import commands
import calendar
import time
from datetime import datetime, date, timedelta

"""""
* Name: datetimeSanityCheck
*
* Purpose: Sanity checks an input datetime range
*
* Params: startdate and enddate, 2 datetime strings
*
* Return: A boolean, true if input is sane and false if invalid
*
* Notes: none
"""""
def datetimeSanityCheck(startdate, enddate):
    sane = True

    if not startdate or not enddate:
        sane = False
    else:
        now = datetime.now()

        # Strip away timezones and make into python datetime objects
        startdate = ' '.join(startdate.split(' ')[:-2])
        enddate = ' '.join(enddate.split(' ')[:-2])
        startdatetime = datetime.strptime(startdate, '%a %b %d %Y %H:%M:%S')
        enddatetime = datetime.strptime(enddate, '%a %b %d %Y %H:%M:%S')

        # If dates are wrong way around, or either date is in the future:
        if (startdatetime >= enddatetime) or (startdatetime > now) or (enddatetime > now):
            sane = False

        return sane

"""""
* Name: findPictures
*
* Purpose: Finds all pictures on the HDD within the specified datetime range
*
* Params: startdate and enddate, 2 datetime objects
*
* Return: An array of filenames
*
* Notes: none
"""""
def findPictures(startdate, enddate):
    data = {}
    # If datetimes valid, begin finding pictures
    if datetimeSanityCheck(startdate, enddate):
        # Strip away timezones and make into python datetime objects
        startdate = ' '.join(startdate.split(' ')[:-2])
        enddate = ' '.join(enddate.split(' ')[:-2])
        startdatetime = datetime.strptime(startdate, '%a %b %d %Y %H:%M:%S')
        enddatetime = datetime.strptime(enddate, '%a %b %d %Y %H:%M:%S')

        # For each date between (And inclusive), print the date.
        startdate = date(startdatetime.year, startdatetime.month, startdatetime.day)
        enddate = date(enddatetime.year, enddatetime.month, enddatetime.day)
        datedelta = enddate - startdate

        # Array is for storing days between (inclusive) selected dates.
        days = []
        directories = []

        # Find all dates in range in the form YYYY-MM-DD
        for i in range(datedelta.days + 1):
            days.append(startdate + timedelta(days=i))

        # For each date in the given range, find directories with this date in the filename
        commandTemplate = "find /data[0-3] -type d -name '*{0}-{1}-{2}*' | grep -v 'test\|video'"

        for day in days:
            commandOutput = commands.getstatusoutput(commandTemplate.format(day.year, str(day.month).zfill(2), str(day.day).zfill(2)))
            commandOutputExitCode = commandOutput[0]
            if commandOutputExitCode == 0:
                commandOutputText = commandOutput[1]
                directories.extend(commandOutputText.split('\n'))
        if len(directories) == 0:
            raise IOError('ERROR: No directories found between the specified range.')

        # For each directory, find all NEF files in it, along with their timestamps.
        for directory in directories:
            fileList = commands.getoutput('ls ' + directory).split("\n")
            for fileName in fileList:
                if '.jpg' in fileName:
                    filePathNoStatic = (directory + '/' + fileName)
                    filePath = ('/static' + filePathNoStatic)

                    # Get unix timestamp for file creation
                    commandTemplate = "find " + filePathNoStatic + " -exec stat -c%Y {} \;"
                    fullTimestampEpoch = int(time.mktime(time.localtime(int(commands.getstatusoutput(commandTemplate)[1]))))
                    fullTimestampDatetime = datetime.fromtimestamp(fullTimestampEpoch)
                    if startdatetime < fullTimestampDatetime < enddatetime:
                        fullTimestamp = datetime.strftime(fullTimestampDatetime, '%d-%m-%Y at %H:%M:%S %Z')

                        # Write to JSON: {(timestamp), (filepath)}
                        data[fullTimestamp] = filePath



        if not data:
            raise IOError('ERROR: Interval control ran for this range, but no .NEF files were found.')

        return json.dumps(data, sort_keys=True)

    else:
        raise SyntaxError('ERROR: Dates invalid. Please try again.')
