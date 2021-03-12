//import { ElectronBlocker } from '@cliqz/adblocker-electron';

const ipc = require('electron').ipcRenderer;
const path = require('path');
const url_module = require('url');
const fs = require("fs");
//const session = require('electron');
//const blocker = ElectronBlocker.parse(fs.readFileSync('src/assets/js/easylist.txt', 'utf-8'));
//blocker.enableBlockingInSession(session.defaultSession);

var app = require('http').createServer();
let history = localStorage.getItem('historyall');

if (history == null) {
	localStorage.setItem('historyall', '');
	history = localStorage.getItem('historyall');
}

// error_page = require('./error_page.js');

let totalOpenedTab = 0;

// require('./key_binding.js');

let webview;
let newTabCount = 0
let tabs = {}, currentTab;
global.currentTab;


// function getUrl(){
// 	console.log(webview.getURL());
// }

function opentab(tab){
	currentTab = tabs[$(tab).data('tab_id')];
	console.log(currentTab);
	if(currentTab)
		webview = document.getElementById(currentTab.webview_id);
}

function newTab(url, a){
	console.log(url);
	newTabCount++;
	totalOpenedTab++;
	$('<li id = "tab' + newTabCount + '" class = "nav-tab" onclick = "opentab(this)" data-tab_id = "tab' + newTabCount + '"><a href=""  role="tab" data-toggle="tab" data-target = "#tab_content' + newTabCount + '"><div class = "inline"><img class = "hide" id = "tab_loading' + newTabCount + '" src = "../assets/img/loading.gif" width = 15></img><img width=15 id = "tab_favicon'+ newTabCount +'"></img></div>&nbsp;<div class = "inline tab-title-bar"><h id = "tab_click' + newTabCount + '"  data-tab_id = "tab' + newTabCount + '">New Tab</h></div>&nbsp;&nbsp;&nbsp;&nbsp;<span onclick = "closeAnyTab(this)" class="close black" data-tab_id = "tab' + newTabCount + '" id="cls' + newTabCount + '"> ✖</span></a></li>').insertBefore('#new-tab-button');
	$('#browsers').append('<div class="tab-pane" id = "tab_content' + newTabCount + '">\
						<div class = "url-bar-header">\
							<div class = "url-bar-buttons">\
							<button class="button url-bar-button" onclick = "backCurrentTab()"><span class="mif-arrow-left"></span></button>\
							<button class="button url-bar-button" onclick = "forwardCurrentTab()"><span class="mif-arrow-right"></span></button>\
							<button class="button url-bar-button" onclick = "reloadCurrentTab()"><i class="fas fa-redo-alt"></i></button>\
							</div>\
							<div class="url-bar-container">\
								<input contenteditable id = "url_bar' + newTabCount + '" autofocus class = "url-bar" placeholder="Введите url или строку для поиска">\
							</div>\
							<img src="../assets/img/abp-128.png" style="width: 20px">\
							<div class = "inline url-bar-menu-button">\
								<button class = "button url-bar-button menu-button" data-container="body" data-toggle="popover" data-placement="bottom" data-html = "true" id = "menu"><span class="mif-menu mif-2x"></span></button>\
							</div>\
						</div>\
						<webview id="webview' + newTabCount + '" src="' + url + '" class="webview" webpreferences="javascript=yes, webviewtag=true" allowpopups disablewebsecurity plugins preload="../assets/js/preload.js"></webview>\
					</div>');

	tabs['tab' + newTabCount] = {
		id: newTabCount,
		favicon_id: 'tab_favicon' + newTabCount,
		tab_loading_id: 'tab_loading' + newTabCount,
		tab_id: 'tab' + newTabCount,
		url_bar_id: 'url_bar' + newTabCount,
		tab_click_id: 'tab_click' + newTabCount,
		tab_content_id: 'tab_content' + newTabCount,
		webview_id: 'webview' + newTabCount,
		url
	};
	initListeners(tabs['tab' + newTabCount], a);
	$('#' + tabs['tab' + newTabCount].tab_click_id).click();
	initPopover();
	decreaseTabSize();
	document.querySelector('#' + 'url_bar' + newTabCount).focus();
	webview.addEventListener('new-window', (e, contents) => {
		const protocol = (new URL(e.url)).protocol
		if (protocol === 'http:' || protocol === 'https:') {
			newTab(e.url, false);
		}
	});
	webview.addEventListener('found-in-page', function (e) {
		console.log('Find');
	});
	webview.addEventListener('media-started-playing', function (e) {
		console.log('🔊');
		//$('#' + 'cls' + newTabCount).text(webview.getTitle() + '🔊 ✖');
		document.querySelector('#' + 'cls' + newTabCount).innerHTML = '🔊 ✖';
		//🔈 🔇 🔊
	});
	webview.addEventListener('media-paused', function (e) {
		console.log('🔈');
		//$('#' + 'cls' + newTabCount).text(webview.getTitle() + '🔈 ✖');
		document.querySelector('#' + 'cls' + newTabCount).innerHTML = '🔈 ✖';
	});
}


