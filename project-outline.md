# Lighthouse Buy/Sell

## Meetings with instructor
- 

## Reports
- Final Presentation May6 
- we need to present 2 reports per week

## Assigned tasks:
### tasks
- deadline date Apr26 Wed 5:30(BC) 6:30(AB)

### Denny
- create html pages (some of these html pahes might end up being appended through js, but have it in seperate html file for bata version)
### Daniel
- setup rout handlers

### Mike
- setup database(schema and seeds) and query functions

## Outline:

### ERD (https://app.diagrams.net/#G1SkEcRpwz--zQMCW7ewoYqr6GPcyFfO6P)
- users
- listings
- messages
- favorites
- immages

### Urls:
- logged in never refresh
- login page

### Users:
- navbar header 
    - header.ejs
- users can see featured items on a main feed 
    - "/"
    - this should be the home page 
- users can filter items by price
    - search page
    - not searchable for bata version
- users can favorite items to check up on them later
    - have only a button(doesn't do anything) for bata version 
- users can send messages to the user that is listing the item
    - collapsable text box for each posting for bata version

### Admins:
- post items, which can be seen by others
    - create new item page (just the page it doesnt actually create a new item for bata version)
- remove items from the site
    - have a delete button for each new listing(no action for bata version)
- mark items as SOLD!
    - have a button for this (no action for bata version)
- send a message via app, email, or text back on negotiations in buying the said item
    - ask an instructor how this should be layed out

### General Requirements
- ES6 (NodeJS) for server side
- Express(RESTful routs)
- CSS framework
- jQuery
-A CSS preprocessor such as SASS, Stylus, or PostCSS for styling -- or CSS Custom properties and no CSS preprocessor
- PostgreSQL and pg(pool)
