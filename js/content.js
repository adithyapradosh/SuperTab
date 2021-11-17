chrome.runtime.onMessage.addListener(function (request, sender, response) {
	if (request.topic == 'icon') {
		var icon
		var links = $('link[rel*="icon"]')
		$.each(links, function (i, val) {
			if (val.rel == 'apple-touch-icon') {
				icon = val.href
			} else if (val.sizes.value.indexOf('48') != -1) {
				icon = val.href
			} else if (val.sizes.value.indexOf('96') != -1) {
				icon = val.href
			} else if (val.sizes.value.indexOf('144') != -1) {
				icon = val.href
			} else {
				icon = val.href
			}
		})
		if (icon) {
			response({ icon: icon })
		}
	}
})