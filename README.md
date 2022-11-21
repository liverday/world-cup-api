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
- [x] Create an endpoint `/matches` that gives information about the next games
- [x] Create an endpoint `/teams` that gives information about all the teams that are participating in the cup.
- [x] Create an endpoint `/groups` that gives information about all the groups of the points stage.
- [x] Create a terraform infrastructure to deploy this project on AWS
- [x] Create a scrapper that get the score of the current match and the past matches, to consolidate the data.
- [ ] Create a job that consolidates group points based on matches
- [ ] Create a rate limiter to avoid flooding on the api.
- [ ] Write unit tests for the api.
- [ ] Write a `view` with the instructions to use the API and host it on `/` route.
- [ ] Integrate with swagger
- [ ] Write a github action that `test`, `build` and `deploy` this application to AWS
- [ ] Include queries search on the main find endpoints
