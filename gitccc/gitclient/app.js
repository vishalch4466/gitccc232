const express = require('express');
const cors = require('cors');
const { ComprehensiveGithubAnalyzer } = require('./git');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Simple test endpoint to verify API is working
app.get('/test', (req, res) => {
    res.json({ message: "API is working" });
});

// Analysis endpoint with query parameter
app.get('/api/analyze', async (req, res) => {
    try {
        const githubUrl = req.query.github;
        
        if (!githubUrl) {
            return res.status(400).json({
                status: 'error',
                message: 'GitHub URL is required. Use ?github=username/repository'
            });
        }

        const fullGithubUrl = `https://github.com/${githubUrl}`;
        console.log(`Starting analysis for repository: ${fullGithubUrl}`);
        
        const analyzer = new ComprehensiveGithubAnalyzer([fullGithubUrl]);
        const result = await analyzer.analyzeRepository(fullGithubUrl);

        if (!result) {
            return res.status(404).json({
                status: 'error',
                message: 'Repository analysis failed or repository not found'
            });
        }

        res.json({
            status: 'success',
            repository: githubUrl,
            timestamp: new Date().toISOString(),
            analysis: result
        });

    } catch (error) {
        console.error('Error during analysis:', error);
        res.status(500).json({
            status: 'error',
            message: 'Error analyzing repository',
            error: error.message
        });
    }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Try accessing: http://localhost:${PORT}/api/analyze?github=username/repository`);
});