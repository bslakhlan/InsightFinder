
    ## Project: App Name Whatever

    ### Installation

    - Add .env.dev OR .env.prod file to the root folder. Open [Environment Vars](./env.md) to view all required variables.
    - Install all dependencies using `npm i`

    ### Run

    There are 3 ways to run the application. Use method 3 for development

    1. Changes are watched [Run Build & Start]

    ```
    npm run start:dev
    ```
    OR
    ```
    npm run start:prod
    ```

    2. Changes are not watched [Run without build]

    ```
    npx tsx src/index.ts
    ```
    
