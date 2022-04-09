require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateUniqueId = require("generate-unique-id");
const uniqueString = require("unique-string");
const nodemailer = require("nodemailer");
const User = require("../models").adminuser;
const ResetPasswords = require("../models").resetpassword;
const profile = require("../models").profile;
const SuperAdmin = require("../models").superadmin;
const Referrals = require("../models").Referral;

const excludeAtrrbutes = { exclude: ["createdAt", "updatedAt", "deletedAt"] };

// imports initialization
const { Op } = require("sequelize");

exports.registerUser = async (req, res, next) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      phonenumber,
      referral_email,
      confirmpassword,
    } = req.body;
    const user = await User.findOne({ where: { email } });

    if (user) {
      return res.status(400).send({ message: "This email already exists" });
    } else if (password !== confirmpassword) {
      return res.status(400).send({ message: "Password does not match" });
    } else {
      let newUser;
      const hashPwd = bcrypt.hashSync(password, 10);
      let uniqueRef = generateUniqueId({
        length: 8,
        useLetters: true,
      });

      const { referral } = req.body;
      console.log("Reference", referral);
      const reference = await User.findOne({
        where: {
          reference: {
            [Op.eq]: referral,
          },
        },
      });
      if (reference) {
        newUser = await User.create({
          firstname,
          lastname,
          phonenumber,
          email,
          password: hashPwd,
          referral_id: reference.id,
          reference: uniqueRef,
        });

        const referral = await Referrals.create({
          referral_id: reference.id,
          user_id: newUser.id,
        });
      } else {
        newUser = await User.create({
          firstname,
          lastname,
          phonenumber,
          email,
          password: hashPwd,
          reference: uniqueRef,
        });
      }

      const newProfile = await profile.create({
        firstname,
        lastname,
        phonenumber,
        email,
        adminuserId: newUser.id,
      });

      let user_email = newUser.email;
      let email_token = uniqueString();
      const output = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html xmlns="http://www.w3.org/1999/xhtml" xmlns:o="urn:schemas-microsoft-com:office:office" style="width:100%;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                <head>
                <meta charset="UTF-8">
                <meta content="width=device-width, initial-scale=1" name="viewport">
                <meta name="x-apple-disable-message-reformatting">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta content="telephone=no" name="format-detection">
                <title>New email template 2021-04-12</title>
                <!--[if (mso 16)]>
                <style type="text/css">
                a {text-decoration: none;}
                </style>
                <![endif]-->
                <!--[if gte mso 9]><style>sup { font-size: 100% !important; }</style><![endif]-->
                <!--[if gte mso 9]>
                <xml>
                <o:OfficeDocumentSettings>
                <o:AllowPNG></o:AllowPNG>
                <o:PixelsPerInch>96</o:PixelsPerInch>
                </o:OfficeDocumentSettings>
                </xml>
                <![endif]-->
                <!--[if !mso]><!-- -->
                <link href="https://fonts.googleapis.com/css?family=Lato:400,400i,700,700i" rel="stylesheet">
                <!--<![endif]-->
                <style type="text/css">
                #outlook a {
                padding:0;
                }
                .ExternalClass {
                width:100%;
                }
                .ExternalClass,
                .ExternalClass p,
                .ExternalClass span,
                .ExternalClass font,
                .ExternalClass td,
                .ExternalClass div {
                line-height:100%;
                }
                .es-button {
                mso-style-priority:100!important;
                text-decoration:none!important;
                }
                a[x-apple-data-detectors] {
                color:inherit!important;
                text-decoration:none!important;
                font-size:inherit!important;
                font-family:inherit!important;
                font-weight:inherit!important;
                line-height:inherit!important;
                }
                .es-desk-hidden {
                display:none;
                float:left;
                overflow:hidden;
                width:0;
                max-height:0;
                line-height:0;
                mso-hide:all;
                }
                @media only screen and (max-width:600px) {p, ul li, ol li, a { line-height:150%!important } h1 { font-size:30px!important; text-align:center; line-height:120%!important } h2 { font-size:26px!important; text-align:center; line-height:120%!important } h3 { font-size:20px!important; text-align:center; line-height:120%!important } .es-header-body h1 a, .es-content-body h1 a, .es-footer-body h1 a { font-size:30px!important } .es-header-body h2 a, .es-content-body h2 a, .es-footer-body h2 a { font-size:26px!important } .es-header-body h3 a, .es-content-body h3 a, .es-footer-body h3 a { font-size:20px!important } .es-menu td a { font-size:16px!important } .es-header-body p, .es-header-body ul li, .es-header-body ol li, .es-header-body a { font-size:16px!important } .es-content-body p, .es-content-body ul li, .es-content-body ol li, .es-content-body a { font-size:16px!important } .es-footer-body p, .es-footer-body ul li, .es-footer-body ol li, .es-footer-body a { font-size:16px!important } .es-infoblock p, .es-infoblock ul li, .es-infoblock ol li, .es-infoblock a { font-size:12px!important } *[class="gmail-fix"] { display:none!important } .es-m-txt-c, .es-m-txt-c h1, .es-m-txt-c h2, .es-m-txt-c h3 { text-align:center!important } .es-m-txt-r, .es-m-txt-r h1, .es-m-txt-r h2, .es-m-txt-r h3 { text-align:right!important } .es-m-txt-l, .es-m-txt-l h1, .es-m-txt-l h2, .es-m-txt-l h3 { text-align:left!important } .es-m-txt-r img, .es-m-txt-c img, .es-m-txt-l img { display:inline!important } .es-button-border { display:block!important } a.es-button, button.es-button { font-size:20px!important; display:block!important; border-width:15px 25px 15px 25px!important } .es-btn-fw { border-width:10px 0px!important; text-align:center!important } .es-adaptive table, .es-btn-fw, .es-btn-fw-brdr, .es-left, .es-right { width:100%!important } .es-content table, .es-header table, .es-footer table, .es-content, .es-footer, .es-header { width:100%!important; max-width:600px!important } .es-adapt-td { display:block!important; width:100%!important } .adapt-img { width:100%!important; height:auto!important } .es-m-p0 { padding:0px!important } .es-m-p0r { padding-right:0px!important } .es-m-p0l { padding-left:0px!important } .es-m-p0t { padding-top:0px!important } .es-m-p0b { padding-bottom:0!important } .es-m-p20b { padding-bottom:20px!important } .es-mobile-hidden, .es-hidden { display:none!important } tr.es-desk-hidden, td.es-desk-hidden, table.es-desk-hidden { width:auto!important; overflow:visible!important; float:none!important; max-height:inherit!important; line-height:inherit!important } tr.es-desk-hidden { display:table-row!important } table.es-desk-hidden { display:table!important } td.es-desk-menu-hidden { display:table-cell!important } .es-menu td { width:1%!important } table.es-table-not-adapt, .esd-block-html table { width:auto!important } table.es-social { display:inline-block!important } table.es-social td { display:inline-block!important } }
                </style>
                </head>
                <body style="width:100%;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;padding:0;Margin:0">
                <div class="es-wrapper-color" style="background-color:#F4F4F4">
                <!--[if gte mso 9]>
                <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                <v:fill type="tile" color="#f4f4f4"></v:fill>
                </v:background>
                <![endif]-->
                <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;padding:0;Margin:0;width:100%;height:100%;background-repeat:repeat;background-position:center top">
                <tr class="gmail-fix" height="0" style="border-collapse:collapse">
                <td style="padding:0;Margin:0">
                <table cellspacing="0" cellpadding="0" border="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;width:500px">
                <tr style="border-collapse:collapse">
                <td cellpadding="0" cellspacing="0" border="0" style="padding:0;Margin:0;line-height:1px;min-width:500px" height="0"><img src="https://retfbx.stripocdn.email/content/guids/CABINET_837dc1d79e3a5eca5eb1609bfe9fd374/images/41521605538834349.png" style="display:block;border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic;max-height:0px;min-height:0px;min-width:500px;width:500px" alt width="500" height="1"></td>
                </tr>
                </table></td>
                </tr>
                <tr style="border-collapse:collapse">
                <td valign="top" style="padding:0;Margin:0">
                <table class="es-header" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%;background-color:#FFA73B;background-repeat:repeat;background-position:center top">
                <tr style="border-collapse:collapse">
                <td align="center" style="padding:0;Margin:0">
                <table class="es-header-body" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:500px">
                <tr style="border-collapse:collapse">
                <td align="left" style="Margin:0;padding-bottom:10px;padding-left:10px;padding-right:10px;padding-top:20px">
                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                <td valign="top" align="center" style="padding:0;Margin:0;width:480px">
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
  
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table>
                <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                <tr style="border-collapse:collapse">
                <td style="padding:0;Margin:0;background-color:#FFA73B" bgcolor="#ffa73b" align="center">
                <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:500px" cellspacing="0" cellpadding="0" align="center">
                <tr style="border-collapse:collapse">
                <td align="left" style="padding:0;Margin:0">
                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                <td valign="top" align="center" style="padding:0;Margin:0;width:500px">
                <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;background-color:#FFFFFF;border-radius:4px" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation">
                <tr style="border-collapse:collapse">
                <td align="center" style="Margin:0;padding-bottom:5px;padding-left:30px;padding-right:30px;padding-top:35px"><h1 style="Margin:0;line-height:58px;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;font-size:48px;font-style:normal;font-weight:normal;color:#111111">Welcome!</h1></td>
                </tr>
                <tr style="border-collapse:collapse">
                <td bgcolor="#ffffff" align="center" style="Margin:0;padding-top:5px;padding-bottom:5px;padding-left:20px;padding-right:20px;font-size:0">
                <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                <td style="padding:0;Margin:0;border-bottom:1px solid #FFFFFF;background:#FFFFFF none repeat scroll 0% 0%;height:1px;width:100%;margin:0px"></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table>
                <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                <tr style="border-collapse:collapse">
                <td align="center" style="padding:0;Margin:0">
                <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:500px" cellspacing="0" cellpadding="0" align="center">
                <tr style="border-collapse:collapse">
                <td align="left" style="padding:0;Margin:0">
                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                <td valign="top" align="center" style="padding:0;Margin:0;width:500px">
                <table style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:separate;border-spacing:0px;border-radius:4px;background-color:#FFFFFF" width="100%" cellspacing="0" cellpadding="0" bgcolor="#ffffff" role="presentation">
                <tr style="border-collapse:collapse">
                <td class="es-m-txt-l" bgcolor="#ffffff" align="left" style="Margin:0;padding-top:20px;padding-bottom:20px;padding-left:30px;padding-right:30px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#666666;font-size:18px">Hi, <strong>${user_email}</strong><br>We're excited to have you get started. First, you need to activate&nbsp;your account. Just press the button below.</p></td>
                </tr>
                <tr style="border-collapse:collapse">
                <td align="center" style="Margin:0;padding-left:10px;padding-right:10px;padding-top:35px;padding-bottom:35px"><span class="es-button-border" style="border-style:solid;border-color:#FFA73B;background:1px;border-width:1px;display:inline-block;border-radius:2px;width:auto"><a href="${process.env.SITE_URL}/verify?email=${user_email}&token=${email_token}" class="es-button" target="_blank" style="mso-style-priority:100 !important;text-decoration:none;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;color:#FFFFFF;font-size:20px;border-style:solid;border-color:#FFA73B;border-width:15px 30px;display:inline-block;background:#FFA73B;border-radius:2px;font-family:helvetica, 'helvetica neue', arial, verdana, sans-serif;font-weight:normal;font-style:normal;line-height:24px;width:auto;text-align:center">Activate Account</a></span></td>
                </tr>
                <tr style="border-collapse:collapse">
                <td class="es-m-txt-l" align="left" style="Margin:0;padding-top:20px;padding-left:30px;padding-right:30px;padding-bottom:40px"><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#666666;font-size:18px">Cheers,</p><p style="Margin:0;-webkit-text-size-adjust:none;-ms-text-size-adjust:none;mso-line-height-rule:exactly;font-family:lato, 'helvetica neue', helvetica, arial, sans-serif;line-height:27px;color:#666666;font-size:18px">The elfrique Team</p></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table>
                <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                <tr style="border-collapse:collapse">
                <td align="center" style="padding:0;Margin:0">
                <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:500px" cellspacing="0" cellpadding="0" align="center">
                <tr style="border-collapse:collapse">
                <td align="left" style="padding:0;Margin:0">
                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                <td valign="top" align="center" style="padding:0;Margin:0;width:500px">
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                <td align="center" style="Margin:0;padding-top:10px;padding-bottom:20px;padding-left:20px;padding-right:20px;font-size:0">
                <table width="100%" height="100%" cellspacing="0" cellpadding="0" border="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                <td style="padding:0;Margin:0;border-bottom:1px solid #F4F4F4;background:#FFFFFF none repeat scroll 0% 0%;height:1px;width:100%;margin:0px"></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table>
                <table class="es-content" cellspacing="0" cellpadding="0" align="center" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;table-layout:fixed !important;width:100%">
                <tr style="border-collapse:collapse">
                <td align="center" style="padding:0;Margin:0">
                <table class="es-content-body" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px;background-color:transparent;width:500px" cellspacing="0" cellpadding="0" align="center">
                <tr style="border-collapse:collapse">
                <td align="left" style="Margin:0;padding-left:20px;padding-right:20px;padding-top:30px;padding-bottom:30px">
                <table width="100%" cellspacing="0" cellpadding="0" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
                <td valign="top" align="center" style="padding:0;Margin:0;width:460px">
                <table width="100%" cellspacing="0" cellpadding="0" role="presentation" style="mso-table-lspace:0pt;mso-table-rspace:0pt;border-collapse:collapse;border-spacing:0px">
                <tr style="border-collapse:collapse">
               
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table></td>
                </tr>
                </table>
                </div>
                </body>
                </html>`;
      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // true for 465, false for other ports
        tls: {
          rejectUnauthorized: false,
        },
        auth: {
          user: process.env.EMAIL_USERNAME, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let mailOptions = {
        from: ` "Elfrique" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: `${email}`, // list of receivers
        subject: "[Elfrique] Please activate your account", // Subject line
        text: "Elfrique", // plain text body
        html: output, // html body
      };
      transporter.sendMail(mailOptions, async (err, info) => {
        if (err) {
          console.log(err);
          return res.status(500).send({ message: "Error sending mail" });
        } else {
          // console.log('Mail Sent: ', info);
          const update = await User.update(
            { email_token },
            { where: { email } }
          );
          return res.status(200).send({
            message:
              "Registration successful, check your email for activation link.",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else {
      if (user.activated !== 1) {
        return res.status(400).send({
          message:
            "Account not activated: Check your email for activation link",
        });
      } else {
        const compare = bcrypt.compareSync(password, user.password);
        if (!compare) {
          return res.status(400).send({ message: "Invalid Password" });
        } else {
          const payload = {
            user: {
              id: user.id,
            },
          };
          const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "3d",
          });
          return res.status(200).send({ token, user });
        }
      }
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.verifyEmail = async (req, res, next) => {
  try {
    const email_token = req.query.token;
    const user = await User.findOne({
      where: { email_token },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else {
      const update = await User.update(
        { activated: 1 },
        { where: { email_token } }
      );
      return res.status(200).send({ message: "Account activated" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.postresetlink = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else {
      const token = uniqueString();

      const output = `<html>
              <head>
                <title>Reset Password link for elfrique account</title>
              </head>
              <body>
              <p>You requested to change your password, please ignore If you didn't make the request</p>
              <a style="width: 100px; background: #FFA73B; color: #fff; height: 50px; padding: 12px 20px; text-decoration: none; margin-top: 30px;" href='${process.env.SITE_URL}/api/v1/resetpassword?email=${email}&token=${token}'>RESET PASSWORD</a>
              </body>
        </html>`;

      let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
          user: process.env.EMAIL_USERNAME, // generated ethereal user
          pass: process.env.EMAIL_PASSWORD, // generated ethereal password
        },
      });

      // send mail with defined transport object
      let mailOptions = {
        from: ` "elfrique" <${process.env.EMAIL_USERNAME}>`, // sender address
        to: `${email}`, // list of receivers
        subject: "[elfrique] Please reset your password", // Subject line
        text: "Elfrique", // plain text body
        html: output, // html body
      };

      // insert into forgot password the value of the token and email
      // if email exists already update else insert new
      const reset = await ResetPasswords.findOne({
        where: {
          useremail: {
            [Op.eq]: email,
          },
        },
      });
      if (reset) {
        const update = await ResetPasswords.update(
          {
            token: token,
          },
          {
            where: {
              useremail: {
                [Op.eq]: email,
              },
            },
          }
        );
      } else {
        const newRes = await ResetPasswords.create({
          useremail: email,
          token: token,
        });
      }

      // Send mail
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return res.status(500).send({ message: "Error sending mail" });
        } else {
          // console.log('Mail Sent: ', info);
          return res.status(200).send({
            message:
              "Reset password link sent, check your email for reset link.",
          });
        }
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.resetpassword = async (req, res, next) => {
  try {
    const { email, password, confirmpassword } = req.body;
    const user = await User.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!user) {
      return res.status(400).send({ message: "User not found" });
    } else if (password !== confirmpassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    } else {
      let currentPassword = bcrypt.hashSync(password, 10);
      const update = User.update(
        {
          password: currentPassword,
        },
        {
          where: {
            email: {
              [Op.eq]: email,
            },
          },
        }
      )
        .then((result) => {
          return res.status(200).send({ message: "Password changed" });
        })
        .catch((err) => {
          return res.status(500).send({ message: "Server Error" });
        });
    }
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.createSuperAdmin = async (req, res, next) => {
  try {
    const { email, password, confirmpassword } = req.body;
    const superAdmin = await SuperAdmin.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (superAdmin) {
      return res.status(400).send({ message: "SuperAdmin already exists" });
    } else if (password !== confirmpassword) {
      return res.status(400).send({ message: "Passwords do not match" });
    } else {
      let currentPassword = bcrypt.hashSync(password, 10);
      const newSuperAdmin = await SuperAdmin.create({
        email,
        password: currentPassword,
      });
      return res.status(200).send({ message: "SuperAdmin created" });
    }
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};

exports.loginSuperAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const superAdmin = await SuperAdmin.findOne({
      where: { email },
      attributes: { exclude: ["createdAt", "updatedAt", "deletedAt"] },
    });
    if (!superAdmin) {
      return res.status(400).send({ message: "SuperAdmin not found" });
    } else {
      const isMatch = bcrypt.compareSync(password, superAdmin.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Incorrect password" });
      } else {
        const payload = {
          user: {
            id: superAdmin.id,
          },
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        return res.status(200).send({
          message: "SuperAdmin logged in",
          token,
        });
      }
    }
  } catch (error) {
    return res.status(500).send({ message: "Server Error" });
  }
};
