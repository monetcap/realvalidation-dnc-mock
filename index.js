// RealValidation API documentation https://drive.google.com/file/d/0B4Pn-GVvGTbYOFR5aHhINjA3Zm8/view

const express = require('express');

const app = express();

const PORT = process.env.PORT || 3000;
const TOKEN = process.env.TOKEN || 'aj275q8U8RvA62m6aGak6SFY';

const ERROR_MESSAGES = {
  InvalidParameters: 'Please supply valid phone & token parameters with your request',
  InvalidPhone: 'Please supply a valid phone parameter with your request',
  InvalidToken: 'Please supply a valid token parameter with your request',
};

app.get('/', (req, res) => {
  res.send('validator');
});

/**
 * sanitizes phone parameter by using regex's 'not digit' character class
 * @param  {string} phone phone number to sanitize
 * @return {string}       sanitized phone number
 */
const sanitizePhone = phone => phone.replace(/\D/g, '');


const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


const getYesNo = () => ((getRndInteger(0, 10) >= 9) ? 'Y' : 'N');

app.post('/validate', (req, res) => {
  // check if phone and token parameter are included within the request
  if (!(req.query.phone && req.query.token)) {
    return res.status(400).json({ error: ERROR_MESSAGES.InvalidParameters });
  }

  // extract phone and token parameters into shorthand variables
  const { token, phone } = req.query;
  if (token !== TOKEN) {
    return res.status(400).json({ error: ERROR_MESSAGES.InvalidToken });
  }

  // sanitize the phone number
  const sanitizedPhone = sanitizePhone(phone);

  // craft our example response back
  const response = {
    phone: sanitizedPhone,
    RESPONSECODE: 'OK',
    RESPONSEMSG: '',
    national_dnc: getYesNo(),
    state_dnc: getYesNo(),
    dma: getYesNo(),
    litigator: getYesNo(),
    iscell: getYesNo(),
    id: getRndInteger(0, 1000000),
  };

  // send the response with 200 status code
  return res.status(200).json(response);
});

// node index.js
if (require.main === module) {
  app.listen(PORT, () => console.log(`Validator app listening on port ${PORT}`));
}
