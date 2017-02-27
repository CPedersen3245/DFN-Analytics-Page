import json
from datetime import datetime

def findPictures(startdate, enddate):
    error = False

    if not startdate or not enddate:
        error = True
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
            error = True
        else:
            print 'Times are all good, boss.'

    if error:
        return None
    else:
        data['All good,'] = 'boss.'
        return json.dumps(data)
