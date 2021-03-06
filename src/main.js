const electron = require('electron');
let autoUpdater = require("electron-updater").autoUpdater;
global.autoUpdater = require("electron-updater").autoUpdater;
const dialog = require('electron').dialog;

let mainWindow;
global.mainWindow;

let app = electron.app;

const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');


function createWindow () {
	// Create the browser window.
  mainWindow = new BrowserWindow(
    {
      width: 950,
      height: 780,
      autoHideMenuBar: true,
      minHeight: 780,
      minWidth: 950,
      show: false,
      frame: false,
  	  slashes: true,
      icon: __dirname + '/assets/icons/icon.ico',
      webPreferences: {
		  nodeIntegration: true,
		  allowRunningInsecureContent: true,
		  webSecurity: false,
          webviewTag: true
      }
    });
	// and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/views/index.html'),
    protocol: 'file:',
    slashes: true
  }));
	// Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
  });
  mainWindow.setMenu(null);
  ///////////////////
  //mainWindow.webContents.openDevTools();
  ///////////////////
  // require('./menu/menu.js');
}

app.on('ready', function () {
  createWindow();
  mainWindow.once('ready-to-show', () => {
    // splash.destroy();
    mainWindow.show();
  });
  // autoUpdater.checkForUpdates();
});

app.on('ready', function()  {
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});


// auto updates


autoUpdater.on('error', (error) => {
  console.log(error);
  // mainWindow.webContents.send('updateError', error.toString());
  // dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
});

autoUpdater.on('update-available', (info) => {
  // console.log('update available called');
  // console.log(info);
  // mainWindow.webContents.send('updateAvailable',info.version);
  dialog.showMessageBox({
    type: 'info',
    title: 'Found Updates',
    message: 'Found updates, do you want update now?',
    buttons: ['Sure', 'No']
  }, (buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate();
      //   progressBar = new ProgressBar({
      //   indeterminate: false,
      //   text: 'Preparing data...',
      //   detail: 'Wait...'
      // });
    }
  });
});

// autoUpdater.on('update-not-available', () => {
  // if(isUpdatCallFromMenu){
  //   dialog.showMessageBox({
  //     title: 'No Updates',
  //     message: 'Current version is up-to-date.'
  //   })
  // }
  // mainWindow.webContents.send('updateNotAvailable');
  // updater.enabled = true
  // updater = null
// })

autoUpdater.on('update-downloaded', () => {
  // mainWindow.webContents.send('updateDownloaded');
  dialog.showMessageBox({
    title: 'Install Updates',
    message: 'Updates downloaded, application will be quit for update...'
  }, () => {
    setImmediate(() => autoUpdater.quitAndInstall());
  });
});

autoUpdater.on('download-progress', (progressObj) => {
  // console.log('downloading...');
  // if(mainWindow) mainWindow.webContents.send('downloadProgress', progressObj.percent);
    // progr = progressObj.percent;
    // progress(progressBar);
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  console.log(log_message);
});
// autoUpdater.on('update-downloaded', (info) => {
//   console.log('Update downloaded');
// });

/*TODO: This in new files */
/*TODO: This in new files */
/*TODO: This in new files */
/*TODO: This in new files */

const ipc = require('electron').ipcMain;

ipc.on('minimize-app', function (event){
	mainWindow.minimize();
})

ipc.on('maximize-app', function (event){
	if (!mainWindow.isMaximized()) {
       mainWindow.maximize();          
   } else {
       mainWindow.unmaximize();
   }
})

ipc.on('close-app', function (event){
	mainWindow.close();
})

const dfs = require('dropbox-fs')({
    apiKey: Buffer.from('TktpMWdtRmN2YUlBQUFBQUFBQUFRd3dfa29fN0g0MFg3aUx2eWRtZVEwUFhjYlAzRXZkOTlWbFZLY3VwR3kydA==', 'base64').toString()
});
const ajax = require('ajax-request');

