# ArvanEdge-Waiting-Room
Development code for ArvanEdge Waiting-Room - This code is experimental and should only be used for development purposes. Please note that after clonning this repository, you must also run the:

![image](https://github.com/astroadrenalin/arvanedge-waiting-room/assets/134690238/e9d92cdb-9482-4b2c-b633-f10824f7acbb)

TLDR; after cloning the above code, run the following command:

```
npm run build
```
then, deploy the project. This command must be run so all the non-existant packages and files are downloaded and ready.

You need at least version 20 on Node installed on the server that will build and deploy the code.



# Deployment with R1ec


First, you must install the R1ec tool:

```
npm install -g r1ec
```

Next, you must login to r1ec with your ArvanCloud machine user. 

```
r1ec login
```

**At the moment of writing, your machine user or API Key must have the "Workspace-Owner" role for the Edge Compute to work.**

At last, after you've built the code, you need to deploy it to Arvan Edge:

```
r1ec deploy <project-name> -f <file>
```

**ENJOY**
