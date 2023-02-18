const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TraverlerListingSchema = new Schema({
   extraWeight: {
      type: Number,
      required: [true, 'Please specify how much extra weight you have'],
   },
   date: {
      type: Date,
      required: [true, 'Please select a date'],
   },
   dimension: {
      type: String,
      required: [true, 'Please specify the free dimension of your luggage'],
   },
   ticketNumber: {
      type: String,
      required: [true, 'Please specify the ticket number'],
   },
   residentCity: {
      type: String,
      required: [true, 'Please specify where you are staying'],
   },
   description: {
        type: String,
        required: [true, 'Please add a description'],
    },
   user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
   },
   isFavorite: {
      type: Boolean,
      default: false,
   },
   country: {
      type: String,
      required: [true, 'Please select a country'],
      enum: [
         'Afghanistan',
         'Albania',
         'Algeria',
         'Andorra',
         'Angola',
         'Antigua and Barbuda',
         'Argentina',
         'Armenia',
         'Australia',
         'Austria',
         'Azerbaijan',
         'Bahamas',
         'Bahrain',
         'Bangladesh',
         'Barbados',
         'Belarus',
         'Belgium',
         'Belize',
         'Benin',
         'Bhutan',
         'Bolivia',
         'Bosnia and Herzegovina',
         'Botswana',
         'Brazil',
         'Brunei',
         'Bulgaria',
         'Burkina Faso',
         'Burundi',
         'Cabo Verde',
         'Cambodia',
         'Cameroon',
         'Canada',
         'Central African Republic',
         'Chad',
         'Chile',
         'China',
         'Colombia',
         'Comoros',
         'Congo',
         'Costa Rica',
         'Croatia',
         'Cuba',
         'Cyprus',
         'Czech Republic',
         "Côte d'Ivoire",
         'Denmark',
         'Djibouti',
         'Dominica',
         'Dominican Republic',
         'Ecuador',
         'Egypt',
         'El Salvador',
         'Equatorial Guinea',
         'Eritrea',
         'Estonia',
         'Eswatini',
         'Ethiopia',
         'Fiji',
         'Finland',
         'France',
         'Gabon',
         'Gambia',
         'Georgia',
         'Germany',
         'Ghana',
         'Greece',
         'Grenada',
         'Guatemala',
         'Guinea',
         'Guinea-Bissau',
         'Guyana',
         'Haiti',
         'Honduras',
         'Hungary',
         'Iceland',
         'India',
         'Indonesia',
         'Iran',
         'Iraq',
         'Ireland',
         'Italy',
         'Jamaica',
         'Japan',
         'Jordan',
         'Kazakhstan',
         'Kenya',
         'Kiribati',
         'Kuwait',
         'Kyrgyzstan',
         'Laos',
         'Latvia',
         'Lebanon',
         'Lesotho',
         'Liberia',
         'Libya',
         'Liechtenstein',
         'Lithuania',
         'Luxembourg',
         'Madagascar',
         'Malawi',
         'Malaysia',
         'Maldives',
         'Mali',
         'Malta',
         'Marshall Islands',
         'Mauritania',
         'Mauritius',
         'Mexico',
         'Micronesia',
         'Moldova',
         'Monaco',
         'Mongolia',
         'Montenegro',
         'Morocco',
         'Mozambique',
         'Myanmar',
         'Namibia',
         'Nauru',
         'Nepal',
         'Netherlands',
         'New Zealand',
         'Nicaragua',
         'Niger',
         'Nigeria',
         'North Korea',
         'North Macedonia',
         'Norway',
         'Oman',
         'Pakistan',
         'Palau',
         'Palestine',
         'Panama',
         'Papua New Guinea',
         'Paraguay',
         'Peru',
         'Philippines',
         'Poland',
         'Portugal',
         'Qatar',
         'Romania',
         'Russia',
         'Rwanda',
         'Saint Kitts and Nevis',
         'Saint Lucia',
         'Saint Vincent and the Grenadines',
         'Samoa',
         'San Marino',
         'Sao Tome and Principe',
         'Saudi Arabia',
         'Senegal',
         'Serbia',
         'Seychelles',
         'Sierra Leone',
         'Singapore',
         'Slovakia',
         'Slovenia',
         'Solomon Islands',
         'Somalia',
         'South Africa',
         'South Korea',
         'South Sudan',
         'Spain',
         'Sri Lanka',
         'Sudan',
         'Suriname',
         'Sweden',
         'Switzerland',
         'Syria',
         'Taiwan',
         'Tajikistan',
         'Tanzania',
         'Thailand',
         'Timor-Leste',
         'Togo',
         'Tonga',
         'Trinidad and Tobago',
         'Tunisia',
         'Turkey',
         'Turkmenistan',
         'Tuvalu',
         'Uganda',
         'Ukraine',
         'United Arab Emirates',
         'United Kingdom',
         'United States of America',
         'Uruguay',
         'Uzbekistan',
         'Vanuatu',
         'Vatican City',
         'Venezuela',
         'Vietnam',
         'Yemen',
         'Zambia',
         'Zimbabwe',
      ],
   },
})

module.exports = TraverlerListing = mongoose.model(
   'traverlerListing',
   TraverlerListingSchema
)
