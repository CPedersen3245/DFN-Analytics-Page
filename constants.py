"""""
 * * * * * * * * * *
 * Filename:    constants.py
 *
 * Purpose:     A list of strings to serve analytics_controller.py for the
 *              DFN-Analytics-Page project.
 *
 * Copyright:   2017 Fireballs in the Sky, all rights reserved
 *
 * * * * * * * * * *
"""""

# Console Commands
findPicturesDirectorySearch = "find /data[0-3] -type d -name '*{0}-{1}-{2}*' | grep -v 'test\|video'"
findPicturesGetTimestamp = "find {0} -exec stat -c%Y {{}} \;"
findPicturesCheckThumbnail = "find {0} -name '{1}'"
findPicturesExtractThumbnail = 'exiv2 -ep3 -l {0} {1}'

# Error Messages
findPicturesNoDirectoryError = 'ERROR: No pictures taken in this range.'
findPicturesNoNEFError = 'ERROR: No .NEFs found in this range.'
findPicturesInvalidDatesError = 'ERROR: Dates invalid. Please try again.'

wrongOSError = 'ERROR: Running in non-debian OS.'
