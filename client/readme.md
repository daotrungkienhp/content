Description

App is a client program for managing, editing content or doing something.

Note:
- Theme: for a channel or site, it is not for app.
- App: is a client program for managing, editing or do something.
- Block: is a web component, we can embed it to a site.


App structure:

```
- public/       <--- Root folder of the app
--- app.json    <--- Information of app                         [require]
--- index.html  <--- Main screen of app                         [require]

--- asset/      <--- Resource or libs from third party          [option]
--- blocks/     <--- Folder contains internal blocks of app     [option]
--- libs/       <--- Folder contains libs                       [option]
--- modules/    <--- Folder contains modules of app             [option]
--- models/     <--- Folder contains models for MVC app         [option]
--- controls/   <--- Folder contains controlers for MVC app     [option]
--- view/       <--- Folder contains view of app                [option]
```

Recommended: build one app for one device.

