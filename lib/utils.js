import { Octokit } from '@octokit/action';
import fs from 'fs';
import { execSync } from 'node:child_process';
/**
 * Get the Pull Request event data from the event
 * @returns {PullRequestEvent} The Pull Request event data
 */
export function getPREventData() {
    try {
        const eventData = fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8');
        return JSON.parse(eventData);
    }
    catch (error) {
        throw new Error(`Failed to read or parse the event data: ${error.message}`);
    }
}
/**
 * Check if the file content contains a drop table or column statement
 * @param fileContent the content of the file to check
 * @returns {boolean} true if the file contains a drop table or column statement, false otherwise
 */
export function detectDropPrisma(fileContent) {
    const dropRegex = /drop (table|column)/i;
    return dropRegex.test(fileContent);
}
export function getOctokitClient() {
    return new Octokit({
        auth: process.env.GITHUB_TOKEN,
    });
}
export function getModifiedFiles() {
    try {
        const prEvent = getPREventData();
        const baseSha = prEvent.pull_request.base.sha;
        const headSha = prEvent.pull_request.head.sha;
        console.log(`Base SHA: ${baseSha}`);
        console.log(`Head SHA: ${headSha}`);
        // Get the list of modified files using direct SHA comparison
        const stdout = execSync(`git diff --name-only ${baseSha}..${headSha}`, {
            encoding: 'utf8',
        }).trim();
        // Handle empty diff case
        if (!stdout) {
            console.log('No modified files found');
            return [];
        }
        const files = stdout.split('\n');
        console.log('Modified files:', files);
        return files;
    }
    catch (error) {
        console.error('Error in getModifiedFiles:', error);
        if (error instanceof Error) {
            console.error('Error details:', error.message);
            // Check if error is a GitError
            const gitError = error; // Narrow down the type
            if (gitError.stderr) {
                console.error('Git stderr:', gitError.stderr.toString());
            }
        }
        return [];
    }
}
/**
 * Function to check if a table or column drop is detected in any of the migration files
 * @param migrationFiles - Array of migration files paths
 * @param detectTableOrColumnDrop - Function to detect table or column drop in a file. Callback that takes the file content as an argument and returns a boolean
 * @returns {boolean} true if a table or column drop is detected in any of the migration files, false otherwise
 */
export function checkForDropsInMigrationsFiles(migrationFiles, detectTableOrColumnDrop) {
    let hasTableOrColumnDrop = false;
    // Check each migration file for drops
    for (const file of migrationFiles) {
        try {
            const fileContent = fs.readFileSync(file, 'utf8');
            console.log(`Reading file: ${file}`);
            // Check if the file content has a table or column drop
            if (detectTableOrColumnDrop(fileContent)) {
                hasTableOrColumnDrop = true;
                break; // Exit the loop if a drop is detected
            }
        }
        catch (error) {
            console.error(`Error reading file ${file}:`, error);
        }
    }
    return hasTableOrColumnDrop; // Return the result
}
export function getPullRequestNumber() {
    const prEvent = getPREventData();
    return prEvent.pull_request.number;
}
export async function warnWithCommentOnPR(octokit, message) {
    const [owner, repo] = process.env.GITHUB_REPOSITORY.split('/');
    const pullRequestId = getPullRequestNumber();
    await octokit.issues.createComment({
        owner,
        repo,
        issue_number: pullRequestId,
        body: message,
    });
}
