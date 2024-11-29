'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Search, Star, GitFork, Eye, Activity, Bug, GitPullRequest, Clock, Users, FileCode, CheckCircle2, AlertCircle, Github, GitBranch, GitCommit, FileText, Code2, BookOpen, Copy, AlertTriangle, GitMerge } from 'lucide-react'

// Mock data from the provided JSON
const mockData = {
  repositoryAnalytics: {
    commitFrequency: {
      hourlyFrequency: [0, 0, 0, 0, 0, 2, 2, 2, 4, 5, 11, 5, 8, 8, 8, 9, 7, 4, 7, 4, 4, 4, 6, 0],
      dailyFrequency: [2, 12, 25, 12, 14, 10, 25],
      peakHour: 10,
      peakDay: 2,
    },
    forkStars: {
      forks: 334,
      stars: 2634,
      watchers: 2634,
    },
  },
  qualityMetrics: {
    codeDuplication: {
      totalDuplicates: 12,
      duplicates: [
        "Makefile",
        "__init__.py",
        "utils.go",
        "test",
        "test_data",
        "utils.go",
        "LICENSE.md",
        "README.md",
        "__init__.py",
        "__init__.py",
        "__init__.py",
        "pb_pb2.py",
      ],
    },
    testCoverage: {
      testFilesCount: 0,
      sourceFilesCount: 28,
      coverage: "0.00",
    },
    docCoverage: {
      docFilesCount: 9,
      totalFiles: 204,
      coverage: "4.41",
    },
    codeComplexity: {
      averageComplexity: 7.61,
    },
  },
  teamPerformance: {
    developerProductivity: [
      { username: "vmarkovtsev", contributions: 878, active: true },
      { username: "bobheadxi", contributions: 53, active: true },
      { username: "akx", contributions: 15, active: true },
      { username: "akutta", contributions: 15, active: true },
      { username: "smacker", contributions: 12, active: true },
    ],
    reviewEfficiency: {
      totalPRs: 100,
      reviewedPRs: 0,
      reviewRate: "0.00",
    },
    bugFixFrequency: {
      totalBugs: 1,
      fixedBugs: 0,
      fixRate: "0.00",
    },
  },
  issueManagement: {
    openIssues: 41,
    closedIssues: 59,
    averageTimeToClose: "18.53",
  },
  pullRequestAnalysis: {
    openPRs: 6,
    mergedPRs: 89,
    averageTimeToMerge: "0.87",
  },
  releaseManagement: {
    totalReleases: 30,
    latestRelease: "v10.7.2",
  },
  cicd: {
    cicdConfigured: true,
    workflows: [
      { name: ".github/workflows/main.yml", status: "active" },
      { name: ".github/workflows/main.yml", status: "active" },
    ],
  },
}

