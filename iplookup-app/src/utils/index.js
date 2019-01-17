/**
 *
 *  Given an IP Address returns true or false
 *	depending on if it's valid or not
 *
 */

const isValidIPAddress = (ipaddress) => {
	const ipaddrJs = require('ipaddr.js');

	if(!ipaddrJs.isValid(ipaddress) || ipaddrJs.parse(ipaddress).range() === "private" || ipaddrJs.parse(ipaddress).range() === "reserved" || (ipaddress.split(".").length - 1) < 3 || ipaddress.split(".")[0] === "127") {
		return false;
	}

	return true;
}

/**
 *
 *  Given two [lat, long] returns
 *	distance in KM
 *
 */

const getDistanceBetweenCoordinates = (fromCoord, toCoord) => {
	const lat1 = fromCoord[0];
	const lon1 = fromCoord[1];
	const lat2 = toCoord[0];
	const lon2 = toCoord[1];
	let unit = "K";

	if ((lat1 === lat2) && (lon1 === lon2)) {
		return 0;
	}

	const radlat1 = Math.PI * lat1 / 180;
	const radlat2 = Math.PI * lat2 / 180;
	const theta = lon1 - lon2;
	const radtheta = Math.PI * theta / 180;
	let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);

	if (dist > 1) {
		dist = 1;
	}

	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;

	if (unit === "K") {
		dist = dist * 1.609344
	}

	if (unit === "N") {
		dist = dist * 0.8684
	}

	return dist.toFixed(2);
}

/**
 *
 *  Given an array of timezones in the format "UTC+XX:XX"
 *	returns an Object with the timezones and the actual time on each of those timezones
 *	Didn't use Moment.js because it fails with tz like UTC+05:40
 *
 */
const getTimeByTimezone = (timezones) => {
	let result = [];

	timezones.forEach((timezone) => {
		let dict = {};
		let utctz = timezone;
		let time = timezone.substr(3).split(':');
		let offset = time[0];

		if(time[1] !== "00")
			offset = offset + "." + (parseInt(time[1])/6);

		//obtain local Date and get timestamp
		let d = new Date();
		let localTime = d.getTime();

		// obtain local UTC offset and convert to msec
		// <0 indicates evaluated locations is ahead of UTC and >0 indicates it's behind UTC
		let localOffset = d.getTimezoneOffset() * 60000;

		// obtain UTC time in msec
		let utc = localTime + localOffset;

		// convert UTC msec value to Date
		let nd = new Date(utc + (3600000*offset));

		dict.time = `${nd.getHours()}:${nd.getMinutes()}:${nd.getSeconds()}`;
		dict.utc = utctz;

		result.push(dict);
	});

	return result;
}

export default {
	isValidIPAddress,
	getDistanceBetweenCoordinates,
	getTimeByTimezone
};
