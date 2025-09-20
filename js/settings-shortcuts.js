document.addEventListener('DOMContentLoaded', () => {
	/* Load Shortcuts into Settings */
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
						$snippet.attr('data-setting-id', shortcut.shortcutId)
						$snippet.find('.field.name input').val(shortcut.name)
						$snippet.find('.field.url input').val(shortcut.url)
						$snippet.find('.settings-shortcut-img img').attr('src', shortcut.icon)

						$('.shortcuts-settings-form').append($snippet)
					})
					.catch((err) => console.error('Failed to load snippet:', err))
			})
		}
	}

	/* Update Shortcuts on settings change */

	// Display update button on input change
	$(document).on('input', '.setting input[type="text"]', function () {
		$(this).closest('.setting').find('.update-button').css('display', 'flex')
	})

	// Display shortcut image edit button
	$(document).on('mouseenter', '.settings-shortcut-img', function () {
		$(this).find('.upload-shortcut-img-button').show()
	})

	$(document).on('mouseleave', '.settings-shortcut-img', function () {
		$(this).find('.upload-shortcut-img-button').hide()
	})

	// Edit shortcut image
	$(document).on('click', '.upload-shortcut-img-button', function () {
		$(this).closest('.setting').find('.input-shortcut-image').click()
	})

	$(document).on('change', '.input-shortcut-image', function () {
		let inputElement = this
		if (this.files && this.files[0]) {
			var img = document.createElement('img')
			img.src = URL.createObjectURL(this.files[0])
			img.onload = function () {
				var canvas = document.createElement('canvas')
				var context = canvas.getContext('2d')
				canvas.height = this.naturalHeight
				canvas.width = this.naturalWidth
				context.drawImage(this, 0, 0)
				var url = canvas.toDataURL('image/jpeg')
				$(inputElement)
					.closest('.setting')
					.find('.settings-shortcut-img img')
					.attr('src', url)
			}
			this.value = ''
		}
		$(this).closest('.setting').find('.update-button').css('display', 'flex')
	})

	// Remove shortcut on clicking delete button
	$(document).on('click', '.setting .delete-button', function () {
		let id = $(this).closest('.setting').data('setting-id')
		$('[data-shortcut-id="' + id + '"]').remove()
		$(this).closest('.setting').css('display', 'none')
		updateShortcuts()
	})

	// Update shortcut on clicking update button
	$(document).on('click', '.setting .update-button', function () {
		let id = $(this).closest('.setting').data('setting-id')
		let name = $(this).closest('.setting').find('.name input').val()
		let url = $(this).closest('.setting').find('.url input').val()
		let imgSrc = $(this).closest('.setting').find('.settings-shortcut-img img').attr('src')
		$('[data-shortcut-id="' + id + '"]').attr('name', name)
		$('[data-shortcut-id="' + id + '"]').attr('href', url)
		$('[data-shortcut-id="' + id + '"]')
			.children()
			.attr('src', imgSrc)
		$('[data-shortcut-id="' + id + '"] .label').html(name)

		updateShortcuts()

		$(this).css('display', 'none')
		$('.shortcut-update-alert').stop(true, true).fadeIn(0).delay(2000).fadeOut(400)
	})
})
