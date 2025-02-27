# Flanksource Frontend

## Contributing

See [javascript style guide](https://github.com/flanksource/style-guide/blob/master/docs/front-end.md)

## Local Setup

1. Install [nvm](https://github.com/nvm-sh/nvm)
2. Run `nvm install` in the root directory of the repo, this will install the nodejs version needed for the front end setup. The version is set in `.nvmrc`
3. Run `npm install` this will install all dependencies
4. Create `.env.local file` and copy `.env` file content to `.env.local` file and set the flags values as mentioned below
    ```
    SKIP_PREFLIGHT_CHECK=true
    PORT=3004
    # ORY_KRATOS_URL=http://kratos.canary.lab.flanksource.com/
    # NEXT_PUBLIC_APP_DEPLOYMENT=CANARY_CHECKER
    NEXT_PUBLIC_WITHOUT_SESSION=false
    BACKEND_URL=https://incident-commander.canary.lab.flanksource.com/
    ENV=localhost

    ```
5. Run `npm run dev` to launch the front end application (note: api calls will be proxied to dev environment here).
6. If you don't have any account to login please create an account by going to the page [http://localhost:3000/registration](http://localhost:3000/registration).
7. If you have account login using that account by going to the page [http://localhost:3000/login](http://localhost:3000/login).


## Svg files

Run them through https://github.com/svg/svgo to make them compatible with react. 
See: https://stackoverflow.com/questions/59820954/syntaxerror-unknown-namespace-tags-are-not-supported-by-default

## Scripts
See [package.json](https://github.com/flanksource/flanksource-ui/blob/chore%2Fdeps-update-cleanup/package.json) scripts.
