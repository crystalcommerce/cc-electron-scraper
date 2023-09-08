const fetch = require('node-fetch');
const gitClone = require('git-clone/promise');
const path = require("path");
const { createDirPath } = require('../../../utilities');

module.exports = async function(targetDirPath) {
    
    const repoUrl = process.env.GR_MNM_SCRAPER_UTILITIES_URL; // Replace with your GitHub repository URL
    const localPath = await createDirPath(path.join(targetDirPath, "modules", "utilities")); // Replace with the local directory where you want to clone the repository
    const token = process.env.GR_MNM_SCRAPER_UTILTIES_ACCESS_TOKEN; // Replace with your GitHub personal access token

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

        // Clone the repository to the specified local directory
        await gitClone(cloneUrl, localPath);

        // await new Promise((resolve, reject) => {

        //     let interval = setInterval(() => {

        //     }, 100);


        // });


    } catch (error) {
        console.error('Error:', error.message);
    }
    
}