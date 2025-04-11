

# Dominity Router

The Dominity Router is a declarative, DOM-first router for single-page applications built with Dominity. It supports dynamic, lazy-loaded components and route-level layouts with minimal overhead and full DOM control.

---


## Basic Setup

### 1. Create the Router

```js
import { DominityRouter, lazy } from "dominity";

const router = new DominityRouter();
```

### 2. Define Routes with `getComponent`

```js
router.setRoutes({
  "/home": {
    getComponent: lazy("./pages/home.js")
  },
  "/about": {
    getComponent: lazy("./pages/about.js"),
    layout(component) {
      return div("About Page Layout: ", component);
    },
    onLoad(el) {
      console.log("About page mounted", el);
    }
  }
});
```

### 3. Start the Router

```js
router.start(document.body);
```

You can pass either a DOM element or a `DominityElement`.

---

## Routing Methods

```js
router.routeTo("/about");        // Push navigation
router.replaceRoute("/home");    // Replace current route
router.revalidateRoute();        // Re-run current route logic
```

---

## Navigation Links

Use `router.Link()` to render anchor-like elements that use SPA-style navigation.

```js
router.Link({ href: "/about" }, "Go to About");
```

To replace the route instead of pushing:

```js
router.Link({ href: "/home", replace: true }, "Home");
```

### Example: Link inside a page component

```js
// ./pages/home.js
export default function (r) {
  return div(
    h1("Welcome to Home"),
    r.Link({ href: "/about" }, "About Page")
  );
}
```
all pages are given with a parameter r which they can use to access router's methods and properties.

---

## Accessing Query Parameters

```js
const queries = router.queries;
console.log(queries.page); // For example, ?page=2 => "2"
```
you can access a query from within a page component like this:

```js   
// ./pages/home.js  

export default function (r) {
  const page = r.queries.page;
  return div(
    h1("Welcome to Home"),
    r.Link({ href: "/about" }, "About Page"),
    p(`Current page: ${page}`)
  );
}
```



---

## Lazy Loading with `lazy()`

Use `lazy()` to dynamically import route components:

```js
import { lazy } from "dominity";

router.setRoutes({
  "/profile": {
    getComponent: lazy("./pages/profile.js"),
    layout(component) {
      return div("User Layout", component);
    },
    onLoad(el) {
      console.log("Profile page ready");
    }
  }
});
```

The module should export a default function returning a `DominityElement`.

```js
// ./pages/profile.js
export default function () {
  return div("This is your profile.");
}
```

---

## Default Routing

Redirect to your default route manually if the current path is `/`:

```js
if (window.location.pathname === "/") {
  router.routeTo("/home");
}
```

```js
const router = new DominityRouter();

router.setRoutes({
  "/home": {
    getComponent: lazy("./pages/home.js")
  },
  "/about": {
    getComponent: lazy("./pages/about.js"),
    onLoad(el) {
      console.log("About mounted");
    }
  }
});

router.start(document.getElementById("app"));

if (window.location.pathname === "/") {
  router.routeTo("/home");
}
```
## Deployment Configuration
When deploying a single-page application (SPA) like Dominity, you need to ensure that all routes are served by your `index.html` file. This is crucial for client-side routing to work correctly.



### Vercel

Create a `vercel.json` file in your project root:

```json
// filepath: /home/atoms/programming/web/dominity-docs-v2/vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify

Create a `netlify.toml` file in your project root:

```toml
// filepath: /home/atoms/programming/web/dominity-docs-v2/netlify.toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Apache (.htaccess)

If you're using Apache, create a `.htaccess` file:

```apache
// filepath: /home/atoms/programming/web/dominity-docs-v2/public/.htaccess
RewriteEngine On
RewriteBase /
RewriteRule ^index\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

### Nginx

If using Nginx, add this to your server configuration:

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

> **Note:** These configurations ensure that your SPA's client-side routing works correctly by redirecting all requests to your index.html file, allowing your router to handle the routing internally.