# Backend Deployment Instructions

## Quick Fix for CORS Error

The CORS error is caused by the backend server not allowing requests from your Netlify domain.

### Immediate Solution:
1. **Deploy the updated backend** - The `my-app/server/index.js` file has been fixed
2. **Commit and push changes**:
   ```bash
   git add my-app/server/index.js
   git commit -m "Fix CORS for Netlify domain"
   git push
   ```

### What Was Fixed:
- Changed CORS origin from `https://yourdomain.com` to `https://betterchoicelive.netlify.app`
- Added proper CORS headers and methods
- Added logging for debugging

### After Deployment:
- CORS errors will disappear
- Subscription functionality will work
- API calls will succeed

The backend will automatically redeploy on Render when you push the changes.
