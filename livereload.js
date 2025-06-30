import livereload from 'livereload'

console.log('Starting live reload')

const PROJECT_PATH_JS = '/Users/emil.mossberg/warden/lmagri-cloud-develop/vendor/vaimo/module-lmagriculture-theme-support/view/frontend/web/js'
const PROJECT_PATH_CS = '/Users/emil.mossberg/warden/lmagri-cloud-develop/vendor/vaimo/module-lmagriculture-theme-support/view/frontend/web/css'

const server = livereload.createServer()
server.watch(
    [PROJECT_PATH_JS, PROJECT_PATH_CS]
)
