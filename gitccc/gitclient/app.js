const express = require('express');
const cors = require('cors');
const { ComprehensiveGithubAnalyzer } = require('./git');
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabaseUrl = 'https://xhucquitikitwusmxxkq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhodWNxdWl0aWtpdHd1c214eGtxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczMjE2Mjk5MywiZXhwIjoyMDQ3NzM4OTkzfQ.lZlNpj3SUlrkSyEdy-K3h1VV9CTUj_kdrm0YwdJSX68';
const supabase = createClient(supabaseUrl, supabaseKey);

const app = express();

app.use(cors());
app.use(express.json());

app.get('/test', (req, res) => {
    res.json({ message: "API is working" });
});

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
        
        // Check if analysis exists in database
        const { data: existingData } = await supabase
            .from('gitdata')
            .select()
            .eq('gitlink', fullGithubUrl)
            .single();

        if (existingData) {
            return res.json({
                status: 'success',
                repository: githubUrl,
                timestamp: existingData.created_at,
                analysis: existingData.data,
                source: 'cache'
            });
        }

        // Perform new analysis
        const analyzer = new ComprehensiveGithubAnalyzer([fullGithubUrl]);
        const result = await analyzer.analyzeRepository(fullGithubUrl);

        if (!result) {
            return res.status(404).json({
                status: 'error',
                message: 'Repository analysis failed or repository not found'
            });
        }

        // Store results in Supabase
        const { error: insertError } = await supabase
            .from('gitdata')
            .insert({
                gitlink: fullGithubUrl,
                data: result
            });

        if (insertError) {
            console.error('Error storing in database:', insertError);
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
});