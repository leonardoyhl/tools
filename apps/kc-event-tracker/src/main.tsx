import { render } from 'preact';

import { App } from './app';

if (/^nginx-web-.*\.(dev|sit).kucoin.net|www\.kucoin\.com|localhost\:?[0-9]*$/i.test(location.host)) {
  render(
    <App />,
    (() => {
      console.warn('______ KuCoin Event Tracker ______');
      const app = document.createElement('div');
      app.id = 'kc_event_tracker';
      app.dir = 'ltr';
      document.body.appendChild(app);
      return app;
    })(),
  );
}
