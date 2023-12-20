fx_version 'cerulean'
name 'FiveM TypeScript Boilerplate'
author 'Project Error'
game 'gta5'

ui_page 'ui/index.html'

files {
    'ui/index.html',
    'ui/js/app.js',
    'ui/style/*.css',
    'ui/sounds/*.mp3'
}

server_script 'dist/server/**/*.js'
client_script 'dist/client/**/*.js'
