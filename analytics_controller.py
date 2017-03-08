import json
from datetime import datetime

#
# Name: datetimeSanityCheck
#
# Purpose: Sanity checks an input datetime range
#
# Params: startdate and enddate, 2 datetime objects
#
# Return: A boolean, true if input is sane and false if invalid
#
# Notes: none
#
def datetimeSanityCheck(startdate, enddate):
    sane = True

    if not startdate or not enddate:
        sane = False
    else:
        data = {}
        now = datetime.now()

        # First, strip the timezone away and make a datetime object
        startdate = ' '.join(startdate.split(' ')[:-2])
        enddate = ' '.join(enddate.split(' ')[:-2])

        startdatetime = datetime.strptime(startdate, '%a %b %d %Y %H:%M:%S')
        enddatetime = datetime.strptime(enddate, '%a %b %d %Y %H:%M:%S')

        #If dates are wrong way around, or either date is in the future:
        if (startdatetime >= enddatetime) or (startdatetime > now) or (enddatetime > now):
            sane = False
        else:
            print 'Times are all good, boss.'

        return sane

#
# Name: findPictures
#
# Purpose: Finds all pictures on the HDD within the specified datetime range
#
# Params: startdate and enddate, 2 datetime objects
#
# Return: An array of filenames
#
# Notes: none
#
def findPictures(startdate, enddate):
    data = {}
    if datetimeSanityCheck(startdate, enddate):
        data['All good,'] = 'boss.'
        return json.dumps(data)
    else:
        return None
