# Smart Meter website

Pages:
- `index.html`: sign in / create account
- `dashboard.html`: a user's own meter (live power, appliances, cost, tariff tips)
- `admin.html`: admin page (all meters, which user owns each, live power, today's kWh, users, tariff)

Database and logins: Supabase project **BTP Smart Meter** (`uksnaklhtousetgwlojm`).
Live readings come straight from the meters over MQTT (`wss://broker.emqx.io:8084/mqtt`).

## 1. Put the site on GitHub Pages
1. On github.com, create a new **public** repository, for example `smart-meter`.
2. Click **Add file > Upload files** and drag in everything in this folder **except** the `bridge` folder. Commit.
3. Go to **Settings > Pages**. Under "Build and deployment" choose **Deploy from a branch**, branch **main**, folder **/ (root)**, and save.
4. After a minute the site is at `https://<your-github-name>.github.io/smart-meter/`.

## 2. Tell Supabase the site address (needed for sign-up emails)
In the Supabase dashboard, open the project **BTP Smart Meter**, then **Authentication > URL Configuration**:
- **Site URL**: `https://<your-github-name>.github.io/smart-meter/`
- **Redirect URLs**: add `https://<your-github-name>.github.io/smart-meter/**`

New accounts get a confirmation email. For a demo you can turn this off in
**Authentication > Sign In / Providers > Email > Confirm email**.

## 3. Create the admin account
The **first account created** on the site becomes the admin. Create yours first.
After that, every new account is a normal user, and the admin can make other people admins on the admin page.

## 4. Add meters and link them to users
1. Each person creates an account on the site.
2. The admin opens the admin page. Meters that are sending data but are not registered show under "New meters found"; click **Register**, or type the device ID under "Add a meter".
3. Choose the user in the **User** column. That user now sees the meter on their dashboard.

## 5. Change the tariff
On the admin page, edit the rates and hours under **Tariff** and click **Save tariff**. Every user's dashboard updates straight away.

## 6. Optional: save history (today's kWh)
The live view works without this. To keep history and show **Today** in kWh on the admin page, run the bridge on any computer that stays on:
1. Install Node.js 18 or newer.
2. In the `bridge` folder run `npm install`.
3. In Supabase, **Project Settings > API Keys**, copy the **secret** key. Keep it private and never put it on the website.
4. Run `SUPABASE_SERVICE_KEY=<secret key> npm start` (on Windows PowerShell: `$env:SUPABASE_SERVICE_KEY="<secret key>"; npm start`).
It saves a one-minute summary of every registered meter.

## Notes
- The key in `config.js` is the publishable key. It is meant to be public; all tables are protected by row-level security, so users only see their own meters and only admins can change meters, users or the tariff.
- The MQTT broker is public, so anyone who knows a device ID could read its live data. For a real deployment, use a private broker with a password.
