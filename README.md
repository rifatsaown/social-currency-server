# This is an Express Mongoose ts starter template

## To use this template, run the following command:

```bash
# Clone the repository
git clone git@github.com:Fabiolabsit/express-mongose-template.git

# Enter the directory
cd express-mongose-template

# Remove the git history
rm -rf .git

# create a .env file and add the following variables
MONGO_URI=mongodb://localhost:27017
DB_NAME=demo
NODE_ENV=development
# The following variables are optional and can be changed to your preference
BCRYPT_SALT_ROUNDS=10
ACCESS_TOKEN_SECRET=1234567890
ACCESS_TOKEN_EXPIRY=1h
REFRESH_TOKEN_SECRET=0987654321
REFRESH_TOKEN_EXPIRY=7d

# Install the dependencies
yarn install

# Start the server
yarn dev

# Open the browser and navigate to http://localhost:3000

```

## To update all the packages in this template, run the following command:

```bash
yarn upgrade-interactive --latest
```

## To update a specific package in this template, run the following command:

```bash
yarn upgrade <package-name>
```
