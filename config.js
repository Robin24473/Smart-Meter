// Public settings for the website. The Supabase key below is the *publishable* key:
// it is safe to put in a website because every table is protected by row-level security.
window.APP_CONFIG = {
  SUPABASE_URL: 'https://uksnaklhtousetgwlojm.supabase.co',
  SUPABASE_KEY: 'sb_publishable_ebKXyaD7vsUtKbYlTvThLA_JREWAYMO',
  BROKER_WSS: 'wss://broker.emqx.io:8084/mqtt',
  TOPIC_ROOT: 'btp/meter'
};
