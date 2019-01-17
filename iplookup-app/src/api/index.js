import Utils from "../utils";

/**
 *	Given an IP Address returns and
 *	show advanced info about it.
 *	It shows:
 *
 * 	Country and ISO Country Code
 *
 */

const getIpAddress = async ipAddress => {
	let url = `https://api.ip2country.info/ip?${ipAddress}`;

	let results = await fetch(url);
	return results.json();
};

/**
 *	Given an ISO Country Code returns and
 *	show advanced info about it.
 *	It shows:
 *
 *	Languages
 *	Approximate distance from IP's Country to Buenos Aires, Argentina (in Km)
 *  Timezones and actual time
 *  Running Currencies
 */

const getCountryInfo = async countryCode3 => {
  const url = `https://restcountries.eu/rest/v2/alpha/${countryCode3}`;

  const results = await fetch(url);
  const response = await results.json();

  const languages = response.languages || [];
  const currencies = response.currencies || [];
  const flag = response.flag;

  let timezones = response.timezones || [];
  timezones = Utils.getTimeByTimezone(timezones);

  const countryCoord = response.latlng;
  const bsasCoord = [-34.60, -58.38];
  const distance = Utils.getDistanceBetweenCoordinates(bsasCoord, countryCoord);

	return {
    languages,
    timezones,
    currencies,
    distance,
    flag,
    countryCoord
  };
};

/**
 *  Given an ISO currency code returns and
 *  show advanced info about it.
 *  It shows:
 *
 *  Currency information and current exchange rate in USD
 *
 *
 */

const getCountryCurrency = async currencies =>{

      const currCode = currencies[0].code;
      const currSym = currencies[0].symbol;
      const query = currCode + "_USD";
      const url = `https://free.currencyconverterapi.com/api/v6/convert?q=${query}&compact=ultra`;

      const results = await fetch(url);
      const currencyRate = await results.json();

      return{
        currCode,
        currSym,
        currencyRate
      };
  }

export default { getIpAddress, getCountryInfo, getCountryCurrency};
