# Public backend setup (Render)

ஆம், மற்றவர்கள் internet-லிருந்து பயன்படுத்த வேண்டுமெனில் backend-ஐ public host-ல் deploy செய்ய வேண்டும். இந்த repo-வில் `render.yaml` சேர்க்கப்பட்டுள்ளது; Render-க்கு repo-ஐ இணைத்தால் Node API service-ஐ உருவாக்க அது பயன்படுத்தும்.

## Deploy செய்ய வேண்டிய படிகள்

1. இந்த branch-ஐ (`copilot/full-backend`) `main` branch-ல் merge செய்யுங்கள். அல்லது Render-ல் இந்த branch-ஐ நேரடியாகத் தேர்வு செய்யுங்கள்.
2. https://render.com சென்று account உருவாக்கி GitHub-ஐ connect செய்யுங்கள்.
3. Render Dashboard → **New** → **Blueprint** தேர்வு செய்து `suji436/paypal-hackathon` repository-ஐ இணைக்கவும்.
4. Render `render.yaml`-ஐக் கண்டுபிடிக்கும். **Apply** அழுத்தி deploy செய்யுங்கள்.
5. Deploy முடிந்ததும் Render உங்களுக்கு `https://<service-name>.onrender.com` போன்ற public URL தரும். Health check link: `https://<உங்கள்-Render-URL>/api/health`.

Public URL-ஐ இந்த repository-யில் இருந்து நான் உருவாக்க முடியாது; hosting account-ஐ உரிமையாளர் connect செய்து deploy செய்ய வேண்டும். Deploy ஆனதும் Render தரும் URL-ஐ `VITE_API_BASE_URL` ஆக frontend build settings-ல் அமைத்து frontend-ஐ மறுபடியும் deploy செய்யுங்கள். `.env.example`-ல் தேவையான variable காட்டப்பட்டுள்ளது.

## Local test

```bash
npm install
npm run start
```

பிறகு `http://localhost:4000/api/health` திறக்கவும்.

## Demo-only warning

இந்த backend இப்போது JSON file storage மற்றும் demo accounts/password-களைப் பயன்படுத்துகிறது; production-grade authentication/database இல்லை. Render free service-ன் local files persistent storage என உறுதி இல்லை. உண்மையான customers/payments அல்லது sensitive data பயன்படுத்துவதற்கு முன் PostgreSQL, secure password hashing, real authentication/authorization, rate limits, restricted CORS மற்றும் persistent storage சேர்க்க வேண்டும். தற்போது checkout Cash on Delivery demo மட்டுமே.
