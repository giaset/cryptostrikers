/* eslint-env node */
'use strict';

function headPayload(envString) {
  return `<!-- Google Tag Manager -->
  <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
  new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
  'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '&${envString}';f.parentNode.insertBefore(j,f);
  })(window,document,'script','dataLayer','GTM-T5JFD2L');</script>
  <!-- End Google Tag Manager -->`;
}

function bodyPayload(envString) {
  return `<!-- Google Tag Manager (noscript) -->
  <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T5JFD2L&${envString}"
  height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
  <!-- End Google Tag Manager (noscript) -->`;
}

module.exports = {
  name: 'ember-gtm',

  contentFor(type, config) {
    const deployTarget = config.emberGtm.deployTarget;
    let envString = 'gtm_auth=HHsaghciNmFlrgiDfC1MXQ&gtm_preview=env-5&gtm_cookies_win=x';
    if (deployTarget === 'staging') {
      envString = 'gtm_auth=GuyvmMWiy3-0xjIrSnBF4w&gtm_preview=env-7&gtm_cookies_win=x';
    } else if (deployTarget === 'production') {
      envString = 'gtm_auth=ZsgCSTdwRq9VZuWBq9iXYQ&gtm_preview=env-8&gtm_cookies_win=x';
    }

    if (type === 'ember-gtm') {
      return headPayload(envString);
    } else if (type === 'body') {
      return bodyPayload(envString);
    }
  },

  isDevelopingAddon() {
    return true;
  }
};
