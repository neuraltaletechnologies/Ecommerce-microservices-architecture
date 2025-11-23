# How to Get Search Engine Verification Codes

## 🔍 Google Search Console Verification

### Step 1: Go to Google Search Console
1. Visit: https://search.google.com/search-console
2. Sign in with your Google account
3. Click **"Add Property"** or **"Start now"**

### Step 2: Add Your Website
1. Choose **"URL prefix"** (recommended)
2. Enter: `https://neuraltale-client.vercel.app`
3. Click **"Continue"**

### Step 3: Get Verification Code
1. Select **"HTML tag"** verification method
2. You'll see code like this:
   ```html
   <meta name="google-site-verification" content="abc123def456..." />
   ```
3. **Copy only the content value**: `abc123def456...`
4. This is your verification code!

### Step 4: Add to Your Code
Open `apps/client/src/app/layout.tsx` and replace:
```typescript
verification: {
  google: 'abc123def456...',  // ← Paste your code here
  yandex: 'your-yandex-verification-code',
}
```

### Step 5: Deploy and Verify
1. Commit and push your changes to GitHub
2. Wait for Vercel to deploy (2-3 minutes)
3. Go back to Google Search Console
4. Click **"Verify"**
5. ✅ Success! You're verified

---

## 🔍 Yandex Webmaster Verification

### Step 1: Go to Yandex Webmaster
1. Visit: https://webmaster.yandex.com/
2. Sign in or create a Yandex account
3. Click **"Add site"**

### Step 2: Add Your Website
1. Enter: `https://neuraltale-client.vercel.app`
2. Click **"Add"**

### Step 3: Get Verification Code
1. Choose **"Meta tag"** verification method
2. You'll see code like this:
   ```html
   <meta name="yandex-verification" content="xyz789abc123..." />
   ```
3. **Copy only the content value**: `xyz789abc123...`
4. This is your verification code!

### Step 4: Add to Your Code
Open `apps/client/src/app/layout.tsx` and replace:
```typescript
verification: {
  google: 'your-google-code',
  yandex: 'xyz789abc123...',  // ← Paste your code here
}
```

### Step 5: Deploy and Verify
1. Commit and push your changes
2. Wait for Vercel deployment
3. Go back to Yandex Webmaster
4. Click **"Check"** or **"Verify"**
5. ✅ Success! You're verified

---

## 📝 Quick Example

**Before** (in `layout.tsx`):
```typescript
verification: {
  google: 'your-google-verification-code',
  yandex: 'your-yandex-verification-code',
}
```

**After** (with real codes):
```typescript
verification: {
  google: 'kJ8x9mN2pQ5wR7yT3vL6sH4gF1dA0zX',
  yandex: 'bC9v8xM2nP5qR7tL3sH6gD4fA1zW0yK',
}
```

---

## 🚀 After Verification

Once both are verified:

### Google Search Console - Next Steps
1. **Submit Sitemap**:
   - Go to **Sitemaps** section
   - Add: `https://neuraltale-client.vercel.app/sitemap.xml`
   - Click **"Submit"**

2. **Set Target Country**:
   - Go to **Settings** → **International Targeting**
   - Select **"Tanzania"** as target country

3. **Request Indexing**:
   - Use URL Inspection tool
   - Enter key pages (homepage, products)
   - Click **"Request indexing"**

### Yandex Webmaster - Next Steps
1. **Submit Sitemap**:
   - Go to **Indexing** → **Sitemap files**
   - Add: `https://neuraltale-client.vercel.app/sitemap.xml`

2. **Set Region**:
   - Go to **Settings**
   - Select **"Tanzania"** or **"International"**

---

## ⏱️ Timeline

| Task | Time Required |
|------|---------------|
| Get verification codes | 5 minutes |
| Add codes to layout.tsx | 1 minute |
| Deploy to Vercel | 2-3 minutes |
| Verify ownership | 1 minute |
| Submit sitemap | 2 minutes |
| **Total** | **~12 minutes** |

---

## 🔧 Troubleshooting

### "Verification Failed"
- ✅ Make sure you deployed after adding the code
- ✅ Wait 2-3 minutes for Vercel deployment
- ✅ Check you copied the code correctly (no extra spaces)
- ✅ Verify the meta tag appears in page source (View → Page Source)

### "Meta Tag Not Found"
- ✅ Clear browser cache
- ✅ Open incognito/private window
- ✅ View page source and search for "google-site-verification"
- ✅ If not there, redeploy from Vercel dashboard

### "Still Can't Verify"
Alternative verification methods:
1. **HTML file upload** (upload verification file to `/public`)
2. **DNS record** (add TXT record to domain DNS)
3. **Google Analytics** (if you have GA installed)

---

## 💡 Pro Tips

1. **Don't remove verification codes** - Keep them in your code forever
2. **Both are optional** - Google is most important for Tanzania
3. **Bing Webmaster Tools** - Also consider adding (uses Microsoft account)
4. **Check weekly** - Monitor indexing status in Search Console

---

## 📞 Need Help?

If verification fails after multiple attempts:
1. Check Vercel deployment logs for errors
2. Verify your site is accessible at the URL
3. Try alternative verification methods (HTML file, DNS)
4. Contact support if domain ownership is unclear

**Google Support**: https://support.google.com/webmasters/
**Yandex Support**: https://yandex.com/support/webmaster/
