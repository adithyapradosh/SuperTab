document.addEventListener('DOMContentLoaded', () => {
	// // Load Shortcuts into Settings
	if (localStorage.shortcuts) {
		shortcuts = JSON.parse(localStorage.shortcuts)

		// Create Header
		$('#shortcuts-options').append(
			$('<div>').addClass('settings-form-header').html('Manage Shortcuts')
		)
		$('#shortcuts-options').append($('<form>').addClass('shortcuts-settings-form'))

		if (shortcuts.length != 0) {
			shortcuts.forEach((shortcut) => {
				fetch(chrome.runtime.getURL('html/shortcuts-settings-dom.html'))
					.then((response) => response.text())
					.then((html) => {
						$snippet = $(html)
						$snippet.attr('setting_id', shortcut.shortcut_id)
						$snippet.find('.field.name input').val(shortcut.name)
						$snippet.find('.field.url input').val(shortcut.url)
						$snippet.find('.settings-shortcut-img img').attr('src', shortcut.icon)

						$('.shortcuts-settings-form').append($snippet)
					})
					.catch((err) => console.error('Failed to load snippet:', err))
			})
		}
	}

	// Update Shortcuts on settings change
	$(document).on('input', '.setting input[type="text"]', function () {
		const id = $(this).closest('.setting').attr('setting_id')
		$(this).closest('.setting').find('.update-button').css('display', 'flex')
	})

	$(document).on('click', '.setting .delete-button', function () {
		let id = $(this).closest('.setting').attr('setting_id')
		$('[shortcut_id="' + id + '"]').remove()
		$(this).closest('.setting').css('display', 'none')
		updateShortcuts()
	})

	$(document).on('click', '.setting .update-button', function () {
		let id = $(this).closest('.setting').attr('setting_id')
		let name = $(this).closest('.setting').find('.name input').val()
		let url = $(this).closest('.setting').find('.url input').val()
		$('[shortcut_id="' + id + '"]').attr('name', name)
		$('[shortcut_id="' + id + '"] .label').html(name)
		$('[shortcut_id="' + id + '"]').attr('href', url)

		updateShortcuts()

		$(this).css('display', 'none')
		$('.shortcut-update-alert').stop(true, true).fadeIn(0).delay(2000).fadeOut(400)
	})
})
