import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Search, Star, GitFork, Eye, Activity, Bug, GitPullRequest, Clock, Users, FileCode, CheckCircle2, AlertCircle, Github, GitBranch, GitCommit, FileText, Code2, BookOpen, Copy, AlertTriangle, GitMerge } from 'lucide-react'

function AboutSectionCard(data) {
    let formattedDataObj = data.data.formattedData;
    let Id = data.id
    let h3Value;
    console.log("porps", formattedDataObj, Id);
    if (Id == "Stars") {
        h3Value = formattedDataObj.repositoryAnalytics.forkStars.stars.toLocaleString();
        console.log("h3Value", h3Value);
    } else if (Id == "Forks") {
        h3Value = formattedDataObj.repositoryAnalytics.forkStars.forks.toLocaleString();
        console.log("h3Value", h3Value);
    } else if (Id == "Watchers") {
        h3Value = formattedDataObj.repositoryAnalytics.forkStars.watchers.toLocaleString();
        console.log("h3Value", h3Value);
    } else if (Id == "Open PRs") {
        h3Value = formattedDataObj.pullRequestAnalysis.openPRs;
        console.log("h3Value", h3Value);
    } else if (Id == "Open Issues") {
        h3Value = formattedDataObj.issueManagement.openIssues;
        console.log("h3Value", h3Value);
    } else if (Id == "Latest Release") {
        h3Value = formattedDataObj.releaseManagement.latestRelease;
        console.log("h3Value", h3Value);
    }
    return (
        <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
            <CardContent className="flex items-center p-6">
                {Id == "Stars" && (<Star className="h-8 w-8 text-yellow-400 mr-4" />)}
                {Id == "Forks" && (<GitFork className="h-8 w-8 text-blue-400 mr-4" />)}
                {Id == "Watchers" && (<Eye className="h-8 w-8 text-green-400 mr-4" />)}
                {Id == "Open PRs" && (<GitPullRequest className="h-8 w-8 text-purple-400 mr-4" />)}
                {Id == "Open Issues" && (<AlertCircle className="h-8 w-8 text-red-400 mr-4" />)}
                {Id == "Latest Release" && (<GitBranch className="h-8 w-8 text-pink-400 mr-4" />)}
                <div>
                    <p className="text-sm text-gray-400 ">{Id}</p>
                    <h3 className="text-2xl font-bold text-white font-bold">{h3Value}</h3>
                </div>
            </CardContent>
        </Card>
    );
}

export { AboutSectionCard };