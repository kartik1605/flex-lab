# Google Search Console & Google Business Profile Setup
**The Flex Lab — Kota, Rajasthan**

---

## 1. Google Search Console — HTML Verification Tag

This tag is **already live** in the `<head>` of `index.html`. Copy it exactly if you need to re-enter it in the Search Console dashboard:

```html
<meta name="google-site-verification" content="nmV0-hswuHLnqKSidixscDMm3RHls5Pu9M0N_z8_xd8" />
```

### How to verify ownership in Search Console

1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Click **Add Property** → enter `https://www.flexlab.co.in`
3. Choose **HTML tag** as your verification method
4. Paste the tag above (it's already deployed — skip the "add to site" step)
5. Click **Verify** — it should confirm immediately

### Submit your sitemap

After verifying, go to **Sitemaps** in the left sidebar and submit:
```
https://www.flexlab.co.in/sitemap.xml
```

---

## 2. Google Business Profile (GBP) — Setup Checklist

Your GBP listing must match the structured data in `index.html` exactly, or Google will suppress it.

### Business Name
```
The Flex Lab
```
> Do NOT add city or keywords to the name (e.g. "The Flex Lab Kota Printing") — Google penalises keyword stuffing in the name field.

### Primary Category
```
Printing service
```

### Additional Categories (add all of these)
- [ ] Marketing agency
- [ ] Graphic designer
- [ ] Sign shop
- [ ] Banner store

### Address
Enter the **exact** Kota address. The structured data in `index.html` currently lists:
- City: **Kota**
- State/Region: **Rajasthan**
- Country: **India**
- Postal Code: **324005**

Update this file and the JSON-LD in `index.html` if the street address or pin code differs.

### Phone Number
```
+91 95099 61754
```

### Website URL
```
https://www.flexlab.co.in
```

### Service Area
In GBP → **Info** → **Service area**, add:
- Vigyan Nagar, Kota
- Talwandi, Kota
- Kota, Rajasthan (entire city)
- Rajasthan (state-level reach for courier/delivery)

### Business Hours
Set to match the structured data:
- Mon–Sat: **9:00 AM – 9:00 PM**
- Sunday: Set as closed or your actual hours

### Description (paste this into GBP → Info → Business description)
```
The Flex Lab is Kota's premium creative studio offering same-day instant
printing — flex banners, vinyl, stickers, business cards, posters, event
passes and 50+ products produced entirely in-house. We also handle end-to-end
branding, event management, corporate gifting, social media, and digital
marketing for coaching institutes, hostels, and businesses across Rajasthan.
Fast turnaround. Zero outsourcing. WhatsApp us for an instant quote.
```

### Products & Services to add in GBP
Add each as a separate service with a short description:
- [ ] Instant Flex & Banner Printing
- [ ] Same-Day Business Card Printing
- [ ] Sticker & Label Printing
- [ ] Event Passes & ID Cards
- [ ] Coaching Institute Branding Packages
- [ ] Hostel Branding & Signage
- [ ] Wedding Stationery
- [ ] Corporate Gifting & Hampers
- [ ] Social Media Management
- [ ] Website Design & SEO

### Photos to upload
Upload at least 10 photos:
- [ ] Shop / studio exterior (helps pin appear in Maps)
- [ ] Press room / printing equipment in action
- [ ] Sample prints: banners, stickers, business cards
- [ ] Team at work
- [ ] Before/after branding projects
- [ ] Coaching institute collateral examples
- [ ] Logo: use `images/logo/lens-lockup-dark.png`
- [ ] Cover photo: use a wide banner sample or studio shot

---

## 3. Local SEO Cross-Check

Confirm these match 1:1 between GBP, your website code, and any online directory listings (JustDial, Sulekha, IndiaMART):

| Field        | Value                                  |
|--------------|----------------------------------------|
| Business Name | The Flex Lab                          |
| Phone        | +91 95099 61754                        |
| Email        | flexlab.co.in@gmail.com               |
| Website      | https://www.flexlab.co.in             |
| City         | Kota                                   |
| State        | Rajasthan                              |
| Pin Code     | 324005 (update if different)           |

> **NAP Consistency** (Name, Address, Phone) across all platforms is one of the strongest local ranking signals. Any mismatch hurts rankings.

---

## 4. Post-Verification Actions

- [ ] Request indexing of `https://www.flexlab.co.in/instant.html` via Search Console → URL Inspection → Request Indexing
- [ ] Request indexing of `https://www.flexlab.co.in/` (homepage)
- [ ] Check **Coverage** tab after 48h for any crawl errors
- [ ] Check **Performance** → **Queries** after 7 days to see which Kota searches you're appearing for
- [ ] Set up **Google Alerts** for "instant printing kota" and "flex printing kota" to monitor competitors
