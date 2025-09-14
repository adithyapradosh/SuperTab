$(document).ready(function () {
	if (localStorage.shortcuts == undefined) {
		localStorage.shortcuts = JSON.stringify([])
	}
	id = checkStatus()
	console.log(id)

	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		$('#name').val(tabs[0].title)
		$('#url').val(tabs[0].url)
	})
	$(document).on('click', '#submit', function () {
		chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
			chrome.tabs.sendMessage(tabs[0].id, { topic: 'iconLinks' }, function (response) {
				// grab name and url
				let shortcuts = JSON.parse(localStorage.shortcuts)
				shortcuts.push({
					name: $('#name').val(),
					url: $('#url').val(),
					shortcut_id: id,
				})
				// grab website icon
				var iconLinks = []
				if (response) iconLinks = response.iconLinks
				let size = 0
				if (iconLinks.length != 0) {
					iconLinks.forEach(function (val) {
						function getMeta(url, callback) {
							const img = new Image()
							img.src = url
							img.onload = function () {
								callback(this.width)
							}
						}
						getMeta(val, (width) => {
							if (width > size) {
								shortcuts[shortcuts.length - 1].icon = val
								localStorage.shortcuts = JSON.stringify(shortcuts)
								size = width
								checkStatus()
							}
						})
					})
				} else {
					shortcuts[shortcuts.length - 1].icon = tabs[0].favIconUrl
					localStorage.shortcuts = JSON.stringify(shortcuts)
					checkStatus()
				}
			})
		})
	})
})

function checkStatus() {
	id = String(Math.random())
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		if (tabs[0].url.slice(0, 4) == 'http') {
			let shortcuts = JSON.parse(localStorage.shortcuts)
			let flag = 0
			$.each(shortcuts, function (i, val) {
				if (val.url == tabs[0].url) {
					flag = 1
				}
			})
			if (flag == 1) {
				$('.form-action').html($('<span>').html('Added'))
			} else {
				$('.form-action').html(
					$('<button>').attr({ id: 'submit', type: 'button' }).html('Done')
				)
			}

			$.each(shortcuts, function (i, val) {
				if (val.id == id) {
					let id_flag = 0
					while (id_flag == 0) {
						id = String(Math.random())
						if (id != val.id) {
							id_flag = 1
						}
					}
				}
			})
		} else {
			$('form').css('display', 'none')
			$('.errorMsg').css('display', 'block')
		}
	})

	return id
}

/* Style */

function updateColors() {
	if (localStorage.colorPrimary) {
		document.documentElement.style.setProperty(
			'--color-primary-h',
			JSON.parse(localStorage.colorPrimary).h
		)
		document.documentElement.style.setProperty(
			'--color-primary-s',
			JSON.parse(localStorage.colorPrimary).s
		)
		document.documentElement.style.setProperty(
			'--color-primary-l',
			JSON.parse(localStorage.colorPrimary).l
		)
	}
	if (localStorage.colorAccent) {
		document.documentElement.style.setProperty(
			'--color-accent-h',
			JSON.parse(localStorage.colorAccent).h
		)
		document.documentElement.style.setProperty(
			'--color-accent-s',
			JSON.parse(localStorage.colorAccent).s
		)
		document.documentElement.style.setProperty(
			'--color-accent-l',
			JSON.parse(localStorage.colorAccent).l
		)
	}
	if (localStorage.colorBackground) {
		document.documentElement.style.setProperty(
			'--color-background-h',
			JSON.parse(localStorage.colorBackground).h
		)
		document.documentElement.style.setProperty(
			'--color-background-s',
			JSON.parse(localStorage.colorBackground).s
		)
		document.documentElement.style.setProperty(
			'--color-background-l',
			JSON.parse(localStorage.colorBackground).l
		)
	}
}
updateColors()
