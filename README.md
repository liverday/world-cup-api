# World Cup API

This is a not official REST API that provides information about the 2022 FIFA World Cup! It gathers information from public sources and scrap it in an organized way, making the implementation easier.

It's totally free, and open-source, so you can collaborate with us. See [CONTRIBUTING](CONTRIBUTING.md)

# Technologies

- Node.js (v18)
- Puppeteer
- PostgreSQL + Prisma
- Docker
- TypeScript
- Jest

# Roadmap

- [x] Create the database schema.
- [x] Create a initial scrapper that setup all games, teams and group informations.
- [ ] Create a terraform infrastructure to deploy this project on AWS
- [ ] Create a scrapper that get the score of the current match and the past matches, to consolidate the data.
- [ ] Create an endpoint `/games` that gives information about the next games
- [ ] Create an endpoint `/teams` that gives information about all the teams that are participating in the cup.
- [ ] Create an endpoint `/groups` that gives information about all the groups of the points stage.

