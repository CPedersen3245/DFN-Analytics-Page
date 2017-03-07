import web
import analytics_controller

web.config.debug = False
urls = ('/', 'Index',
        '/findpictures', 'FindPictures')

app = web.application(urls, globals())
render = web.template.render('templates/')

# Renders the page when the user gets the index.
class Index:
    def GET(self):
        return render.index()

# Endpoint for when the user selects a start and end date for the gallery.
# Determines if the datetimes are valid, then finds all filepaths on the system of
# images that fall under the date/time restrictions
class FindPictures:
    def GET(self):
        input = web.input()
        filepaths = analytics_controller.findPictures(input.startdate, input.enddate)
        if filepaths is None:
            raise web.badrequest("ERROR: Dates invalid. Please try again.")
        else:
            return filepaths

# Start of execution. Set working directory here if needed.
if __name__ == '__main__':
    # os.chdir('/opt/dfn-software/web')
    app.run()
