"""""
 * * * * * * * * * *
 * Filename:    web-server.py
 *
 * Purpose:     The web-server backend for the DFN-Analytics-Page project
 *
 * Copyright:   2017 Fireballs in the Sky, all rights reserved
 * * * * * * * * * *
"""""

import web
import analytics_controller

web.config.debug = False
urls = ('/', 'Index',
        '/findpictures', 'FindPictures')

app = web.application(urls, globals())
render = web.template.render('templates/')

"""""
* Name: Index.GET
*
* Purpose: Endpoint for finding all pictures on the HDD within the specified datetime range
*
* Params: startdate and enddate, 2 datetime objects
*
* Return: An array of filenames
*
* Notes: none
"""""
class Index:
    def GET(self):
        return render.index()

"""""
* Name: FindPictures.GET
*
* Purpose: Endpoint for finding all pictures on the HDD within the specified datetime range
*
* Params: None, but web.input fetches startdate and enddate, 2 datetime strings
*
* Return: An array of filenames
*
* Notes: none
"""""
class FindPictures:
    def GET(self):
        try:
            input = web.input()
            filepaths = analytics_controller.findPictures(input.startdate, input.enddate)
        except IOError as e:
            raise web.NotFound(e.message)
        except SyntaxError as e:
            raise web.BadRequest(e.message)
        except OSError as e:
            raise web.InternalError(e.message)

        return filepaths

# Start of execution. Set working directory here if needed.
if __name__ == '__main__':
    # os.chdir('/opt/dfn-software/web')
    app.run()
