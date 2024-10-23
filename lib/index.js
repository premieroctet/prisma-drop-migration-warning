import * as core from '@actions/core';
import { checkForDropsInMigrationsFiles, detectDropPrisma, getModifiedFiles, getOctokitClient, warnWithCommentOnPR, } from './utils.js';
// Main action function
async function run() {
    try {
        // Initialize Octokit for GitHub API
        const octokit = getOctokitClient();
        // Get inputs
        const path = core.getInput('path');
        const message = core.getInput('message');
        const warning = core.getBooleanInput('warning');
        // Get modified files
        const modifiedFiles = getModifiedFiles();
        console.log('Total modified files:', modifiedFiles.length);
        // Filter for Prisma migration files
        // Path may have ./ prefix, so remove it if present (in the beginning)
        const cleanPath = path.replace(/^.\//, '');
        const migrationFiles = modifiedFiles.filter((file) => file.startsWith(cleanPath) && file.endsWith('.sql'));
        console.log('Modified migration files:', migrationFiles);
        const hasTableOrColumnDrop = checkForDropsInMigrationsFiles(migrationFiles, detectDropPrisma);
        if (hasTableOrColumnDrop) {
            core.warning('A table or column drop has been detected in the Prisma migration.');
            if (warning) {
                await warnWithCommentOnPR(octokit, message);
            }
        }
        else {
            core.info('No table or column drop detected in the Prisma migration.');
        }
        // Output the list of modified files
        core.setOutput('modified_files', modifiedFiles);
        core.setOutput('migration_files', migrationFiles);
    }
    catch (error) {
        if (error instanceof Error) {
            core.setFailed(error.message);
        }
    }
}
await run().catch(() => {
    console.error('Error executing the action');
    process.exit(1);
});
