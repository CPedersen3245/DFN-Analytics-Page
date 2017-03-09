import json
import constants
import commands
import time
from datetime import datetime, date, timedelta

"""""
* Name: doConsoleCommand
*
* Purpose: Performs a bash command in terminal
*
* Params: command, a string of a bash command to perform
*
* Return: A list, where [0] is the status code from the command, and [1] being the output string.
*
* Notes: none
"""""
def doConsoleCommand(command):
    return commands.getstatusoutput(command)

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
def datetimeSanityCheck(startDate, endDate):
    sane = True

    if not startDate or not endDate:
        sane = False
    else:
        now = datetime.now()

        # Strip away timezones and make into python datetime objects
        startDate = ' '.join(startDate.split(' ')[:-2])
        endDate = ' '.join(endDate.split(' ')[:-2])
        startdatetime = datetime.strptime(startDate, '%a %b %d %Y %H:%M:%S')
        enddatetime = datetime.strptime(endDate, '%a %b %d %Y %H:%M:%S')

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
def findPictures(startDate, endDate):
    data = {}
    # If datetimes valid, begin finding pictures
    if datetimeSanityCheck(startDate, endDate):
        # Strip away timezones and make into python datetime objects
        startDate = ' '.join(startDate.split(' ')[:-2])
        endDate = ' '.join(endDate.split(' ')[:-2])
        startdatetime = datetime.strptime(startDate, '%a %b %d %Y %H:%M:%S')
        enddatetime = datetime.strptime(endDate, '%a %b %d %Y %H:%M:%S')

        # For each date between (And inclusive), print the date.
        startDate = date(startdatetime.year, startdatetime.month, startdatetime.day)
        endDate = date(enddatetime.year, enddatetime.month, enddatetime.day)
        datedelta = endDate - startDate

        # Array is for storing days between (inclusive) selected dates.
        days = []
        directories = []

        # Find all dates in range in the form YYYY-MM-DD
        for i in range(datedelta.days + 1):
            days.append(startDate + timedelta(days=i))

        # For each date in the given range, find directories with this date in the filename
        for day in days:
            commandOutput = doConsoleCommand(constants.findPicturesDirectorySearch.format(day.year, str(day.month).zfill(2), str(day.day).zfill(2)))
            commandOutputExitCode = commandOutput[0]
            print constants.findPicturesDirectorySearch.format(day.year, str(day.month).zfill(2), str(day.day).zfill(2))
            if commandOutputExitCode == 0:
                commandOutputText = commandOutput[1]
                directories.extend(commandOutputText.split('\n'))

        if not directories:
            raise IOError(constants.findPicturesNoDirectoryError)

        # For each directory, find all NEF files in it, along with their timestamps.
        for directory in directories:
            fileList = commands.getoutput('ls ' + directory).split("\n")
            for fileName in fileList:
                
                # Search for NEF files
                if '.NEF' in fileName:
                    filePathNoStatic = (directory + '/' + fileName)
                    filePath = ('/static' + filePathNoStatic)
                    thumbnailFilePath = filePath.replace('NEF', '-preview3.jpg')
                    thumbnailFilePathNoStatic = filePathNoStatic.replace('NEF', '-preview3.jpg')

                    # Get unix timestamp for file creation
                    commandOutput = doConsoleCommand(constants.findPicturesGetTimestamp.format(filePathNoStatic))
                    if commandOutput[0] == 0:
                        fullTimestampEpoch = int(time.mktime(time.localtime(int(commandOutput[1]))))
                        fullTimestampDatetime = datetime.fromtimestamp(fullTimestampEpoch)
                        
                        # If timestamp is between those dates, fetch the thumbnail and dump it to JSON
                        if startdatetime < fullTimestampDatetime < enddatetime:
                            fullTimestamp = datetime.strftime(fullTimestampDatetime, '%d-%m-%Y at %H:%M:%S %Z')

                            # Extract the thumbnail, unless it already exists
                            if doConsoleCommand(constants.findPicturesCheckThumbnail.format(directory, thumbnailFilePathNoStatic))[0] == 1:
                                commandOutput = doConsoleCommand(constants.findPicturesExtractThumbnail.format(directory, filePathNoStatic))
                                if commandOutput[0] == 127:
                                    raise OSError(constants.wrongOSError)

                            # Write to JSON: {(timestamp), (filepath)}
                            data[fullTimestamp] = thumbnailFilePath
                    else:
                        raise OSError(constants.wrongOSError)

        if not data:
            raise IOError(constants.findPicturesNoNEFError)

        return json.dumps(data, sort_keys=True)

    else:
        raise SyntaxError(constants.findPicturesInvalidDatesError)
