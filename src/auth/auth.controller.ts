import { Controller, Get, Req, Res } from '@nestjs/common';
import axios from 'axios';

// @Controller('auth')
// export class AuthController {
//   @Get('docusign')
//   async docusignLogin(@Req() req, @Res() res) {
//     const { DOCSIGN_CLIENT_ID, DOCSIGN_REDIRECT_URI } = process.env;
//     const state = '123'; // replace with your own state value
//     const responseType = 'token';
//     const scope = 'signature';
//     const url = `https://account-d.docusign.com/oauth/auth?response_type=${responseType}&scope=${scope}&client_id=${DOCSIGN_CLIENT_ID}&redirect_uri=${DOCSIGN_REDIRECT_URI}&state=${state}`;

//     return res.redirect(url);
//   }

//   @Get('docusign/callback')
//   async docusignCallback(@Req() req, @Res() res) {
//     const { DOCSIGN_SECRET } = process.env;
//     const { access_token } = req.query;

//     try {
//       // Fetch account ID
//       const accountsResponse = await axios.get(
//         'https://account-d.docusign.com/oauth/userinfo',
//         {
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         },
//       );
//       const accountId = accountsResponse?.data?.accounts[0]?.account_id;

//       // Fetch account details
//       const accountResponse = await axios.get(
//         `https://demo.docusign.net/restapi/v2/accounts/${accountId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${access_token}`,
//           },
//         },
//       );
//       console.log('accountResponse', accountResponse);
      
//       return res.send('Authenticated successfully');
//     } catch (error) {
//       console.error(error);
//       return res.status(500).send('Failed to authenticate');
//     }
//   }
// }