function decreaseTabSize(){
	$('.nav-tab').css('width', `calc(95% / ${totalOpenedTab})`);
	let width = $('.nav-tab').css('width');
	// console.log(width);
	$('.tab-title-bar').css('width', `calc(${width} - 80px)`);
}


function increaseTabSize(){
	$('.nav-tab').css('width', `calc(95% / ${totalOpenedTab})`);
	let width = $('.nav-tab').css('width');
	$('.tab-title-bar').css('width', `calc(${width} - 80px)`);
}

let theme = localStorage.getItem('theme');
let page = localStorage.getItem('page');

let nn = 0;

if (theme == null) {
	localStorage.setItem('theme', 'white');
} else if (theme == 'black') {
	let link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = "../assets/css/black.css";
	link.id = 'blacktheme';
	document.head.append(link);
	nn = 1;
} else {
	///
}

let u = '';
if (page == null) {
	localStorage.setItem('page', 'google');
	u = 'https://google.com';
	newTab('https://google.com', true);
} else {
	let pag = localStorage.getItem('page');
	if (pag == 'yandex') {
		u = 'https://yandex.ru';
		newTab('https://yandex.ru', true);
	} else if (pag == 'ya') {
		u = 'https://ya.ru';
		newTab('https://ya.ru', true);
	} else if (pag == 'duck') {
		u = 'https://duckduckgo.com';
		newTab('https://duckduckgo.com', true);
	} else {
		u = 'https://google.com';
		newTab('https://google.com', true);
	}
}

function checkTheme() {
	if (localStorage.getItem('theme') == null) {
		localStorage.setItem('theme', 'white');
		if (nn == 1) {
			document.querySelector('#blacktheme').remove();
		}
		nn = 0;
	} else if (localStorage.getItem('theme') == 'black' && nn == 0) {
		let link = document.createElement('link');
		link.rel = 'stylesheet';
		link.href = "../assets/css/black.css";
		link.id = 'blacktheme';
		document.head.append(link);
		nn = 1;
	} else if (localStorage.getItem('theme') == 'white' && nn == 1) {
		if (nn == 1) {
			document.querySelector('#blacktheme').remove();
		}
		nn = 0;
	}
	setTimeout(checkTheme, 3000);
}
checkTheme();

$('#tab_click1').click();

function newT() {
	newTab(u);
}

function findNextTab(deleted_tab_count){
    for(let i = deleted_tab_count + 1; i <= newTabCount; i++){
        let key = 'tab' + i;
        if(tabs.hasOwnProperty(key)) return i;
    }
    for(let i = deleted_tab_count - 1; i > 0; i--){
        let key = 'tab' + i;
        if(tabs.hasOwnProperty(key)) return i;
    }
    return undefined;
}

function closeCurrentTab(tab){
	totalOpenedTab--;
	// console.log(tab);
	let next_tab_count = findNextTab(tab.id);
	if(next_tab_count != undefined){
		$('#' + tab.tab_id).remove();
		$('#' + tab.tab_content_id).remove();
		delete tabs[tab.tab_id];
		currentTab = tabs['tab' + next_tab_count];
		$('#' + currentTab.tab_click_id).click();
	}else{
		ipc.send('close-app');
	}

	increaseTabSize();
}


