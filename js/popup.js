$(document).ready(function () {
	if (localStorage.shortcuts == undefined) {
		localStorage.shortcuts = JSON.stringify([])
	}
	checkStatus()
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		$('#name').val(tabs[0].title)
		$('#url').val(tabs[0].url)
	})
	$(document).on('click', '#submit', function () {
		let shortcuts = JSON.parse(localStorage.shortcuts)
		shortcuts.push({
			name: $('#name').val(),
			url: $('#url').val(),
		})
		localStorage.shortcuts = JSON.stringify(shortcuts)
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { topic: 'icon' }, function (response) {
				let shortcuts = JSON.parse(localStorage.shortcuts)
				let icon = response.icon
				shortcuts[shortcuts.length - 1].icon = icon
				localStorage.shortcuts = JSON.stringify(shortcuts)
			})
		})
		checkStatus()
	})
})

function checkStatus() {
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		let shortcuts = JSON.parse(localStorage.shortcuts)
		if (shortcuts.length > 0) {
			let flag = 0
			$.each(shortcuts, function (i, val) {
				if (val.url == tabs[0].url) {
					flag = 1
				}
				if (flag == 1) {
					$('.form-action').html($('<span>').html('Added'))
				} else {
					$('.form-action').html(
						$('<button>').attr({ id: 'submit', type: 'button' }).html('Done')
					)
				}
			})
		} else {
			$('.form-action').html(
				$('<button>').attr({ id: 'submit', type: 'button' }).html('Done')
			)
		}
	})
}