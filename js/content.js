chrome.runtime.onMessage.addListener(function (request, sender, response) {
	if (request.topic == 'icon') {	//get website icon
		var icon
		var links = $('link[rel*="icon"]')
		var flag = 0
		$.each(links, function (i, val) {
			if (val.rel == 'apple-touch-icon') {
				icon = val.href
				flag = 1
			} else if (val.sizes.value.indexOf('48') != -1) {
				icon = val.href
				flag = 1
			} else if (val.sizes.value.indexOf('96') != -1) {
				icon = val.href
				flag = 1
			} else if (val.sizes.value.indexOf('144') != -1) {
				icon = val.href
				flag = 1
			} else {
				icon = val.href
				flag = 1
			}
			if (flag == 1)
				return false
		})
		if (flag == 0) {
			console.log('broken')
			icon = window.location.href + 'favicon.ico'
		}
		if (icon) {
			response({ icon: icon })
		}
	}
})
