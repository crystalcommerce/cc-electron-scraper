const fetch = require('node-fetch');
// const gitClone = require('git-clone/promise');
const cloneRepo = require("mnm-github-repo-downloader");
const path = require("path");
const { createDirPath, waitForCondition } = require('../../../utilities');

module.exports = async function(targetDirPath) {
    
    const repoUrl = process.env.GR_MNM_SCRAPER_UTILITIES_URL; // Replace with your GitHub repository URL
    const localPath = await createDirPath(path.join(targetDirPath, "modules", "utilities")); // Replace with the local directory where you want to clone the repository
    const token = process.env.GR_MNM_SCRAPER_UTILTIES_ACCESS_TOKEN; // Replace with your GitHub personal access token
    const repoOwner = process.env.GR_OWNER_NAME;
    const repoName = process.env.GR_REPO_NAME;
    const repoBranch = process.env.GR_REPO_BRANCH;

    try {
        // Fetch the repository details using the GitHub API with authentication
        const response = await fetch(`https://api.github.com/repos${new URL(repoUrl).pathname}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch repository: ${response.status} ${response.statusText}`);
        }

        const repoInfo = await response.json();

        const cloneUrl = repoInfo.clone_url;

        
        // Modify cloneUrl for HTTPS with the token
        // const httpsCloneUrl = cloneUrl.replace('https://', `https://${token}@`);

        console.log(cloneUrl);

        let repositoryCloned = false,
            timesTried = 0,
            cloningFailed = false;

        // Clone the repository to the specified local directory
        repositoryCloned = await cloneRepo({
            owner: repoOwner,
            repository: repoName,
            branch: repoBranch,
            outPath: localPath,
            headerOptions : {
                Authorization: `Bearer ${token}`,
            }
        })

        await waitForCondition({
            conditionCallback : () => repositoryCloned || cloningFailed,
            onTrueCallback : () => {
                if(repositoryCloned)    {
                    console.log("GHR Cloning Successful : Repository cloned")
                } else if(cloningFailed)  {
                    console.log("GHR Cloning Unsuccessful : Problem in Cloning the Repository")
                }
                
            },
            messageCallback : () => {
                console.log("cloning Repository");
                console.log(repositoryCloned);
                timesTried++;
                if(timesTried === 7)    {
                    cloningFailed = true;
                }
            }
        });



    } catch (error) {
        console.error('Error:', error.message);
    }
    
}