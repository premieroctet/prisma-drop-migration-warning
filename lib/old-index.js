import * as core from '@actions/core';
import { Octokit } from '@octokit/action';
import { execSync } from 'node:child_process';
import fs from 'node:fs';
// Initialize Octokit for GitHub API
const octokit = new Octokit();
const [OWNER, REPOSITORY] = process.env.GITHUB_REPOSITORY.split('/');
// Function to get Pull Request number
function getPullRequestId() {
    const eventData = fs.readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8');
    const ev = JSON.parse(eventData);
    return ev.pull_request ? ev.pull_request.number : null;
}
// Function to detect table or column drops in migration
function detectTableOrColumnDrop(fileContent) {
    const dropRegex = /drop (table|column)/i;
    return dropRegex.test(fileContent);
}
// Function to ensure git command succeeds
function execGitCommand(command) {
    try {
        return execSync(command, { encoding: 'utf8' }).trim();
    }
    catch (error) {
        console.error(`Failed to execute git command: ${command}`);
        console.error(error);
        return '';
    }
}
// Function to get modified files in a PR
function getModifiedFiles() {
    try {
        // First ensure we have the latest main branch
        execGitCommand('git remote update origin');
        execGitCommand('git fetch origin main:main');
        const baseRef = process.env.GITHUB_BASE_REF || 'main';
        const prRef = process.env.GITHUB_SHA;
        console.log(`Base ref: ${baseRef}`);
        console.log(`PR SHA: ${prRef}`);
        // First try using the merge base
        const mergeBase = execGitCommand(`git merge-base origin/${baseRef} ${prRef}`);
        if (!mergeBase) {
            throw new Error('Could not find merge base');
        }
        console.log(`Merge base: ${mergeBase}`);
        console.log(`Running diff command: git diff --name-only ${mergeBase} ${prRef}`);
        // Get the list of modified files using merge-base
        const stdout = execGitCommand(`git diff --name-only ${mergeBase} ${prRef}`);
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
            if ('stderr' in error) {
                console.error('Git stderr:', error.stderr?.toString());
            }
        }
        return [];
    }
}
// Main action function
async function run() {
    try {
        // Get inputs
        const path = core.getInput('path');
        const message = core.getInput('message');
        const fail = core.getBooleanInput('fail');
        const warning = core.getBooleanInput('warning');
        // Get modified files
        const modifiedFiles = getModifiedFiles();
        console.log('Total modified files:', modifiedFiles.length);
        // Filter for Prisma migration files
        const migrationFiles = modifiedFiles.filter((file) => file.startsWith(path) && file.endsWith('.sql'));
        console.log('Migration files:', migrationFiles);
        let hasTableOrColumnDrop = false;
        // Check each migration file for drops
        for (const file of migrationFiles) {
            try {
                const fileContent = fs.readFileSync(file, 'utf8');
                if (detectTableOrColumnDrop(fileContent)) {
                    hasTableOrColumnDrop = true;
                    console.log(`Drop detected in file: ${file}`);
                    break;
                }
            }
            catch (error) {
                console.error(`Error reading file ${file}:`, error);
            }
        }
        if (hasTableOrColumnDrop) {
            core.warning('A table or column drop has been detected in the Prisma migration.');
            if (warning) {
                const pullRequestId = getPullRequestId();
                if (pullRequestId) {
                    // Post a comment on the Pull Request
                    await octokit.issues.createComment({
                        owner: OWNER,
                        repo: REPOSITORY,
                        issue_number: pullRequestId,
                        body: message,
                    });
                }
            }
            if (fail) {
                core.setFailed('Potentially unsafe Prisma migration detected.');
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
run();
