import { NhostClient } from '@nhost/nhost-js';

const nhost = new NhostClient({
  subdomain: import.meta.env.REACT_APP_NHOST_SUBDOMAIN || 'your-nhost-subdomain',
  region: import.meta.env.REACT_APP_NHOST_REGION || 'us-east-1',
});

export { nhost };