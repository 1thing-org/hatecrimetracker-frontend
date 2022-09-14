// ** Checks if an object is empty (returns boolean)
export const isObjEmpty = obj => !obj||Object.keys(obj).length === 0

// ** Returns K format from a number
export const kFormatter = num => (num > 999 ? `${(num / 1000).toFixed(1)}k` : num)

// ** Converts HTML to string
export const htmlToString = html => html.replace(/<\/?[^>]+(>|$)/g, '')

// ** Checks if the passed date is today
const isToday = date => {
  const today = new Date()
  return (
    /* eslint-disable operator-linebreak */
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
    /* eslint-enable */
  )
}

/**
 ** Format and return date in Humanize format
 ** Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 ** Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'short', day: 'numeric', year: 'numeric' }) => {
  if (!value) return value
  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

// ** Returns short month of passed date
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value)
  let formatting = { month: 'short', day: 'numeric' }

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = { hour: 'numeric', minute: 'numeric' }
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value))
}

/**
 ** Return if user is logged in
 ** This is completely up to you and how you want to store the token in your frontend application
 *  ? e.g. If you are using cookies to store the application please update this function
 */
export const isUserLoggedIn = () => localStorage.getItem('userData')
export const getUserData = () => JSON.parse(localStorage.getItem('userData'))

/**
 ** This function is used for demo purpose route navigation
 ** In real app you won't need this function because your app will navigate to same route for each users regardless of ability
 ** Please note role field is just for showing purpose it's not used by anything in frontend
 ** We are checking role just for ease
 * ? NOTE: If you have different pages to navigate based on user ability then this function can be useful. However, you need to update it.
 * @param {String} userRole Role of user
 */
export const getHomeRouteForLoggedInUser = userRole => {
  if (userRole === 'admin') return '/'
  if (userRole === 'client') return '/access-control'
  return '/login'
}

// ** React Select Theme Colors
export const selectThemeColors = theme => ({
  ...theme,
  colors: {
    ...theme.colors,
    primary25: '#7367f01a', // for option hover bg-color
    primary: '#7367f0', // for selected option bg-color
    neutral10: '#7367f0', // for tags bg-color
    neutral20: '#ededed', // for input border-color
    neutral30: '#ededed' // for input hover border-color
  }
})

//Data of 2020
const StatePopulation = {
  "AL": 5024279,
  "AK": 733391,
  "AS": 49437,
  "AZ": 7151502,
  "AR": 3011524,
  "CA": 39538223,
  "CO": 5773714,
  "CT": 3605944,
  "DE": 989948,
  "DC": 689545,
  "FL": 21538187,
  "GA": 10711908,
  "GU": 168485,
  "HI": 1455271,
  "ID": 1839106,
  "IL": 12812508,
  "IN": 6785528,
  "IA": 3190369,
  "KS": 2937880,
  "KY": 4505836,
  "LA": 4657757,
  "ME": 1362359,
  "MD": 6177224,
  "MA": 7029917,
  "MI": 10077331,
  "MN": 5706494,
  "MS": 2961279,
  "MO": 6154913,
  "MT": 1084225,
  "NE": 1961504,
  "NV": 3104614,
  "NH": 1377529,
  "NJ": 9288994,
  "NM": 2117522,
  "NY": 20201249,
  "NC": 10439388,
  "ND": 779094,
  "MP": 51433,
  "OH": 11799448,
  "OK": 3959353,
  "OR": 4237256,
  "PA": 13011844,
  "PR": 3285874,
  "RI": 1097379,
  "SC": 5118425,
  "SD": 886667,
  "TN": 6910840,
  "TX": 29145505,
  "VI": 106235,
  "UT": 3271616,
  "VT": 643077,
  "VA": 8631393,
  "WA": 7705281,
  "WV": 1793716,
  "WI": 5893718,
  "WY": 576851
}
var total_population = 0;
Object.entries(StatePopulation).forEach(function ([key, value]) {
  total_population += value;
});
//2019
//https://worldpopulationreview.com/state-rankings/asian-population
const ASIAN_POPULATION = {
  "AK": 61128,
  "AL": 86490,
  "AR": 57895,

  "AZ": 310727,
  "CA": 6551732,
  "CO": 243556,
  "CT": 191505,
  "DC": 28722,
  "DE": 43398,
  "FL": 734880,
  "GA": 488952,

  "HI": 802551,
  "IA": 92564,
  "ID": 40745,
  "IL": 808038,
  "IN": 186237,
  "KS": 105946,
  "KY": 83733,
  "LA": 98019,
  "MA": 516599,
  "MD": 449579,
  "ME": 22658,
  "MI": 377181,
  "MN": 316790,
  "MO": 155191,

  "MS": 38321,
  "MT": 14690,
  "NC": 355907,
  "ND": 15471,
  "NE": 58983,
  "NH": 46317,
  "NJ": 923811,
  "NM": 48809,
  "NV": 305500,
  "NY": 1839680,
  "OH": 326348,
  "OK": 112607,
  "OR": 246789,
  "PA": 512310,

  "RI": 44653,
  "SC": 103491,
  "SD": 15897,
  "TN": 148955,
  "TX": 1565746,
  "UT": 107058,
  "VA": 664348,

  "VT": 14503,
  "WA": 812035,
  "WI": 194286,
  "WV": 19794,
  "WY": 8996
};

