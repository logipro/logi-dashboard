---
title: Fullstack React Material Dashboard
published: false
description:
tags: React, material-ui, nodejs, sqlite, nodejs, typescript
---

#A fullstack React Material-UI dashboard
![](https://thepracticaldev.s3.amazonaws.com/i/bsl2i3liq302bklsyao9.png)

## What is it?!

A **Work In Progress** fullstack micro framework (is framework the right word?!) which will give you basic authorization, authentication, routing and some general functionalities out of the box. So you can concentrate on developing your Apps and widgets and deliver them to your end users.

##Main features

- Add/disable users, change users password, give/take Roles to users
- Add/Remove Roles with access to different sets of apps and widgets
- Create Widgets and add them to the framework to be shown on the dashboard (Maybe share the nice ones😀)
- Create Apps (React components)
- Have Public Apps and Widgets (No need for login to see these)
- Each user can save his/her dashboard layout
- Lazy loading of apps using react.lazy and suspense. Apps will only be loaded for users who have access to them.

## What has been used?

**Frontend:**
[Reactjs](https://reactjs.org/)
[Material-UI](https://material-ui.com/)
[React-Router](https://reacttraining.com/react-router/) for dynamic routing magic happening client side
[TypeScript](https://typescriptlang.org) not 100% typescript as you will see some js files and a lot of js code but on it's way there!
[logi-table](https://github.com/logipro/logi-dashboard/tree/master/src/framework/Components/logi-table): We looked for a good Material table and failed to find one that had everything I needed! So decided to develop my own. This table component lacks a lot of features at the moment and that's why it's not a npm package yet. Maybe one day when it covers more and is tested better we will publish this as it's own package, For now it will stay in a separate folder inside the dashboard!

**Backend:**
[Nodejs](https://nodejs.org)
[Express](https://expressjs.com/)
[Passport](http://www.passportjs.org/) for authenticating together with express-jwt for giving tokens to logged in users and guests
[Sqlite](https://www.sqlite.org/index.html) to be free from any DBMS installation we decided to use sqlite. of course for your app you can add connections to any other databases for the main business whilst the framework related persistence like Users, Roles, Apps,... are using the sqlite.

## How do I add a new app?

A. Any react component can be an app and Logi-dashboard will load them for users with access. for an example look at [User.tsx](https://github.com/logipro/logi-dashboard/blob/master/src/framework/Administration/Users.tsx) which is the app that manages the users.
B. Add your App from Administartion/Apps management
![](https://thepracticaldev.s3.amazonaws.com/i/g93qxy3vzzelp4ou221z.png)
You have to set the following for each app:
**Application**:Name of the App to be shown in the sidebar
**ParentID**:If you want your App to be shown under a group set this
**RouteName**:Set the relative Route for this App, Logi-dashboard will use this to load your component
**Component**:Relative path to App's component (relative from App.tsx)
**Props**:Send props to the app from here, for example let's say I want to have two different versions of _Users_ app one readonly and the other one full access. I create the same App twice in this table and set Props for one of them to {"Readonly":"true"} then the users.tsx can check for this at load and perform the required operations (in this case hide edit icons)
**IsPublic**: set it to true if you want your app to be available before login. Dashboard must stay public
**Icon** A (material UI icon)[https://material.io/tools/icons/] to be shown in the sidebar.
