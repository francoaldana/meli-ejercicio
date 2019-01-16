const isValidIPAddress = (ipaddress) => {
	const ipaddrJs = require('ipaddr.js');

	if(!ipaddrJs.isValid(ipaddress) || ipaddrJs.parse(ipaddress).range() === "private" || ipaddrJs.parse(ipaddress).range() === "reserved" || (ipaddress.split(".").length - 1) < 3) {
		return false;
	}

	return true;
}


export default { isValidIPAddress };
