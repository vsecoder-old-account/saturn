const Mousetrap = require('mousetrap');


Mousetrap.bind(['command+t', 'ctrl+t', 'command+n', 'ctrl+n'], function() {
	newTab('https://google.com');
});
Mousetrap.bind(['command+w', 'ctrl+w'], function() {
	closeCurrentTab(currentTab);
});
Mousetrap.bind(['command+shift+i', 'ctrl+shift+i', 'command+shift+j', 'ctrl+shift+j'], function() {
	openDevTools();
});
Mousetrap.bind(['command+r', 'ctrl+r'], function() {
	reloadCurrentTab();
});