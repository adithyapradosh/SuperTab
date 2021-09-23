$(document).ready(function () {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		$('#name').val(tabs[0].title)
		$('#url').val(tabs[0].url)
	})
	$('button').click(function () {
		if (!localStorage.shortcuts) {
			localStorage.shortcuts = JSON.stringify([])
		}
		let shortcuts = JSON.parse(localStorage.shortcuts)
		let flag = 0
		$.each(shortcuts, function (i, val) {
			if (val.url == $('#url').val()) flag = 1
		})
		if (flag != 1) {
			shortcuts.push({
				name: $('#name').val(),
				url: $('#url').val(),
			})
			chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
				chrome.tabs.sendMessage(tabs[0].id, { topic: 'icon' }, function (response) {
					let shortcuts = JSON.parse(localStorage.shortcuts)
					let icon = response.icon
					shortcuts[shortcuts.length - 1].icon = icon
					localStorage.shortcuts = JSON.stringify(shortcuts)
				})
			})
			localStorage.shortcuts = JSON.stringify(shortcuts)
		}
	})
})
