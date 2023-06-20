chrome.runtime.onMessage.addListener(function (request, sender, response) {
	//grab website icon
	if (request.topic == 'icon') {
		var icon
		var links = $('link[rel*="icon"]')
		$.each(links, function (i, val) {
			if (val.sizes.value.indexOf('144') != -1) {
				icon = val.href
				return false
			} else if (val.sizes.value.indexOf('96') != -1) {
				icon = val.href
				return false
			} else if (val.sizes.value.indexOf('48') != -1) {
				icon = val.href
				return false
			}
		})
		if (icon) {
			response({ icon: icon })
		} else {
			icon = window.location.href + 'favicon.ico'
			response({ icon: icon })
		}
	}
})
