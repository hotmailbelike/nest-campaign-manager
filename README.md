## Description

Backend for the [Next Campaign Manager](https://github.com/hotmailbelike/next-campaign-manager)
Built using Nest.js + Prisma + MongoDB

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hotmailbelike/nest-campaign-manager.git
cd nest-campaign-manager
```

2. Install the dependencies:
```bash
npm install
```

## Setting Up
1. Copy the `.env.template` to `.env` and fill in the required environment variables:
```bash
cp .env.template .env
```
2. Fill in the `.env` file with your configuration:
```bash
PORT=8000
MONGO_URI=<your-mongodb-uri>
```

## (Optional) Seeding
1. If you do not want to create campaign data manually, run the following script command:
```bash
npm run seed
```


## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev
```

## APIs:

- Campaigns:
  - `POST /campaigns`: Create a new campaign
  - `GET /campaigns`: Get a list of campaigns with pagination
  - `GET /campaigns/:id`: Get a specific campaign by ID
  - `PUT /campaigns/:id`: Update a campaign by ID
  - `DELETE /campaigns/:id`: Delete a campaign by ID
  - `GET /campaigns/names/distinct`: Get distinct campaign names
  - `GET /campaigns/search/filters`: Search campaigns by filters

## Next steps
**[Setup the Next.js Frontend app](https://github.com/hotmailbelike/next-campaign-manager)**

