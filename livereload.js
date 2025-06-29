console.log('Starting live reload')

import livereload from "livereload";

const server = livereload.createServer();
server.watch("/Users/emil.mossberg/warden/lmagri-cloud-develop/vendor/vaimo/module-lmagriculture-theme-support/view/frontend/web/js");

