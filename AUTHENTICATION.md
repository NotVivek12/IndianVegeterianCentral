# 🔐 Authentication with Clerk

This app uses **Clerk** for secure, easy-to-use authentication with **custom UI pages**.

## ✨ Important: Custom Pages Configuration

This app uses **embedded Clerk components** on custom-designed pages, NOT Clerk's hosted pages.

### Why This Matters:
- ❌ **Wrong**: Redirecting to `https://faithful-garfish-26.accounts.dev/sign-in`
- ✅ **Correct**: Using custom `/login` and `/register` pages with embedded Clerk components

### Configuration Applied:
```tsx
// main.tsx - Tells Clerk to use your custom pages
<ClerkProvider 
  publishableKey={PUBLISHABLE_KEY}
  signInUrl="/login"        // Your custom login page
  signUpUrl="/register"     // Your custom register page
  afterSignOutUrl="/login"  // Redirect after sign out
>

// Login.tsx & Register.tsx - Use embedded components
<SignIn 
  signUpUrl="/register"
  forceRedirectUrl="/"       // Always redirect here after sign in
  fallbackRedirectUrl="/"    // Fallback redirect
/>
```

## 🎯 Features

- ✅ **Email/Password Authentication**
- ✅ **Social Login** (Google, GitHub, etc.)
- ✅ **Protected Routes** - All main pages require authentication
- ✅ **User Profile Management** - Built-in user button with profile/settings
- ✅ **Beautiful UI** - Custom styled to match app design

## 🚀 Setup

### 1. Environment Configuration

Add your Clerk publishable key to `.env`:

```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

Your Clerk Dashboard: https://faithful-garfish-26.clerk.accounts.dev

### 2. Pages Created

- **`/login`** - Sign in page with custom styling
- **`/register`** - Sign up page with benefits showcase
- **All other routes** - Protected, require authentication

### 3. User Flow

1. **New User**:
   - Visit any protected page → Redirected to `/login`
   - Click "Create one now" → `/register`
   - Complete signup → Redirected to home

2. **Existing User**:
   - Visit `/login`
   - Sign in with credentials or social provider
   - Access all app features

3. **Signed In**:
   - User profile button appears in top-right
   - Click to manage account, settings, or sign out
   - All pages accessible

## 🎨 Customization

### Login/Register Pages
- Located in `src/pages/Login.tsx` and `src/pages/Register.tsx`
- Match your app's green theme
- Custom Clerk appearance config applied

### User Button
- Added to `MainLayout.tsx` navigation
- Shows user avatar and dropdown menu
- Redirects to `/login` after sign out

## 🔧 Clerk Dashboard Configuration

**IMPORTANT**: Configure your Clerk application to use embedded components:

### In Clerk Dashboard (https://dashboard.clerk.com):

1. **Go to**: Your Application → Paths

2. **Set these URLs**:
   ```
   Home URL: http://localhost:5173
   Sign-in URL: /login
   Sign-up URL: /register
   ```

3. **Component Settings**:
   - ✅ Enable "Embedded components"
   - ❌ Disable "Hosted pages" (if you want to use custom pages only)

4. **Redirect URLs** (under "Redirects"):
   ```
   After sign in: /
   After sign up: /
   After sign out: /login
   ```

### Development vs Production:

**Development** (`http://localhost:5173`):
- Already configured above

**Production** (your deployed URL):
- Update all URLs to your production domain
- Example: `https://yourapp.com/login`

### Social Connections (Optional):
- Enable Google, GitHub, Facebook, etc.
- Configure OAuth credentials in Clerk Dashboard

### User Profile:
- Customize fields as needed
- Set required/optional information

## 📱 Protected Routes

All main app routes are protected:
- `/` - Home
- `/nearby` - Restaurant finder
- `/scan` - Barcode scanner
- `/cook` - Recipe generator
- `/countries` - Cuisine explorer
- `/place/:id` - Place details
- `/country/:code` - Country details

Public routes:
- `/login` - Sign in
- `/register` - Sign up

## 🧪 Testing

```bash
# Start dev server
npm run dev

# Visit http://localhost:5173
# You'll be redirected to /login
# Create an account or sign in
# Access all protected features
```

## 🛡️ Security

- ✅ All sensitive routes protected
- ✅ Automatic redirect for unauthenticated users
- ✅ Secure session management by Clerk
- ✅ HTTPS-only in production
- ✅ No password storage in your database

## 🎉 Benefits

- **Zero Configuration**: Works out of the box
- **Production Ready**: Enterprise-grade security
- **Beautiful UI**: Custom styled components
- **Developer Friendly**: Simple API, great docs
- **Free Tier**: Up to 10,000 monthly active users

---

**Questions?** Check the [Clerk Documentation](https://clerk.com/docs)