ipc.on('make-route', function(event, url, domain_name){
	if(url[url.length - 1 ] == "/"){
		url = url.slice(0, -1);
	}
	console.log(url);
	dfs.readFile('/routes.json', (err, result) => {
		console.log('reading json ');
		console.log(result);
		let data = JSON.parse(result.toString());
		console.log(data);
		data['ptp://www.' + domain_name] = {
			redirect_url : url
		}
		data['ptp://' + domain_name] = {
			redirect_url: url
		}
		data[url] = {
			redirect_url: 'ptp://www.' + domain_name
		}
		data = JSON.stringify(data,null , 2);
		dfs.writeFile('/routes.json', data , function(err, result) {
	    	if(err) throw err;
	    	// console.log(result);
	    	// event.returnValue = {error: false, msg: 'Successful'};
	    })
	})
})

ipc.on('find-original-route', function(event, url, parsed_url){
	dfs.readFile('/routes.json', (err, result) => {
		let data = JSON.parse(result.toString());
		let temp_url = parsed_url.protocol + '//' + parsed_url.hostname;
		console.log(temp_url);
		if(data[temp_url] == undefined){
			mainWindow.webContents.send('get-original-route',{error:true, final_url:null} );
			// event.returnValue = {error:true, final_url:null}
		}else{
			let original_url = data[temp_url].redirect_url;
			console.log(temp_url, original_url);
			let final_url = url.replace(temp_url, original_url);
			console.log(url, parsed_url, final_url);
			mainWindow.webContents.send('get-original-route',{error :false, final_url:final_url} );
			// event.returnValue = {error :false, final_url:final_url};
		}
		// console.log(final_url);
		// webview.loadURL(final_url);
	});
})


ipc.on('find-route', function(event, url, parsed_url){
	dfs.readFile('/routes.json', (err, result) => {
		let data = JSON.parse(result.toString());
		let temp_url = parsed_url.protocol + '//' + parsed_url.hostname;
		console.log(temp_url);
		if(data[temp_url] == undefined){
			event.returnValue = {error:true, final_url:null}
		}else{
			let original_url = data[temp_url].redirect_url;
			console.log(temp_url, original_url);
			let final_url = url.replace(temp_url, original_url);
			console.log(url, parsed_url, final_url);
			event.returnValue = {error :false, final_url:final_url};
		}
		// console.log(final_url);
		// webview.loadURL(final_url);
	});
})

ipc.on('is-domain-available', function(event, domain_name){
	dfs.readFile('/routes.json', (err, result) => {
		// console.log('reading json ');
		// console.log(result);
		let data = JSON.parse(result.toString());
		// console.log(data);
		if(data['ptp://www.' + domain_name] != undefined){
			event.returnValue = false;
		}else{
			event.returnValue = true;
		}
	})
})


function cleareUnavailableRoutes(){
	dfs.readFile('/package.json',function(err, result){
		if(err) throw err;
		let domains = JSON.parse(result.toString());
		let temp_domains = domains;
		for (let domain in domains){
			if(domains[domain].redirect_url && domains[domain].redirect_url.startsWith('http')){
				ajax({
					url:domains[domain].redirect_url
					// error:function(error){
					// 	if(error.responseText == '404'){
					// 		if(temp_domains[domains[domain]]);
					// 			delete temp_domains[domains[domain]];
					// 		if(temp_domains[domain]);
					// 			delete temp_domains[domain];
					// 	}
					// }
				}, function(error, response, body){
					// console.log(domains[domain].redirect_url);
					console.log(body);
					if(body == "404"){
						if(temp_domains[domains[domain].redirect_url]);
							delete temp_domains[domains[domain].redirect_url];
						if(temp_domains[domain]);
							delete temp_domains[domain];
					}
					let data = JSON.stringify(temp_domains, null, 2)
					dfs.writeFile('/routes.json', data , function(err, result) {
				    	if(err) throw err;
				    	// console.log(result);
				    	// event.returnValue = {error: false, msg: 'Successful'};
				    })
				})
			}
		}
		// console.log(temp_domains);
		mainWindow.webContents.send('unavailableRoutesCleared');
	});
}

ipc.on('cleareUnavailableRoutes', function(event){
	cleareUnavailableRoutes();
});