const axios = require('axios');
const fs = require('fs');



class ComprehensiveGithubAnalyzer {
    constructor(urls) {
        this.urls = urls;
        this.api = axios.create({
            baseURL: 'https://api.github.com',
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        });
    }

    parseGithubUrl(url) {
        url = url.replace(/\/$/, '');
        const githubRegex = /github\.com\/([^\/]+)\/([^\/]+)/;
        const match = url.match(githubRegex);
        return match ? { owner: match[1], repo: match[2].replace('.git', '') } : null;
    }

   // Main Analysis
   async analyzeRepository(url) {
    const repoInfo = this.parseGithubUrl(url);
    if (!repoInfo) return null;

    const { owner, repo } = repoInfo;
    console.log(`\nAnalyzing repository: ${owner}/${repo}\n`);

    try {
        const [
            repositoryAnalytics,
            qualityMetrics,
            teamPerformance,
            dependencyAnalysis,
            issueManagement,
            pullRequestAnalysis,
            releaseManagement,
            cicdCheck
        ] = await Promise.all([
            this.repositoryAnalytics(owner, repo),
            this.qualityMetrics(owner, repo),
            this.teamPerformance(owner, repo),
            this.dependencyAnalysis(owner, repo),
            this.issueManagement(owner, repo),
            this.pullRequestAnalysis(owner, repo),
            this.releaseManagement(owner, repo),
            this.cicdCheck(owner, repo)
        ]);

        const analysis = {
            repositoryAnalytics,
            qualityMetrics,
            teamPerformance,
            dependencyAnalysis,
            issueManagement,
            pullRequestAnalysis,
            releaseManagement,
            cicdCheck
        };

        this.formatOutput(analysis);
        return analysis;
    } catch (error) {
        console.error('Error during repository analysis:', error.message);
        return null;
    }
}

async analyzeAll() {
    for (const url of this.urls) {
        await this.analyzeRepository(url);
    }
}