var toatl_asian = 0;
Object.entries(ASIAN_POPULATION).forEach(function ([key, value]) {
  toatl_asian += value;
});

const STATES_SHORT_TO_FULL = {
  "AL": "Alabama",
  "AK": "Alaska",
  "AZ": "Arizona",
  "AR": "Arkansas",
  // "AS": " American Samoa",
  "CA": "California",
  "CO": "Colorado",
  "CT": "Connecticut",
  "DC": "District of Columbia",
  "DE": "Delaware",
  "FL": "Florida",
  "GA": "Georgia",
  // "GU": "Guam",
  "HI": "Hawaii",
  "ID": "Idaho",
  "IL": "Illinois",
  "IN": "Indiana",
  "IA": "Iowa",
  "KS": "Kansas",
  "KY": "Kentucky",
  "LA": "Louisiana",
  "ME": "Maine",
  "MD": "Maryland",
  "MA": "Massachusetts",
  "MI": "Michigan",
  "MN": "Minnesota",
  "MS": "Mississippi",
  "MO": "Missouri",
  // "MP": "Northern Mariana Islands",
  "MT": "Montana",
  "NE": "Nebraska",
  "NV": "Nevada",
  "NH": "New Hampshire",
  "NJ": "New Jersey",
  "NM": "New Mexico",
  "NY": "New York",
  "NC": "North Carolina",
  "ND": "North Dakota",
  "OH": "Ohio",
  "OK": "Oklahoma",
  "OR": "Oregon",
  "PA": "Pennsylvania",
  "RI": "Rhode Island",
  "SC": "South Carolina",
  "SD": "South Dakota",
  "TN": "Tennessee",
  "TX": "Texas",
  // "VI": "U.S. Virgin Islands",
  "UT": "Utah",
  "VT": "Vermont",
  "VA": "Virginia",
  "WA": "Washington",
  "WV": "West Virginia",
  "WI": "Wisconsin",
  "WY": "Wyoming",
  "CANADA": "Canada",
  "ONLINE": "Online"
}
export const getValidState = (state) => {
  state = state?.toUpperCase();
  return state in STATES_SHORT_TO_FULL ? state : ''
};
export const formatIncidentRate = (rate) => (rate > 0.00001) ? Number(rate).toFixed(4) : "N/A";
export const getStateIncidentPerM = (incidentCount, state) => (incidentCount / (state ? StatePopulation[state] : total_population) * 1000000);
export const getStateIncidentPer10kAsian = (incidentCount, state) => incidentCount / (state ? ASIAN_POPULATION[state] : toatl_asian) * 10000;
export const stateFullName = (stateShort) => STATES_SHORT_TO_FULL[stateShort] ? STATES_SHORT_TO_FULL[stateShort] : stateShort;
export const forEachState = (callback) => Object.entries(STATES_SHORT_TO_FULL).forEach(([state, name]) => callback(state, name));
export const statePopulation = (state) => StatePopulation[state] || 0;
export const asianPopulation = (state) => ASIAN_POPULATION[state] || 0;