function closeAnyTab(tab){
	closeCurrentTab(tabs[$(tab).data('tab_id')]);
}


function openURL(url){
    currentTab.url = url;

	let temp = url_module.parse(url);
	console.log(temp.protocol);
	if (temp.protocol == null || temp.protocol == "localhost:") {
		url = 'http://' + url;
		webview.loadURL(url);
		localStorage.setItem('historyall', history + ' || ' + webview.getURL() + ' ! ' + webview.getTitle());
		history = localStorage.getItem('historyall');
	}
	if (temp.protocol == "saturn:") {
		if (temp.href == "saturn://about") {
			webview.loadURL(`file://${path.join(__dirname, '..', 'views', 'about.html')}`);
			$('#' + currentTab.url_bar_id).val(webview.getURL());
		} else if (temp.href == "saturn://game") {
			webview.loadURL(`file://${path.join(__dirname, '..', 'views', 'run.html')}`);
			$('#' + currentTab.url_bar_id).val(webview.getURL());
		} else if (temp.href == "saturn://history") {
			webview.loadURL(`file://${path.join(__dirname, '..', 'views', 'history.html')}`);
			$('#' + currentTab.url_bar_id).val(webview.getURL());
		} else {
			webview.loadURL(`file://${path.join(__dirname, '..', 'views', 'settings.html')}`);
			$('#' + currentTab.url_bar_id).val(webview.getURL());
		}
	} else if (temp.protocol == 'file:') {
		$('#' + currentTab.url_bar_id).val(path.join(url));
		webview.loadURL(`file://${path.join(url)}`);
		localStorage.setItem('historyall', history + ' || ' + webview.getURL() + ' ! ' + webview.getTitle());
		history = localStorage.getItem('historyall');
	} else if(temp.protocol == 'https:'){
		console.log(url);
		$('#' + currentTab.url_bar_id).val(url);
		webview.loadURL(url);
		localStorage.setItem('historyall', history + ' || ' + webview.getURL() + ' ! ' + webview.getTitle());
		history = localStorage.getItem('historyall');
	} else if(temp.protocol != 'http:' && temp.protocol != "localhost:" && temp.protocol != 'https:' && temp.protocol != 'https:' && temp.protocol != null && temp.protocol != 'file:'){
		let generated_error_page = error_page({errorCode:-501, validatedURL:url});
			webview.executeJavaScript(`document.body.innerHTML = '';document.write('${generated_error_page}')`);
	} else {
		var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
		var regex = new RegExp(expression);
		if (url.match(regex)) {
		  $('#' + currentTab.url_bar_id).val(url);
		  webview.loadURL(url);
		  localStorage.setItem('historyall', history + ' || ' + webview.getURL() + ' ! ' + webview.getTitle());
		  history = localStorage.getItem('historyall');
		} else {
		  var search = url.replace(/http:\/\//g, '')
		  search = search.replace(/https:\/\//g, '')
		  $('#' + currentTab.url_bar_id).val(u + '/?q=' + search);
		  webview.loadURL(u + '/?q=' + search);
		  localStorage.setItem('historyall', history + webview.getTitle() + ' ! ' + webview.getURL() + ' || ');
		  history = localStorage.getItem('historyall');
		}
	}
}


// capture enter pressed at url bar


$('body').on('keypress', '.url-bar', function(e){
	// console.log('Hello')
	// return e.which != 13;
	if(e.which == 13){
		// console.log($('#' + currentTab.url_bar_id).val());
		let url = $('#' + currentTab.url_bar_id).val();
		console.log(url);
		openURL(url);
		return false;
	}else{
		// return true;
		console.log("don't know what happened");
	}
});


function minimize_app(){
	ipc.send('minimize-app');
}

function maximize_app(){
	ipc.send('maximize-app');
}
function close_app(){
	ipc.send('close-app');
}

function backCurrentTab(){
	webview.goBack();
}
function forwardCurrentTab(){
	webview.goForward();
}
function reloadCurrentTab(){
	// openURL($('#' + currentTab.url_bar_id).val().toLowerCase());
	webview.reload();
}

function updateUrlBar(tab, a){
	// console.log('loading');
	let temp_webview = document.getElementById(tab.webview_id);
	let url = url_module.parse(temp_webview.getURL(), true);
	let temp_url = temp_webview.getURL();

	// handeling about page, need to fix in future

	if(url.protocol == "file:" && path.basename(temp_url) == "about.html"){
		$('#' + currentTab.url_bar_id).val('saturn://about');
		return;
	}

	if(url.protocol == "file:" && path.basename(temp_url) == "run.html"){
		$('#' + currentTab.url_bar_id).val('saturn://game');
		return;
	}

	if(url.protocol == "file:" && path.basename(temp_url) == "history.html"){
		$('#' + currentTab.url_bar_id).val('saturn://history');
		return;
	}

	if(url.protocol == "file:" && path.basename(temp_url) == "settings.html"){
		$('#' + currentTab.url_bar_id).val('saturn://settings');
		return;
	}

		console.log(temp_url);
	if(url.query.error == undefined){
		ipc.send('find-original-route', temp_url, url);
	}
	if (a == false) {
		$('#' + currentTab.url_bar_id).val(webview.getURL());
	} else {
		//
	}
	
}

webview.addEventListener("context-menu", (event) => {
	var x = event.params.x;
	var y = event.params.y;
	var menu = document.querySelector('.menu');
	function showMenu(x, y){
		menu.style.left = x + 'px';
		menu.style.top = y + 'px';
		menu.classList.add('show-menu');
	}
	function hideMenu(){
		menu.classList.remove('show-menu');
	}
	function onContextMenu(e){
		e.preventDefault();
		showMenu(event.params.x, event.params.y);
		document.addEventListener('mousedown', onMouseDown, false);
	}
	function onMouseDown(e){
		hideMenu();
		document.removeEventListener('mousedown', onMouseDown);
	}
	onContextMenu(event);
})

function showMenu(x, y){
	menu.style.left = x + 'px';
	menu.style.top = y + 'px';
	menu.classList.add('show-menu');
}
function hideMenu(){
	menu.classList.remove('show-menu');
}
function onContextMenu(e){
	e.preventDefault();
	showMenu(e.params.x, e.params.y);
	document.addEventListener('mousedown', onMouseDown, false);
}
function onMouseDown(e){
	hideMenu();
	document.removeEventListener('mousedown', onMouseDown);
}

ipc.on("context-menu", (event) => {
	var x = event.params.x;
	var y = event.params.y;
	var menu = document.querySelector('.menu');
	onContextMenu(event);
	setTimeout(() => menu.classList.remove('show-menu'), 3000);
})

ipc.on('get-original-route', function (event, final_url) {
	if (final_url.final_url == 'ptp://www.pee.com/') {final_url.final_url = 'https://www.google.com/'}
	if(final_url.error){
		// console.log(webview.getURL());
		let temp_url = url_module.parse(webview.getURL(), true);
		console.log(temp_url + ' | ' + final_url);
		if(temp_url.query){
			if(temp_url.query.error != "true" && !temp_url.query.errorDesc){
				// console.log('asfasfasdf');
				// console.log(temp_url.query.error);
				// $('#' + currentTab.url_bar_id).html(`<span style = "color:green">${temp_url.protocol}</span>${webview.getURL().replace(temp_url.protocol, '')}`);

				$('#' + currentTab.url_bar_id).val(webview.getURL());
				// $('#' + currentTab.url_bar_id).attr('data-prepend',temp_url.protocol);
			}
		} else {
			$('#' + currentTab.url_bar_id).val(webview.getURL());
			// $('#' + currentTab.url_bar_id).attr('data-prepend',temp_url.protocol);
		}
	}else{
		$('#' + currentTab.url_bar_id).val(final_url.final_url);
		// $('#' + currentTab.url_bar_id).attr('data-prepend',temp_url.protocol);
	}
})

function initListeners(tab, a){
	let temp_webview = document.getElementById(tab.webview_id);
	temp_webview.addEventListener('did-finish-load', function(){
	// temp_webview.openDevTools();
		// $('#' + tab.url_bar_id).val(temp_webview.getURL());
    	console.log(tab, 'tab_url')
		updateUrlBar(tab, a);
		$('#' + tab.tab_click_id).text(webview.getTitle());
	});

	temp_webview.addEventListener('did-fail-load', function(error){
		let generated_error_page = error_page(error);
		temp_webview.executeJavaScript(`document.body.innerHTML = '';document.write('${generated_error_page}')`);
		// console.log(error);
		// temp_webview.loadURL(path.join('file://', __dirname, '..', 'views','error.html?errorDesc=' + error + '&error=true'));
	});

	temp_webview.addEventListener('page-favicon-updated', function(favicon){
		$('#' + tab.favicon_id).attr('src',favicon.favicons[0]);
		// console.log(favicon);
	});

	temp_webview.addEventListener('did-start-loading', function(){
		$('#' + tab.favicon_id).addClass('hide');
		// $('#' + tab.tab_loading_id).addClass('show');
		$('#' + tab.tab_loading_id).removeClass('hide');
	});
	temp_webview.addEventListener('did-stop-loading', function(){
		$('#' + tab.tab_loading_id).addClass('hide');
		// $('#' + tab.tab_loading_id).removeClass('show');
		$('#' + tab.favicon_id).removeClass('hide');
		// $('#' + tab.favicon_id).removeClass('');
	})
}

$('body').on('click', '.menu-button', function(e){
	initPopover();
});

function initPopover(){
	$("[data-toggle=popover]").each(function(i, obj) {
		$(this).popover({
		  html: true,
		  content: function() {
		  	// console.log(this);
		    var id = $(this).attr('id')
		    return $('#popover-content-' + id).html();
		  }
		});
	});
}

// clear error messages on click domain field

$('body').on('click', '.search_field', function(){
	// console.log('Hello')
	//$($('.search-error')[1]).html('');
})


// make popovers hide, when click outside

$('body').on('click', function (e) {
	// console.log('Hello');
    $('[data-toggle=popover]').each(function () {
        // hide any open popovers when the anywhere else in the body is clicked
        if (!$(this).is(e.target) && $(this).has(e.target).length === 0 && $('.popover').has(e.target).length === 0) {
            $(this).popover('hide');
        }
    });
});

console.log("Vsevolod");
// open dev tools
function openDevTools(){
	webview.openDevTools();
}

ipc.send('cleareUnavailableRoutes');

ipc.on('unavailableRoutesCleared', function(event){
	console.log('routes cleared');
})

ipc.on("webview-context-link", (event, data) => {
	newTab(url, false);
	localStorage.setItem('historyall', history + webview.getTitle() + ' ! ' + url + ' || ');
	history = localStorage.getItem('historyall');
});

function openAbout(){
	console.log('open about');
	console.log(`file://${path.join(__dirname, '..', 'views', 'about.html')}`);
	newTab(`file://${path.join(__dirname, '..', 'views', 'about.html')}`, false);
}

function openGame(){
	console.log('open game');
	console.log(`file://${path.join(__dirname, '..', 'views', 'run.html')}`);
	newTab(`file://${path.join(__dirname, '..', 'views', 'run.html')}`, false);
}
function openSettings(){
	console.log('open settings');
	console.log(`file://${path.join(__dirname, '..', 'views', 'settings.html')}`);
	newTab(`file://${path.join(__dirname, '..', 'views', 'settings.html')}`, false);
}
function openHistory() {
	console.log('open game');
	console.log(`file://${path.join(__dirname, '..', 'views', 'history.html')}`);
	newTab(`file://${path.join(__dirname, '..', 'views', 'history.html')}`, false);
}
/////////////////////////
let finderText = '';
function findText(text) {
	text = searchText[1].value
	console.log(text)
	if (finderText == text) {
		webview.findInPage(text, [false, true]);
	} else {
		webview.findInPage(text);
	}
	finderText = text;
	//webview.stopFindInPage();
}
function stopFind() {
	webview.stopFindInPage('clearSelection');
}
function toTab(num) {
	if (num <= totalOpenedTab && num != 9) {
		$('#tab_click' + num).click()
	} else {
		$('#tab_click' + totalOpenedTab).click()
	}
}