export default function GithubAnalyzer() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = () => {
    setIsLoading(true)
    setTimeout(() => {
      setShowDashboard(true)
      setIsLoading(false)
    }, 1500)
  }

  // Vibrant colors for dark theme
  const COLORS = {
    blue: '#60A5FA',
    green: '#34D399',
    red: '#F87171',
    purple: '#A78BFA',
    pink: '#F472B6',
    yellow: '#FBBF24',
    orange: '#FB923C',
  }

  // Format hourly commit data
  const hourlyCommitData = mockData.repositoryAnalytics.commitFrequency.hourlyFrequency.map((value, hour) => ({
    hour: `${hour.toString().padStart(2, '0')}:00`,
    commits: value,
  }))

  // Format daily commit data
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dailyCommitData = mockData.repositoryAnalytics.commitFrequency.dailyFrequency.map((value, index) => ({
    day: days[index],
    commits: value,
  }))

  // Format developer data
  const developerData = mockData.teamPerformance.developerProductivity
    .sort((a, b) => b.contributions - a.contributions)
    .slice(0, 5)

  // Format issue data
  const issueData = [
    { name: 'Open Issues', value: mockData.issueManagement.openIssues },
    { name: 'Closed Issues', value: mockData.issueManagement.closedIssues },
  ]

  // Format PR data
  const prData = [
    { name: 'Open PRs', value: mockData.pullRequestAnalysis.openPRs },
    { name: 'Merged PRs', value: mockData.pullRequestAnalysis.mergedPRs },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Title and Search Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Github className="w-12 h-12 text-blue-400 mr-4" />
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
              Github Repo Analyzer
            </h1>
          </div>
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Enter Repository URL (e.g., facebook/react)"
                className="w-full pl-10 bg-gray-800/50 border-gray-700 focus:border-blue-500 text-white placeholder:text-gray-400"
              />
            </div>
            <Button
              onClick={handleAnalyze}
              className="w-full sm:w-auto px-8 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-all duration-200 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Activity className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing Repository...
                </>
              ) : (
                'Analyze Repository'
              )}
            </Button>
          </div>
        </div>

        {showDashboard && (
          <div className="space-y-8 animate-fade-in">
            {/* Repository Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardContent className="flex items-center p-6">
                  <Star className="h-8 w-8 text-yellow-400 mr-4" />
                  <div>
                    <p className="text-sm text-gray-400">Stars</p>
                    <h3 className="text-2xl font-bold">{mockData.repositoryAnalytics.forkStars.stars.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardContent className="flex items-center p-6">
                  <GitFork className="h-8 w-8 text-blue-400 mr-4" />
                  <div>
                    <p className="text-sm text-gray-400">Forks</p>
                    <h3 className="text-2xl font-bold">{mockData.repositoryAnalytics.forkStars.forks.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardContent className="flex items-center p-6">
                  <Eye className="h-8 w-8 text-green-400 mr-4" />
                  <div>
                    <p className="text-sm text-gray-400">Watchers</p>
                    <h3 className="text-2xl font-bold">{mockData.repositoryAnalytics.forkStars.watchers.toLocaleString()}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardContent className="flex items-center p-6">
                  <GitPullRequest className="h-8 w-8 text-purple-400 mr-4" />
                  <div>
                    <p className="text-sm text-gray-400">Open PRs</p>
                    <h3 className="text-2xl font-bold">{mockData.pullRequestAnalysis.openPRs}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardContent className="flex items-center p-6">
                  <AlertCircle className="h-8 w-8 text-red-400 mr-4" />
                  <div>
                    <p className="text-sm text-gray-400">Open Issues</p>
                    <h3 className="text-2xl font-bold">{mockData.issueManagement.openIssues}</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardContent className="flex items-center p-6">
                  <GitBranch className="h-8 w-8 text-pink-400 mr-4" />
                  <div>
                    <p className="text-sm text-gray-400">Latest Release</p>
                    <h3 className="text-xl font-bold">{mockData.releaseManagement.latestRelease}</h3>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Commit Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardHeader>
                  <CardTitle>Hourly Commit Frequency</CardTitle>
                  <CardDescription className="text-gray-400">
                    Peak hour: {mockData.repositoryAnalytics.commitFrequency.peakHour}:00
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={hourlyCommitData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="hour" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }}
                        cursor={{ fill: 'rgba(96, 165, 250, 0.1)' }}
                      />
                      <Bar dataKey="commits" fill={COLORS.blue} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardHeader>
                  <CardTitle>Daily Commit Activity</CardTitle>
                  <CardDescription className="text-gray-400">
                    Peak day: {days[mockData.repositoryAnalytics.commitFrequency.peakDay]}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={dailyCommitData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }}
                        cursor={{ fill: 'rgba(52, 211, 153, 0.1)' }}
                      />
                      <Bar dataKey="commits" fill={COLORS.green} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Code Quality Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Code2 className="h-5 w-5 text-blue-400" />
                    Test Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="w-full mb-4">
                      <Progress value={parseFloat(mockData.qualityMetrics.testCoverage.coverage)} className="h-4" />
                    </div>
                    <p className="text-3xl font-bold text-blue-400">{mockData.qualityMetrics.testCoverage.coverage}%</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {mockData.qualityMetrics.testCoverage.testFilesCount} test files / {mockData.qualityMetrics.testCoverage.sourceFilesCount} source files
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-green-400" />
                    Documentation Coverage
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <div className="w-full mb-4">
                      <Progress value={parseFloat(mockData.qualityMetrics.docCoverage.coverage)} className="h-4" />
                    </div>
                    <p className="text-3xl font-bold text-green-400">{mockData.qualityMetrics.docCoverage.coverage}%</p>
                    <p className="text-sm text-gray-400 mt-2">
                      {mockData.qualityMetrics.docCoverage.docFilesCount} doc files / {mockData.qualityMetrics.docCoverage.totalFiles} total files
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Copy className="h-5 w-5 text-orange-400" />
                    Code Duplication
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <p className="text-3xl font-bold text-orange-400">
                      {mockData.qualityMetrics.codeDuplication.totalDuplicates}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Duplicate Files</p>
                    <ScrollArea className="h-24 w-full mt-4">
                      <div className="space-y-2">
                        {mockData.qualityMetrics.codeDuplication.duplicates.map((file, index) => (
                          <div key={index} className="text-sm text-gray-300 bg-gray-700/50 px-2 py-1 rounded">
                            {file}
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-400" />
                    Code Complexity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col items-center">
                    <p className="text-3xl font-bold text-red-400">
                      {mockData.qualityMetrics.codeComplexity.averageComplexity.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-400 mt-2">Average Complexity Score</p>
                    <div className="mt-4 w-full">
                      <div className="text-xs text-gray-400 mb-1">Complexity Scale</div>
                      <div className="grid grid-cols-5 gap-1">
                        <div className="h-1 bg-green-400 rounded"></div>
                        <div className="h-1 bg-yellow-400 rounded"></div>
                        <div className="h-1 bg-orange-400 rounded"></div>
                        <div className="h-1 bg-red-400 rounded"></div>
                        <div className="h-1 bg-pink-400 rounded"></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-400 mt-1">
                        <span>Simple</span>
                        <span>Complex</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Team Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-400" />
                    Top Contributors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart
                      layout="vertical"
                      data={developerData}
                      margin={{ top: 0, right: 0, bottom: 0, left: 40 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis type="number" stroke="#9CA3AF" />
                      <YAxis dataKey="username" type="category" stroke="#9CA3AF" width={100} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }}
                        cursor={{ fill: 'rgba(167, 139, 250, 0.1)' }}
                      />
                      <Bar dataKey="contributions" fill={COLORS.purple}>
                        {developerData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[Object.keys(COLORS)[index % Object.keys(COLORS).length]]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GitMerge className="h-5 w-5 text-pink-400" />
                    Pull Request Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center">
                      <p className="text-sm text-gray-400">Average Time to Merge</p>
                      <p className="text-2xl font-bold text-pink-400">{mockData.pullRequestAnalysis.averageTimeToMerge} days</p>
                    </div>
                    <div className="text-center">
                      <p className="text-sm text-gray-400">PR Success Rate</p>
                      <p className="text-2xl font-bold text-green-400">
                        {((mockData.pullRequestAnalysis.mergedPRs / (mockData.pullRequestAnalysis.mergedPRs + mockData.pullRequestAnalysis.openPRs)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={prData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {prData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.orange : COLORS.green} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Issue Management */}
            <Card className="bg-gray-800/50 backdrop-blur border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-400" />
                  Issue Management Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Average Time to Close</p>
                    <p className="text-2xl font-bold text-yellow-400">{mockData.issueManagement.averageTimeToClose} days</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Issue Resolution Rate</p>
                    <p className="text-2xl font-bold text-green-400">
                      {((mockData.issueManagement.closedIssues / (mockData.issueManagement.openIssues + mockData.issueManagement.closedIssues)) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-400">Total Issues</p>
                    <p className="text-2xl font-bold text-blue-400">
                      {mockData.issueManagement.openIssues + mockData.issueManagement.closedIssues}
                    </p>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={issueData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {issueData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? COLORS.red : COLORS.green} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

