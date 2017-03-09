# Console Commands
findPicturesDirectorySearch = "find /data[0-3] -type d -name '*{0}-{1}-{2}*' | grep -v 'test\|video'"
findPicturesGetTimestamp = "find {0} -exec stat -c%Y {} \;"
findPicturesCheckThumbnail = "find {0} -name '{1}'"
findPicturesExtractThumbnail = 'exiv2 -ep3 -l {0} {1}'

# Error Messages
findPicturesNoDirectoryError = 'ERROR: No directories found between the specified range.'
findPicturesNoNEFError = 'ERROR: Interval control ran for this range, but no .NEF files were found.'
findPicturesInvalidDatesError = 'ERROR: Dates invalid. Please try again.'

wrongOSError = 'ERROR: Running in non-debian OS.'
