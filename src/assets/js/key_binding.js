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

Mousetrap.bind(['alt+1'], function() {
	toTab(1);
});
Mousetrap.bind(['alt+2'], function() {
	toTab(2);
});
Mousetrap.bind(['alt+3'], function() {
	toTab(3);
});
Mousetrap.bind(['alt+4'], function() {
	toTab(4);
});
Mousetrap.bind(['alt+5'], function() {
	toTab(5);
});
Mousetrap.bind(['alt+6'], function() {
	toTab(6);
});
Mousetrap.bind(['alt+7'], function() {
	toTab(7);
});
Mousetrap.bind(['alt+8'], function() {
	toTab(8);
});
Mousetrap.bind(['alt+9'], function() {
	toTab(9);
});