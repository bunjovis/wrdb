# wrdb - wine recipe database

A database for homewines.

## Description

This is a web application built for storing homewine recipes. The backend uses [node.js](https://nodejs.org/en/), [Express](https://expressjs.com/) and [mongoose](https://mongoosejs.com/). The frontend is made with [React](https://reactjs.org/), [Redux](https://redux.js.org/) and [Material-UI](https://material-ui.com/). Full listing of used libraries can be seen in package.json.

This application was made as a course assignment, but the work goes on after I deliver this to the teacher. Some planned features had to be dropped from this because my original timetable didn't work out as I thought it would.

I've deployed a live demo to [heroku](https://heroku.com). You can access it [here](https://fathomless-garden-01652.herokuapp.com/) (user: admin@admin.fi/Admin#1). I'm using free tier Heroku only, so please allow it a moment to load. Everything should work here except the label editor saving and winery logo uploading.

## Installation

Pre-requisites:
- node
- mongodb (configured to not require any user)

Instructions:
1. Clone this repository
2. Run command: yarn install
3. Edit .env.example to fit your environment and rename it .env
4. To start in development mode: HOST=localhost yarn run dev
5. To start in production mode: yarn start
6. Head to [localhost:3000](http://localhost:3000) to use the application

## Features

- Add, edit, delete and list wines
- Wine label editor
- Add, edit and list ingredients
- Settings: language, dark mode, winery logo
- Internalization: finnish and english translations
- Keyboard shortcuts: press F1 to add new wine, press F2 to add new ingredient

## Planned features

- Users overhaul: at the moment it doesn't really matter which user you're logged in as. Users should have their own settings, own wines, named comments, etc...
- Bottled wines: add winebottles to different storages and keep track of your bottled wines and their aging. Also you could add picture of a bottled wine in glass or bottle.
- Enable deleting ingredients: it is disabled at the moment, because there should be checking that no wine uses an ingredient before deleting, and I don't have time to implement that.
- Printable recipes
- More content to homepage
- Searching wines and ingredients
- Rating wines