# Getting Started


## using CDN 
Dominity can be used without installation by using cdn from `esm.sh` 

```html
<script type="module">
import d from 'https://esm.sh/dominity@latest';

d.span('hello world').addTo(document.body);
</script>
```
add this script tag to your html body and start using it like this you can also do imports from another file
dominity works without a build step if you are using it this way

### minimal template to start 
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    

<script type="module">
import d from 'https://esm.sh/dominity@latest';

function App(){
    return d.div(
        d.h1('Hello World'),
        d.p('This is a simple example of using Dominity with CDN.')
    )
}


App().addTo(document.body);
</script>
</body>
</html>
```
if you can see the hello world message then you are good to go

## Installation
you cna install Dominity using npm pnpm or yarn. Dominity is a lightweight framework for building modern web applications with a focus on simplicity and performance ,it works best when coupled with a build tool like Vite or Webpack.

```bash
npm install dominity
```

Or using yarn:

```bash
yarn add dominity
```

## create-dominity-app 

create a new Dominity project using the `create-dominity-app` CLI tool. This tool sets up a new project with a basic structure and configuration. it uses vite under the hood for seamless HMR and fast builds.

```bash
npx create-dominity-app
```