 // New Feature: Dependency Analysis
 async dependencyAnalysis(owner, repo) {
    try {
        const packageFiles = ['/package.json', '/requirements.txt'];
        const dependencies = [];

        for (const file of packageFiles) {
            try {
                const response = await this.api.get(`/repos/${owner}/${repo}/contents${file}`);
                const content = Buffer.from(response.data.content, 'base64').toString();
                dependencies.push({ file, content });
            } catch (error) {
                // Skip if file is not found
            }
        }

        return dependencies.length > 0 ? dependencies : 'No dependency files found';
    } catch (error) {
        console.error('Error in dependency analysis:', error.message);
        return {};
    }
}

// New Feature: Issue Management Analysis
async issueManagement(owner, repo) {
    try {
        const issues = await this.api.get(`/repos/${owner}/${repo}/issues?state=all&per_page=100`);
        const openIssues = issues.data.filter(issue => issue.state === 'open').length;
        const closedIssues = issues.data.filter(issue => issue.state === 'closed').length;
        const averageTimeToClose = this.calculateAverageTimeToClose(issues.data);

        return {
            openIssues,
            closedIssues,
            averageTimeToClose
        };
    } catch (error) {
        console.error('Error in issue management analysis:', error.message);
        return {};
    }
}

calculateAverageTimeToClose(issues) {
    const closedIssues = issues.filter(issue => issue.state === 'closed' && issue.closed_at);
    const totalCloseTime = closedIssues.reduce((acc, issue) => acc + (new Date(issue.closed_at) - new Date(issue.created_at)), 0);
    return closedIssues.length > 0 ? (totalCloseTime / closedIssues.length / (1000 * 60 * 60 * 24)).toFixed(2) + ' days' : 'N/A';
}

// New Feature: Pull Request Analysis
async pullRequestAnalysis(owner, repo) {
    try {
        const pulls = await this.api.get(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`);
        const openPRs = pulls.data.filter(pr => pr.state === 'open').length;
        const mergedPRs = pulls.data.filter(pr => pr.merged_at).length;
        const averageTimeToMerge = this.calculateAverageTimeToMerge(pulls.data);

        return {
            openPRs,
            mergedPRs,
            averageTimeToMerge
        };
    } catch (error) {
        console.error('Error in pull request analysis:', error.message);
        return {};
    }
}

calculateAverageTimeToMerge(pulls) {
    const mergedPRs = pulls.filter(pr => pr.merged_at);
    const totalMergeTime = mergedPRs.reduce((acc, pr) => acc + (new Date(pr.merged_at) - new Date(pr.created_at)), 0);
    return mergedPRs.length > 0 ? (totalMergeTime / mergedPRs.length / (1000 * 60 * 60 * 24)).toFixed(2) + ' days' : 'N/A';
}

// New Feature: Release Management Analysis
async releaseManagement(owner, repo) {
    try {
        const releases = await this.api.get(`/repos/${owner}/${repo}/releases`);
        const releaseFrequency = releases.data.length;

        return {
            totalReleases: releaseFrequency,
            latestRelease: releases.data[0]?.tag_name || 'No releases'
        };
    } catch (error) {
        console.error('Error in release management analysis:', error.message);
        return {};
    }
}

// New Feature: CI/CD Check
async cicdCheck(owner, repo) {
    try {
        const workflows = await this.api.get(`/repos/${owner}/${repo}/actions/workflows`);
        const cicdConfigured = workflows.data.total_count > 0;
        return {
            cicdConfigured,
            workflows: workflows.data.workflows.map(workflow => ({ name: workflow.name, status: workflow.state }))
        };
    } catch (error) {
        console.error('Error in CI/CD check:', error.message);
        return { cicdConfigured: false };
    }
}

    // Repository Analytics
    async repositoryAnalytics(owner, repo) {
        try {
            const [commits, files, license, repoData, securityAlerts] = await Promise.all([
                this.api.get(`/repos/${owner}/${repo}/commits?per_page=100`),
                this.api.get(`/repos/${owner}/${repo}/git/trees/main?recursive=1`).catch(() =>
                    this.api.get(`/repos/${owner}/${repo}/git/trees/master?recursive=1`)
                ),
                this.api.get(`/repos/${owner}/${repo}/license`).catch(() => null),
                this.api.get(`/repos/${owner}/${repo}`),
                this.getSecurityAlerts(owner, repo)
            ]);

            const commitFrequency = this.detailedCommitFrequency(commits.data);
            const codeChurn = this.detailedCodeChurn(commits.data);
            const envLeaks = files.data.tree.some(file => file.path.includes('.env'));
            const forkStars = {
                forks: repoData.data.forks_count,
                stars: repoData.data.stargazers_count,
                watchers: repoData.data.watchers_count
            };

            return {
                commitFrequency,
                codeChurn,
                envLeaks: envLeaks ? '⚠️ .env file detected (potential security risk)' : '✅ No .env file detected',
                license: license?.data?.license?.name || 'No license detected',
                forkStars,
                securityAlerts
            };
        } catch (error) {
            console.error('Error in repository analytics:', error.message);
            return {};
        }
    }

    async getSecurityAlerts(owner, repo) {
        try {
            const response = await this.api.get(`/repos/${owner}/${repo}/vulnerability-alerts`, {
                headers: { Accept: 'application/vnd.github.dorian-preview+json' }
            });
            return response.data || [];
        } catch (error) {
            return [];
        }
    }

    detailedCommitFrequency(commits) {
        const hours = commits.map(commit => new Date(commit.commit.author.date).getHours());
        const days = commits.map(commit => new Date(commit.commit.author.date).getDay());

        const hourlyFrequency = Array(24).fill(0);
        const dailyFrequency = Array(7).fill(0);

        hours.forEach(hour => hourlyFrequency[hour]++);
        days.forEach(day => dailyFrequency[day]++);

        return {
            hourlyFrequency,
            dailyFrequency,
            peakHour: hourlyFrequency.indexOf(Math.max(...hourlyFrequency)),
            peakDay: dailyFrequency.indexOf(Math.max(...dailyFrequency))
        };
    }

    detailedCodeChurn(commits) {
        let totalAdditions = 0, totalDeletions = 0, commitChanges = [];

        commits.forEach(commit => {
            if (commit.stats) {
                totalAdditions += commit.stats.additions;
                totalDeletions += commit.stats.deletions;
                commitChanges.push({
                    sha: commit.sha,
                    additions: commit.stats.additions,
                    deletions: commit.stats.deletions
                });
            }
        });

        return {
            totalAdditions,
            totalDeletions,
            netChange: totalAdditions - totalDeletions,
            averageChangePerCommit: ((totalAdditions + totalDeletions) / commits.length).toFixed(2),
            commitChanges
        };
    }

    // Quality Metrics
    async qualityMetrics(owner, repo) {
        try {
            const files = await this.api.get(`/repos/${owner}/${repo}/git/trees/main?recursive=1`).catch(() =>
                this.api.get(`/repos/${owner}/${repo}/git/trees/master?recursive=1`)
            );

            const filePaths = files.data.tree.map(file => file.path);

            const codeDuplication = this.detailedDuplication(filePaths);
            const testCoverage = this.detailedTestCoverage(filePaths);
            const docCoverage = this.detailedDocCoverage(filePaths);
            const lintIssues = this.detailedLintIssues(filePaths);
            const unusedCode = this.detailedUnusedCode(filePaths);
            const codeComplexity = await this.detailedCodeComplexity(owner, repo);

            return {
                codeDuplication,
                testCoverage,
                docCoverage,
                lintIssues,
                unusedCode,
                codeComplexity
            };
        } catch (error) {
            console.error('Error in quality metrics:', error.message);
            return {};
        }
    }

    detailedDuplication(files) {
        const seenFiles = new Map();
        const duplicateFiles = [];
        files.forEach(file => {
            const fileName = file.split('/').pop();
            if (seenFiles.has(fileName)) duplicateFiles.push(fileName);
            else seenFiles.set(fileName, true);
        });
        return {
            totalDuplicates: duplicateFiles.length,
            duplicates: duplicateFiles
        };
    }

    detailedTestCoverage(files) {
        const testFiles = files.filter(file => file.includes('.test.') || file.includes('.spec.'));
        const sourceFiles = files.filter(file => file.endsWith('.js') || file.endsWith('.py'));

        const coverage = ((testFiles.length / sourceFiles.length) * 100).toFixed(2);

        return {
            testFilesCount: testFiles.length,
            sourceFilesCount: sourceFiles.length,
            coverage: `${coverage}%`
        };
    }

    detailedDocCoverage(files) {
        const docFiles = files.filter(file => file.endsWith('.md') || file.includes('docs'));
        const coverage = ((docFiles.length / files.length) * 100).toFixed(2);
        return {
            docFilesCount: docFiles.length,
            totalFiles: files.length,
            coverage: `${coverage}%`
        };
    }

    detailedLintIssues(files) {
        const lintConfigs = ['.eslintrc', '.prettierrc', '.stylelintrc'];
        const foundConfigs = lintConfigs.filter(config => files.includes(config));
        return {
            hasLintConfig: foundConfigs.length > 0,
            foundConfigs
        };
    }

    detailedUnusedCode(files) {
        const unusedExtensions = ['.tmp', '.bak', '.old'];
        const unusedFiles = files.filter(file => unusedExtensions.some(ext => file.endsWith(ext)));
        return {
            totalUnusedFiles: unusedFiles.length,
            unusedFiles
        };
    }

    async detailedCodeComplexity(owner, repo) {
        // Placeholder for analyzing complexity; replace with actual logic
        return {
            averageComplexity: Math.random() * 10, // Simulating average complexity
            details: 'Placeholder for actual complexity analysis'
        };
    }

    // Team Performance
    async teamPerformance(owner, repo) {
        try {
            const [pulls, issues, contributors] = await Promise.all([
                this.api.get(`/repos/${owner}/${repo}/pulls?state=all&per_page=100`),
                this.api.get(`/repos/${owner}/${repo}/issues?state=all&per_page=100`),
                this.api.get(`/repos/${owner}/${repo}/contributors?per_page=100`)
            ]);

            const developerProductivity = this.detailedContributorProductivity(contributors.data);
            const reviewEfficiency = this.detailedReviewEfficiency(pulls.data);
            const bugFixFrequency = this.detailedBugFixFrequency(issues.data);

            return {
                developerProductivity,
                reviewEfficiency,
                bugFixFrequency
            };
        } catch (error) {
            console.error('Error in team performance:', error.message);
            return {};
        }
    }

    detailedContributorProductivity(contributors) {
        return contributors.map(c => ({
            username: c.login,
            contributions: c.contributions,
            active: c.contributions > 0
        }));
    }

    detailedReviewEfficiency(pulls) {
        const reviewedPRs = pulls.filter(pr => pr.review_comments > 0);
        return {
            totalPRs: pulls.length,
            reviewedPRs: reviewedPRs.length,
            reviewRate: `${((reviewedPRs.length / pulls.length) * 100).toFixed(2)}%`
        };
    }

    detailedBugFixFrequency(issues) {
        const bugs = issues.filter(issue => issue.labels.some(label => label.name.toLowerCase().includes('bug')));
        const fixedBugs = bugs.filter(bug => bug.state === 'closed');
        return {
            totalBugs: bugs.length,
            fixedBugs: fixedBugs.length,
            fixRate: `${((fixedBugs.length / bugs.length) * 100).toFixed(2)}%`
        };
    }

     // Output Formatting
     formatOutput(analysis) {
        const result = {
            repositoryAnalytics: analysis.repositoryAnalytics,
            qualityMetrics: analysis.qualityMetrics,
            teamPerformance: analysis.teamPerformance,
            dependencyAnalysis: analysis.dependencyAnalysis,
            issueManagement: analysis.issueManagement,
            pullRequestAnalysis: analysis.pullRequestAnalysis,
            releaseManagement: analysis.releaseManagement,
            cicdCheck: analysis.cicdCheck
        };
    
        // Log to console for quick debugging and insights
        console.log('\n=== Repository Analysis ===');
        console.log('\nRepository Analytics:', JSON.stringify(result.repositoryAnalytics, null, 2));
        console.log('\nQuality Metrics:', JSON.stringify(result.qualityMetrics, null, 2));
        console.log('\nTeam Performance:', JSON.stringify(result.teamPerformance, null, 2));
        console.log('\nDependency Analysis:', JSON.stringify(result.dependencyAnalysis, null, 2));
        console.log('\nIssue Management:', JSON.stringify(result.issueManagement, null, 2));
        console.log('\nPull Request Analysis:', JSON.stringify(result.pullRequestAnalysis, null, 2));
        console.log('\nRelease Management:', JSON.stringify(result.releaseManagement, null, 2));
        console.log('\nCI/CD Check:', JSON.stringify(result.cicdCheck, null, 2));
        console.log('\n=============================\n');
    
        // Return as JSON response
        return result;
    }

      // Save Result to File
      async saveResultToFile(result, filename) {
        try {
            await fs.promises.writeFile(filename, JSON.stringify(result, null, 2));
            console.log(`Analysis result saved to ${filename}`);
        } catch (err) {
            console.error('Error saving result to file:', err);
        }
    }
}

// // Example Usage
// const githubUrls = ['https://github.com/src-d/hercules'];

// const analyzer = new ComprehensiveGithubAnalyzer(githubUrls);
// analyzer.analyzeAll();
module.exports = { ComprehensiveGithubAnalyzer };
