/* ==========================================================================
   Smart Resume Analyzer - Application Logic
   ========================================================================== */

// Configure PDF.js Worker
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

// Application State
const state = {
    theme: 'dark',
    apiKey: '',
    selectedModel: 'gemini-2.5-flash',
    resumeText: '',
    resumeFileName: '',
    resumeFileSize: '',
    jobDescription: '',
    chatHistory: [],
    analysisResults: null,
    isAnalyzing: false
};

// Common Technical & Professional Keywords List for local matching
const COMMON_KEYWORDS = [
    'javascript', 'python', 'react', 'node', 'express', 'vue', 'angular', 'typescript', 'html', 'css', 
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 
    'git', 'github', 'ci/cd', 'agile', 'scrum', 'project management', 'machine learning', 'deep learning', 
    'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'flutter', 'react native', 'api', 'graphql', 
    'rest api', 'devops', 'linux', 'unix', 'figma', 'ui/ux', 'cybersecurity', 'networks', 'testing', 
    'unit testing', 'qa', 'data analysis', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 
    'tableau', 'power bi', 'excel', 'communication', 'leadership', 'teamwork', 'problem solving'
];

// Weak / Cliché Words list
const CLICHES = [
    'synergy', 'team player', 'results-driven', 'results driven', 'go-getter', 'hard worker', 
    'detail-oriented', 'detail oriented', 'passionate', 'dynamic', 'self-motivated', 'motivated', 
    'think outside the box', 'strategic thinker', 'proven track record', 'hardworking', 'go-to'
];

// Strong Action Verbs list
const ACTION_VERBS = [
    'designed', 'developed', 'implemented', 'engineered', 'managed', 'led', 'built', 'optimized', 
    'spearheaded', 'created', 'analyzed', 'delivered', 'increased', 'improved', 'resolved', 'launched', 
    'facilitated', 'accelerated', 'collaborated', 'coordinated', 'formulated', 'programmed', 'modernized', 
    'automated', 'directed', 'executed', 'established', 'decreased', 'expedited', 'mentored', 'trained'
];

// DOM Elements
const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    btnApiSettings: document.getElementById('btn-api-settings'),
    btnLinkApiSettings: document.getElementById('link-api-settings'),
    apiStatusBadge: document.getElementById('api-status-badge'),
    apiModal: document.getElementById('api-modal'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    inputApiKey: document.getElementById('input-api-key'),
    selectModel: document.getElementById('select-model'),
    btnSaveKey: document.getElementById('btn-save-key'),
    btnClearKey: document.getElementById('btn-clear-key'),
    btnToggleKeyVisibility: document.getElementById('btn-toggle-key-visibility'),
    
    viewLanding: document.getElementById('view-landing'),
    viewLoading: document.getElementById('view-loading'),
    viewDashboard: document.getElementById('view-dashboard'),
    
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('file-input'),
    btnBrowseFile: document.getElementById('btn-browse-file'),
    fileDetails: document.getElementById('file-details'),
    fileName: document.getElementById('file-name'),
    fileSize: document.getElementById('file-size'),
    btnRemoveFile: document.getElementById('btn-remove-file'),
    jobDescInput: document.getElementById('job-desc-input'),
    btnAnalyze: document.getElementById('btn-analyze'),
    geminiHint: document.getElementById('gemini-hint'),
    
    loadingStatus: document.getElementById('loading-status'),
    loadingSubstatus: document.getElementById('loading-substatus'),
    loadingProgress: document.getElementById('loading-progress'),
    
    btnBackToUpload: document.getElementById('btn-back-to-upload'),
    dashFileTitle: document.getElementById('dash-file-title'),
    analysisEngineBadge: document.getElementById('analysis-engine-badge'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    tabBtnMatcher: document.getElementById('tab-btn-matcher'),
    
    scoreValue: document.getElementById('score-value'),
    scoreFillCircle: document.getElementById('score-fill-circle'),
    scoreVerdict: document.getElementById('score-verdict'),
    
    scoreFormattingText: document.getElementById('score-formatting-text'),
    progressFormatting: document.getElementById('progress-formatting'),
    scoreImpactText: document.getElementById('score-impact-text'),
    progressImpact: document.getElementById('progress-impact'),
    scoreSectionsText: document.getElementById('score-sections-text'),
    progressSections: document.getElementById('progress-sections'),
    scoreReadabilityText: document.getElementById('score-readability-text'),
    progressReadability: document.getElementById('progress-readability'),
    
    listPassed: document.getElementById('list-passed'),
    listAlerts: document.getElementById('list-alerts'),
    
    geminiInsightsContainer: document.getElementById('gemini-insights-container'),
    geminiSuggestionsMd: document.getElementById('gemini-suggestions-md'),
    
    suggSections: document.getElementById('sugg-sections'),
    suggContent: document.getElementById('sugg-content'),
    suggFormatting: document.getElementById('sugg-formatting'),
    suggClichés: document.getElementById('sugg-clichés'),
    
    matchScoreValue: document.getElementById('match-score-value'),
    matchScoreText: document.getElementById('match-score-text'),
    matchedKeywordsContainer: document.getElementById('matched-keywords-container'),
    missingKeywordsContainer: document.getElementById('missing-keywords-container'),
    geminiMatchContainer: document.getElementById('gemini-match-container'),
    geminiMatchMd: document.getElementById('gemini-match-md'),
    
    resumeTextContent: document.getElementById('resume-text-content'),
    btnCopyText: document.getElementById('btn-copy-text'),
    
    chatMessages: document.getElementById('chat-messages'),
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),
    btnSendMessage: document.getElementById('btn-send-message'),
    chatNoKeyWarning: document.getElementById('chat-no-key-warning'),
    coachStatus: document.getElementById('coach-status')
};

/* ==========================================================================
   INITIALIZATION & THEME MGMT
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadApiKeySettings();
    registerEventListeners();
});

// Theme Management
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);
}

function setTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
}

elements.themeToggle.addEventListener('click', () => {
    const newTheme = state.theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
});

// API Settings Management
function loadApiKeySettings() {
    state.apiKey = localStorage.getItem('gemini_api_key') || '';
    state.selectedModel = localStorage.getItem('gemini_model') || 'gemini-2.5-flash';
    
    // Automatically migrate legacy/deprecated models
    if (state.selectedModel.includes('gemini-1.5') || state.selectedModel.includes('gemini-2.0')) {
        state.selectedModel = 'gemini-3.5-flash';
        localStorage.setItem('gemini_model', 'gemini-3.5-flash');
    }
    
    elements.inputApiKey.value = state.apiKey;
    elements.selectModel.value = state.selectedModel;
    
    updateApiStatusUI();
}

function updateApiStatusUI() {
    if (state.apiKey) {
        elements.apiStatusBadge.className = 'badge-connected';
        elements.geminiHint.style.display = 'none';
        elements.chatNoKeyWarning.style.display = 'none';
        elements.chatInput.disabled = false;
        elements.btnSendMessage.disabled = false;
        elements.coachStatus.textContent = 'Online & Ready';
    } else {
        elements.apiStatusBadge.className = 'badge-disconnected';
        elements.geminiHint.style.display = 'inline-flex';
        elements.chatNoKeyWarning.style.display = 'block';
        elements.chatInput.disabled = true;
        elements.btnSendMessage.disabled = true;
        elements.coachStatus.textContent = 'Requires API Key';
    }
}

// Modal Toggle
function openApiModal() {
    elements.apiModal.classList.add('active');
}

function closeApiModal() {
    elements.apiModal.classList.remove('active');
}

elements.btnApiSettings.addEventListener('click', openApiModal);
elements.btnLinkApiSettings.addEventListener('click', openApiModal);
elements.btnCloseModal.addEventListener('click', closeApiModal);

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target === elements.apiModal) {
        closeApiModal();
    }
});

// Save / Delete API Keys
elements.btnSaveKey.addEventListener('click', () => {
    const key = elements.inputApiKey.value.trim();
    const model = elements.selectModel.value;
    
    localStorage.setItem('gemini_api_key', key);
    localStorage.setItem('gemini_model', model);
    
    state.apiKey = key;
    state.selectedModel = model;
    
    updateApiStatusUI();
    closeApiModal();
});

elements.btnClearKey.addEventListener('click', () => {
    localStorage.removeItem('gemini_api_key');
    elements.inputApiKey.value = '';
    state.apiKey = '';
    
    updateApiStatusUI();
    closeApiModal();
});

// Toggle password input visibility
elements.btnToggleKeyVisibility.addEventListener('click', () => {
    const type = elements.inputApiKey.type === 'password' ? 'text' : 'password';
    elements.inputApiKey.type = type;
    
    const icon = elements.btnToggleKeyVisibility.querySelector('i');
    if (type === 'password') {
        icon.className = 'fa-solid fa-eye';
    } else {
        icon.className = 'fa-solid fa-eye-slash';
    }
});

/* ==========================================================================
   EVENT LISTENERS & UPLOAD LOGIC
   ========================================================================== */
function registerEventListeners() {
    // Browse File triggers input click
    elements.btnBrowseFile.addEventListener('click', () => {
        elements.fileInput.click();
    });

    // File input change
    elements.fileInput.addEventListener('change', handleFileSelection);

    // Drag and Drop
    elements.dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        elements.dropZone.classList.add('dragover');
    });

    elements.dropZone.addEventListener('dragleave', () => {
        elements.dropZone.classList.remove('dragover');
    });

    elements.dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        elements.dropZone.classList.remove('dragover');
        if (e.dataTransfer.files.length > 0) {
            processSelectedFile(e.dataTransfer.files[0]);
        }
    });

    // Remove File
    elements.btnRemoveFile.addEventListener('click', removeUploadedFile);

    // Start Analysis
    elements.btnAnalyze.addEventListener('click', startAnalysisFlow);

    // Back to upload
    elements.btnBackToUpload.addEventListener('click', () => {
        switchView('view-landing');
    });

    // Tab buttons switching
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            switchTab(button, targetTab);
        });
    });

    // Copy resume text to clipboard
    elements.btnCopyText.addEventListener('click', () => {
        navigator.clipboard.writeText(state.resumeText)
            .then(() => {
                const prevHtml = elements.btnCopyText.innerHTML;
                elements.btnCopyText.innerHTML = '<i class="fa-solid fa-check"></i> Copied!';
                setTimeout(() => {
                    elements.btnCopyText.innerHTML = prevHtml;
                }, 2000);
            });
    });

    // Toggle suggestions detail list
    document.querySelectorAll('.suggestion-header').forEach(header => {
        header.addEventListener('click', () => {
            const card = header.closest('.suggestion-card-item');
            card.classList.toggle('expanded');
        });
    });

    // Chat suggestions click delegate
    elements.chatMessages.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-chat-suggest')) {
            const query = e.target.textContent;
            elements.chatInput.value = query;
            elements.chatForm.dispatchEvent(new Event('submit'));
        }
    });

    // Chat form submit
    elements.chatForm.addEventListener('submit', handleChatSubmit);
}

function handleFileSelection(e) {
    if (e.target.files.length > 0) {
        processSelectedFile(e.target.files[0]);
    }
}

function processSelectedFile(file) {
    const validExtensions = ['.pdf', '.txt', '.md'];
    const fileName = file.name;
    const fileExtension = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
    
    if (!validExtensions.includes(fileExtension)) {
        alert('Invalid file format. Please upload a PDF, TXT, or MD resume.');
        return;
    }
    
    state.selectedFile = file;
    state.resumeFileName = fileName;
    state.resumeFileSize = formatBytes(file.size);
    
    // UI Updates
    elements.fileName.textContent = state.resumeFileName;
    elements.fileSize.textContent = state.resumeFileSize;
    elements.dropZone.style.display = 'none';
    elements.fileDetails.classList.remove('hidden');
    elements.btnAnalyze.disabled = false;
}

function removeUploadedFile() {
    state.selectedFile = null;
    state.resumeFileName = '';
    state.resumeFileSize = '';
    state.resumeText = '';
    
    elements.fileInput.value = '';
    elements.fileDetails.classList.add('hidden');
    elements.dropZone.style.display = 'flex';
    elements.btnAnalyze.disabled = true;
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

function switchView(viewId) {
    document.querySelectorAll('.view-section').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

function switchTab(clickedButton, targetTabId) {
    elements.tabButtons.forEach(btn => btn.classList.remove('active'));
    elements.tabContents.forEach(content => content.classList.remove('active'));
    
    clickedButton.classList.add('active');
    document.getElementById(targetTabId).classList.add('active');
}

/* ==========================================================================
   RESUME TEXT EXTRACTION (PDF & TEXT)
   ========================================================================== */
async function startAnalysisFlow() {
    if (!state.selectedFile) return;
    
    switchView('view-loading');
    updateLoadingProgress(10, 'Reading File...');
    
    try {
        state.jobDescription = elements.jobDescInput.value.trim();
        
        // Extract Text
        if (state.selectedFile.type === 'application/pdf' || state.selectedFile.name.endsWith('.pdf')) {
            updateLoadingProgress(25, 'Parsing PDF Document...', 'Extracting structured pages client-side.');
            state.resumeText = await parsePdfFile(state.selectedFile);
        } else {
            updateLoadingProgress(35, 'Reading Text Content...', 'Loading direct string segments.');
            state.resumeText = await parseTextFile(state.selectedFile);
        }
        
        if (!state.resumeText || state.resumeText.trim().length === 0) {
            throw new Error("No readable text found in the uploaded resume. Make sure it isn't an scanned image PDF.");
        }
        
        updateLoadingProgress(55, 'Running Heuristics Checks...', 'Analyzing styling, structure, and readability metrics.');
        
        // Run Local Heuristics Analysis
        const localHeuristics = runLocalHeuristics(state.resumeText);
        state.analysisResults = localHeuristics;
        
        // If Gemini Key is present, run deep review
        if (state.apiKey) {
            updateLoadingProgress(75, 'Analyzing with Gemini AI...', 'Evaluating bullet-points, identifying structural improvements & matching JD.');
            
            // Execute parallel API calls for suggestions & (optional) job match
            const promises = [runGeminiAnalysis(state.resumeText)];
            if (state.jobDescription) {
                promises.push(runGeminiJobMatcher(state.resumeText, state.jobDescription));
            }
            
            await Promise.all(promises);
            elements.analysisEngineBadge.textContent = 'AI Enhanced';
            elements.analysisEngineBadge.className = 'badge badge-ai';
        } else {
            // Local analysis only
            elements.analysisEngineBadge.textContent = 'Local Engine';
            elements.analysisEngineBadge.className = 'badge';
            
            // Hide AI containers in suggestions and matcher
            elements.geminiInsightsContainer.classList.add('hidden');
            elements.geminiMatchContainer.classList.add('hidden');
        }
        
        // Update Local Matcher anyway (even if JD is pasted but no API key)
        if (state.jobDescription) {
            runLocalJobMatcher(state.resumeText, state.jobDescription);
            elements.tabBtnMatcher.style.display = 'flex';
        } else {
            // Hide Job matcher tab if no JD
            elements.tabBtnMatcher.style.display = 'none';
        }
        
        updateLoadingProgress(95, 'Structuring Dashboard...', 'Finalizing score animations and details tabs.');
        
        // Populate UI Dashboard
        populateDashboardUI(localHeuristics);
        
        // Reset chat history with current resume context
        initChatCoachContext();
        
        setTimeout(() => {
            switchView('view-dashboard');
            animateScores(localHeuristics.overallScore, localHeuristics.metrics);
        }, 800);
        
    } catch (err) {
        console.error(err);
        alert(`Analysis Error: ${err.message}`);
        switchView('view-landing');
    }
}

function updateLoadingProgress(percent, statusText, substatusText = '') {
    elements.loadingProgress.style.width = `${percent}%`;
    elements.loadingStatus.textContent = statusText;
    if (substatusText) {
        elements.loadingSubstatus.textContent = substatusText;
    }
}

// Text File parsing helper
function parseTextFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = (err) => reject(err);
        reader.readAsText(file);
    });
}

// PDF text parsing using pdf.js
function parsePdfFile(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async function(e) {
            try {
                const typedarray = new Uint8Array(e.target.result);
                const loadingTask = pdfjsLib.getDocument({ data: typedarray });
                
                loadingTask.onProgress = function(progressData) {
                    if (progressData.total > 0) {
                        const pct = Math.round((progressData.loaded / progressData.total) * 100);
                        updateLoadingProgress(25 + Math.round(pct * 0.1), 'Loading PDF...', `Loaded ${pct}% of bytes.`);
                    }
                };
                
                const pdf = await loadingTask.promise;
                let fullText = '';
                
                for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
                    const page = await pdf.getPage(pageNum);
                    const textContent = await page.getTextContent();
                    const pageText = textContent.items
                        .map(item => item.str)
                        .join(' ');
                    fullText += pageText + '\n';
                }
                
                resolve(fullText);
            } catch (err) {
                reject(new Error(`Failed to extract text from PDF: ${err.message}. Ensure the file is not corrupted or password-protected.`));
            }
        };
        
        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
}

/* ==========================================================================
   LOCAL HEURISTICS ENGINE & SCORE CALCULATORS
   ========================================================================== */
function runLocalHeuristics(text) {
    const textLower = text.toLowerCase();
    
    // 1. SECTION CHECKS
    const sections = {
        education: /education|academic|degree|schooling|university|college/i.test(text),
        experience: /experience|employment|work history|professional history|job history/i.test(text),
        skills: /skills|technologies|technical skills|core competencies|expertise/i.test(text),
        projects: /projects|academic projects|personal projects|key projects/i.test(text),
        summary: /summary|objective|profile|about me|professional summary/i.test(text)
    };
    
    let sectionsScore = 0;
    const sectionsFound = Object.keys(sections).filter(k => sections[k]);
    sectionsScore = Math.round((sectionsFound.length / Object.keys(sections).length) * 100);

    // 2. FORMATTING & CONTACT INFO
    const contact = {
        email: /[\w.-]+@[\w.-]+\.\w+/.test(text),
        phone: /(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text),
        links: /linkedin\.com|github\.com|portfolio|[\w-]+\.github\.io/i.test(text)
    };
    
    const wordCount = text.trim().split(/\s+/).length;
    let lengthRating = 'good'; // under, good, over
    let lengthScore = 100;
    
    if (wordCount < 200) {
        lengthRating = 'too-short';
        lengthScore = 40;
    } else if (wordCount > 1000) {
        lengthRating = 'too-long';
        lengthScore = 60;
    }
    
    let contactScore = 0;
    const contactKeys = Object.keys(contact);
    const contactsFound = contactKeys.filter(k => contact[k]).length;
    contactScore = Math.round((contactsFound / contactKeys.length) * 100);
    
    const formattingScore = Math.round((contactScore * 0.6) + (lengthScore * 0.4));

    // 3. IMPACT & VERBS (Quantification + Action Verbs + Clichés)
    // Count Action Verbs occurrences
    let actionVerbsCount = 0;
    const actionVerbsFound = [];
    ACTION_VERBS.forEach(verb => {
        const regex = new RegExp('\\b' + verb + '\\b', 'gi');
        const matches = text.match(regex);
        if (matches) {
            actionVerbsCount += matches.length;
            actionVerbsFound.push(verb);
        }
    });
    
    // Count Clichés occurrences
    let clichésCount = 0;
    const clichésFound = [];
    CLICHES.forEach(cliché => {
        const regex = new RegExp('\\b' + cliché + '\\b', 'gi');
        const matches = text.match(regex);
        if (matches) {
            clichésCount += matches.length;
            clichésFound.push(cliché);
        }
    });

    // Quantification (checking presence of percentages, currencies, counts, numbers)
    const numbersCount = (text.match(/\b\d+(?:\.\d+)?%?\b/g) || []).length;
    const moneyCount = (text.match(/[\$£€]\d+/g) || []).length;
    const metricCount = numbersCount + moneyCount;
    
    let quantificationScore = Math.min(100, metricCount * 10); // 10 metrics is 100 points
    let verbScore = Math.min(100, actionVerbsCount * 10);      // 10 verbs is 100 points
    let clichéPenalty = Math.max(0, 100 - (clichésCount * 15)); // subtract 15 points per cliché
    
    const impactScore = Math.round((quantificationScore * 0.4) + (verbScore * 0.4) + (clichéPenalty * 0.2));

    // 4. READABILITY & FLOW
    // Simple sentence average length check
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 5);
    const avgSentenceLength = sentences.length > 0 ? wordCount / sentences.length : 0;
    
    let readabilityScore = 100;
    if (avgSentenceLength > 25) {
        readabilityScore = Math.max(40, 100 - (avgSentenceLength - 25) * 4); // penalty for very long sentences
    } else if (avgSentenceLength < 8) {
        readabilityScore = 70; // overly choppy sentences
    }
    
    // Overall Score
    const overallScore = Math.round((sectionsScore + formattingScore + impactScore + readabilityScore) / 4);

    return {
        overallScore,
        metrics: {
            sectionsScore,
            formattingScore,
            impactScore,
            readabilityScore
        },
        sections,
        contact,
        wordCount,
        lengthRating,
        actionVerbsCount,
        actionVerbsFound,
        clichésCount,
        clichésFound,
        avgSentenceLength,
        quantificationCount: metricCount
    };
}

/* ==========================================================================
   LOCAL JOB MATCHER
   ========================================================================== */
function runLocalJobMatcher(resumeText, jdText) {
    const cleanResume = resumeText.toLowerCase();
    const cleanJd = jdText.toLowerCase();
    
    // Extract keywords from JD
    const matched = [];
    const missing = [];
    
    COMMON_KEYWORDS.forEach(keyword => {
        const regex = new RegExp('\\b' + keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
        
        // If keyword is in Job Description
        if (regex.test(cleanJd)) {
            // Check if it is also in the Resume
            if (regex.test(cleanResume)) {
                matched.push(keyword);
            } else {
                missing.push(keyword);
            }
        }
    });
    
    // Calculate Score
    const totalKeywords = matched.length + missing.length;
    const matchPercent = totalKeywords > 0 ? Math.round((matched.length / totalKeywords) * 100) : 0;
    
    // Populate Job Matcher static details (which will be overlaid by Gemini if Key is present)
    elements.matchScoreValue.textContent = `${matchPercent}%`;
    
    if (totalKeywords === 0) {
        elements.matchScoreText.textContent = "No specific technical keywords detected in the Job Description. Try adding bulleted job requirements.";
    } else {
        elements.matchScoreText.textContent = `Resume matches ${matched.length} of ${totalKeywords} target skills detected in the requirements.`;
    }
    
    // Matched Tags
    elements.matchedKeywordsContainer.innerHTML = '';
    if (matched.length > 0) {
        matched.forEach(keyword => {
            const span = document.createElement('span');
            span.className = 'tag tag-matched';
            span.textContent = keyword;
            elements.matchedKeywordsContainer.appendChild(span);
        });
    } else {
        elements.matchedKeywordsContainer.innerHTML = '<span class="tag-empty">No skills matched.</span>';
    }
    
    // Missing Tags
    elements.missingKeywordsContainer.innerHTML = '';
    if (missing.length > 0) {
        missing.forEach(keyword => {
            const span = document.createElement('span');
            span.className = 'tag tag-missing';
            span.textContent = keyword;
            elements.missingKeywordsContainer.appendChild(span);
        });
    } else {
        elements.missingKeywordsContainer.innerHTML = '<span class="tag-empty">No critical missing keywords detected!</span>';
    }
}

/* ==========================================================================
   GEMINI API CLIENT
   ========================================================================== */
async function callGeminiAPI(systemPrompt, userPrompt) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${state.selectedModel}:generateContent?key=${state.apiKey}`;
    
    const requestBody = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: `${systemPrompt}\n\nUser Input:\n${userPrompt}` }
                ]
            }
        ],
        generationConfig: {
            temperature: 0.3,
            topP: 0.95
        }
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });
    
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || `HTTP ${response.status}`;
        throw new Error(`Gemini API Error: ${errorMessage}`);
    }
    
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
}

// 1. Core Suggestions API call
async function runGeminiAnalysis(resumeText) {
    const systemPrompt = `You are an elite Resume Reviewer and Technical Recruiter.
Evaluate the candidate's resume and generate highly detailed suggestions. 
Write the output using clean markdown format. Do not use markdown H1. Start with H3 for main sections.
Provide structural feedback, formatting suggestions, and most importantly: rewrite 3-4 weak bullet points into high-impact, metrics-driven bullet points using the STAR method (Situation, Task, Action, Result).`;
    
    const userPrompt = `Resume text:
${resumeText}`;
    
    const result = await callGeminiAPI(systemPrompt, userPrompt);
    elements.geminiSuggestionsMd.innerHTML = marked.parse(result);
    elements.geminiInsightsContainer.classList.remove('hidden');
}

// 2. Job Matcher API call
async function runGeminiJobMatcher(resumeText, jdText) {
    const systemPrompt = `You are an ATS (Applicant Tracking System) optimizer.
Compare the resume text with the job description.
Return a structured markdown assessment containing:
- An AI ATS Compatibility Rating (from High Fit, Medium Fit, to Low Fit). Explain why.
- Skills Gap Analysis: Bullet lists of Core Technical Skills missing, and Soft Skills or domain expertise missing.
- Bullet points rewrite suggestions specifically targeting the job requirements.
Write the output in clean markdown, starting with H3 headings. Do not use H1.`;
    
    const userPrompt = `Resume Text:
${resumeText}

Job Description:
${jdText}`;

    const result = await callGeminiAPI(systemPrompt, userPrompt);
    elements.geminiMatchMd.innerHTML = marked.parse(result);
    elements.geminiMatchContainer.classList.remove('hidden');
}

/* ==========================================================================
   AI COACH CHAT WIDGET
   ========================================================================== */
function initChatCoachContext() {
    state.chatHistory = [
        {
            role: 'model',
            parts: [{
                text: `Hi! I've loaded and analyzed your resume. I'm your AI Resume Coach. Ask me questions, ask me to adapt standard points, or run mock job interviews based on this details!`
            }]
        }
    ];
    
    // Clear display chat bubbles
    elements.chatMessages.innerHTML = '';
    renderMessage('assistant', state.chatHistory[0].parts[0].text);
}

function renderMessage(sender, text) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-message ${sender}`;
    
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    
    // Parse markdown in bubbles
    if (window.marked) {
        bubble.innerHTML = marked.parse(text);
    } else {
        bubble.textContent = text;
    }
    
    // Clean up empty paragraphs
    const paragraphs = bubble.querySelectorAll('p');
    if (paragraphs.length > 0 && sender === 'assistant') {
        // Show suggestions under first message
        if (state.chatHistory.length === 1) {
            const suggestContainer = document.createElement('ul');
            suggestContainer.className = 'chat-suggestions';
            suggestContainer.innerHTML = `
                <li><button class="btn-chat-suggest">How can I make my experience sound more metrics-driven?</button></li>
                <li><button class="btn-chat-suggest">How would you adapt my resume for a Project Manager role?</button></li>
                <li><button class="btn-chat-suggest">What are my biggest skills gaps based on the JD?</button></li>
            `;
            bubble.appendChild(suggestContainer);
        }
    }
    
    wrapper.appendChild(bubble);
    elements.chatMessages.appendChild(wrapper);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function showTypingIndicator() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-message assistant typing-indicator-wrapper';
    
    const bubble = document.createElement('div');
    bubble.className = 'msg-bubble';
    
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.innerHTML = `
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
        <div class="typing-dot"></div>
    `;
    
    bubble.appendChild(indicator);
    wrapper.appendChild(bubble);
    elements.chatMessages.appendChild(wrapper);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function removeTypingIndicator() {
    const indicator = elements.chatMessages.querySelector('.typing-indicator-wrapper');
    if (indicator) {
        indicator.remove();
    }
}

async function handleChatSubmit(e) {
    e.preventDefault();
    const query = elements.chatInput.value.trim();
    if (!query || !state.apiKey) return;
    
    // Clear input
    elements.chatInput.value = '';
    
    // Render user message
    renderMessage('user', query);
    
    // Add user message to history
    state.chatHistory.push({
        role: 'user',
        parts: [{ text: query }]
    });
    
    // Disable inputs
    elements.chatInput.disabled = true;
    elements.btnSendMessage.disabled = true;
    showTypingIndicator();
    
    try {
        const systemPrompt = `You are a helpful, professional, and friendly AI Resume Coach assisting a user.
You have context on their uploaded resume and target job description (if provided).
Provide specific, actionable, and concrete advice.
Resume Details:
${state.resumeText}
${state.jobDescription ? `\nTarget Job Description:\n${state.jobDescription}` : ''}

Respond in markdown format. Keep answers concise, direct, and conversational.`;
        
        // Call API
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${state.selectedModel}:generateContent?key=${state.apiKey}`;
        
        // Prepare chat payload
        const requestBody = {
            contents: [
                {
                    role: 'user',
                    parts: [{ text: systemPrompt }]
                },
                ...state.chatHistory
            ],
            generationConfig: {
                temperature: 0.5,
                topP: 0.95
            }
        };
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });
        
        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.error?.message || 'Failed call to API');
        }
        
        const responseData = await response.json();
        const modelResponse = responseData.candidates[0].content.parts[0].text;
        
        removeTypingIndicator();
        renderMessage('assistant', modelResponse);
        
        // Add to history
        state.chatHistory.push({
            role: 'model',
            parts: [{ text: modelResponse }]
        });
        
    } catch (err) {
        console.error(err);
        removeTypingIndicator();
        renderMessage('assistant', `Sorry, I encountered an error answering that: ${err.message}. Please check your connection or API key.`);
    } finally {
        elements.chatInput.disabled = false;
        elements.btnSendMessage.disabled = false;
        elements.chatInput.focus();
    }
}

/* ==========================================================================
   UI RENDERING & DASHBOARD POPULATION
   ========================================================================== */
function populateDashboardUI(heuristics) {
    // Top Title
    elements.dashFileTitle.textContent = state.resumeFileName;
    
    // Extracted text tab
    elements.resumeTextContent.textContent = state.resumeText;

    // Checklists Summary Populator
    elements.listPassed.innerHTML = '';
    elements.listAlerts.innerHTML = '';
    
    // Section checklist passed
    if (heuristics.sections.education) appendCheckItem('passed', 'Education Section detected');
    else appendCheckItem('alert', 'Missing Core Section: Education', 'Add details on degrees or relevant courses.');
    
    if (heuristics.sections.experience) appendCheckItem('passed', 'Professional Experience Section detected');
    else appendCheckItem('alert', 'Missing Core Section: Experience', 'Ensure your work history is visible.');
    
    if (heuristics.sections.skills) appendCheckItem('passed', 'Skills Section detected');
    else appendCheckItem('alert', 'Missing Core Section: Skills', 'List tools, programming languages, or core competencies.');
    
    if (heuristics.sections.projects) appendCheckItem('passed', 'Projects Section detected');
    else appendCheckItem('alert', 'Missing Core Section: Projects (Optional)', 'Adding personal or academic projects showcases practical skills.');
    
    if (heuristics.sections.summary) appendCheckItem('passed', 'Profile summary/about section detected');
    else appendCheckItem('alert', 'Missing Profile Summary (Recommended)', 'Write a brief 2-3 line summary highlighting your key achievements.');

    // Contacts
    if (heuristics.contact.email) appendCheckItem('passed', 'Valid email address found');
    else appendCheckItem('alert', 'No email address found', 'Check the formatting of your email address.');

    if (heuristics.contact.phone) appendCheckItem('passed', 'Valid phone number found');
    else appendCheckItem('alert', 'No phone number found', 'Add a cell number so recruiters can easily reach you.');

    if (heuristics.contact.links) appendCheckItem('passed', 'LinkedIn/GitHub links found');
    else appendCheckItem('alert', 'No professional links detected', 'Consider adding your LinkedIn or GitHub profile link.');

    // Verbs, Clichés, quantification
    if (heuristics.actionVerbsCount >= 6) {
        appendCheckItem('passed', `Great usage of action verbs (${heuristics.actionVerbsCount} detected)`);
    } else {
        appendCheckItem('alert', `Weak action verbs usage (${heuristics.actionVerbsCount} detected)`, 'Use verbs like "Spearheaded, Optimized, Designed" to start bullet points.');
    }

    if (heuristics.clichésCount === 0) {
        appendCheckItem('passed', 'No weak buzzwords or clichés detected');
    } else {
        appendCheckItem('alert', `Buzzwords detected (${heuristics.clichésCount} found)`, `Avoid vague terms: ${heuristics.clichésFound.join(', ')}.`);
    }

    if (heuristics.quantificationCount >= 5) {
        appendCheckItem('passed', `Quantifiable achievements present (${heuristics.quantificationCount} numbers/metrics detected)`);
    } else {
        appendCheckItem('alert', 'Low metrics/numbers density', 'Try to quantify achievements (e.g. "Increased speed by 20%", "Managed $5k budget").');
    }

    if (heuristics.lengthRating === 'good') {
        appendCheckItem('passed', `Optimal resume length (${heuristics.wordCount} words)`);
    } else if (heuristics.lengthRating === 'too-short') {
        appendCheckItem('alert', `Resume is too short (${heuristics.wordCount} words)`, 'Add more details, experience, or bullet points.');
    } else {
        appendCheckItem('alert', `Resume is very long (${heuristics.wordCount} words)`, 'Keep your resume concise. Ideal length is 400-800 words.');
    }

    // Populate Detailed Accordion Lists
    populateDetailedAccordions(heuristics);
}

function appendCheckItem(type, text, subText = '') {
    const li = document.createElement('li');
    if (type === 'passed') {
        li.innerHTML = `<i class="fa-solid fa-circle-check text-success"></i> <div><strong>${text}</strong></div>`;
        elements.listPassed.appendChild(li);
    } else {
        li.innerHTML = `<i class="fa-solid fa-circle-exclamation text-danger"></i> <div><strong>${text}</strong>${subText ? `<p class="text-muted" style="margin-top:2px; font-size:12px;">${subText}</p>` : ''}</div>`;
        elements.listAlerts.appendChild(li);
    }
}

function populateDetailedAccordions(heuristics) {
    // Sections Tab suggestions
    let sectionHtml = '<ul>';
    const secStatus = (found) => found ? '<span class="sugg-badge pass">Pass</span>' : '<span class="sugg-badge fail">Missing</span>';
    sectionHtml += `<li class="${heuristics.sections.summary ? 'check-pass':'check-fail'}">${secStatus(heuristics.sections.summary)} <strong>Summary / Objective Section</strong>: Captures immediate attention at the top.</li>`;
    sectionHtml += `<li class="${heuristics.sections.experience ? 'check-pass':'check-fail'}">${secStatus(heuristics.sections.experience)} <strong>Work Experience Section</strong>: The core backbone of your history.</li>`;
    sectionHtml += `<li class="${heuristics.sections.skills ? 'check-pass':'check-fail'}">${secStatus(heuristics.sections.skills)} <strong>Skills / Tech Stack Section</strong>: Evaluated directly by search filters.</li>`;
    sectionHtml += `<li class="${heuristics.sections.education ? 'check-pass':'check-fail'}">${secStatus(heuristics.sections.education)} <strong>Education / Degrees Section</strong>: Validates credentials.</li>`;
    sectionHtml += `<li class="${heuristics.sections.projects ? 'check-pass':'check-warn'}">${heuristics.sections.projects ? secStatus(true) : '<span class="sugg-badge warn">Warning</span>'} <strong>Projects Section (Optional)</strong>: Great for bridging experience gaps.</li>`;
    sectionHtml += '</ul>';
    elements.suggSections.innerHTML = sectionHtml;

    // Content Tab suggestions
    let contentHtml = '<ul>';
    contentHtml += `<li class="${heuristics.quantificationCount >= 5 ? 'check-pass':'check-warn'}">
        <span class="sugg-badge ${heuristics.quantificationCount >= 5 ? 'pass':'warn'}">Quantification</span>
        Your resume has <strong>${heuristics.quantificationCount} metrics</strong> (numbers, percentages, currencies). 
        Target at least 5 metrics to prove the scale and results of your work.
    </li>`;
    contentHtml += `<li class="${heuristics.actionVerbsCount >= 6 ? 'check-pass':'check-warn'}">
        <span class="sugg-badge ${heuristics.actionVerbsCount >= 6 ? 'pass':'warn'}">Action Verbs</span>
        Found <strong>${heuristics.actionVerbsCount} strong verbs</strong>. 
        ${heuristics.actionVerbsCount > 0 ? `Detected verbs: <em>${heuristics.actionVerbsFound.slice(0, 8).join(', ')}</em>.` : 'We could not detect standard action verbs starting your lines.'}
        Use high-impact verbs instead of passive lines like "Responsible for...".
    </li>`;
    contentHtml += '</ul>';
    elements.suggContent.innerHTML = contentHtml;

    // Formatting & Contact
    let formatHtml = '<ul>';
    formatHtml += `<li class="${heuristics.lengthRating === 'good' ? 'check-pass':'check-fail'}">
        <span class="sugg-badge ${heuristics.lengthRating === 'good' ? 'pass':'fail'}">Word Count</span>
        Your resume has <strong>${heuristics.wordCount} words</strong>. Ideal is 300 to 1000. 
        ${heuristics.lengthRating === 'too-short' ? 'Your content is extremely brief. Explain technical details or results.' : ''}
        ${heuristics.lengthRating === 'too-long' ? 'Your resume is very verbose. Consolidate paragraphs into standard bullet lists.' : ''}
    </li>`;
    formatHtml += `<li class="${heuristics.contact.email && heuristics.contact.phone ? 'check-pass':'check-fail'}">
        <span class="sugg-badge ${heuristics.contact.email && heuristics.contact.phone ? 'pass':'fail'}">Contact Details</span>
        Email: ${heuristics.contact.email ? '✅ Detect':'❌ Missing'}. 
        Phone: ${heuristics.contact.phone ? '✅ Detect':'❌ Missing'}.
    </li>`;
    formatHtml += `<li class="${heuristics.contact.links ? 'check-pass':'check-warn'}">
        <span class="sugg-badge ${heuristics.contact.links ? 'pass':'warn'}">Profiles Links</span>
        Professional Links: ${heuristics.contact.links ? '✅ Detect':'❌ Missing'}. 
        Always include LinkedIn, GitHub (for programmers), or a portfolio domain link.
    </li>`;
    formatHtml += '</ul>';
    elements.suggFormatting.innerHTML = formatHtml;

    // Clichés
    let clichéHtml = '<ul>';
    if (heuristics.clichésCount === 0) {
        clichéHtml += `<li class="check-pass"><span class="sugg-badge pass">Clichés Clean</span> Excellent job! We didn't find any overused resume buzzwords.</li>`;
    } else {
        clichéHtml += `<li class="check-fail">
            <span class="sugg-badge fail">Buzzwords Found</span> 
            We found <strong>${heuristics.clichésCount} clichés</strong>: <em>${heuristics.clichésFound.join(', ')}</em>. 
            Replace these soft claims with hard, quantitative metrics to stand out.
        </li>`;
    }
    clichéHtml += '</ul>';
    elements.suggClichés.innerHTML = clichéHtml;
}

// Animate Overall & Category scores
function animateScores(overall, categories) {
    // Overall Radial Circle Animation
    const strokeDash = 251.2; // Circumference for r=40 (2 * pi * r)
    const offset = strokeDash - (overall / 100) * strokeDash;
    
    elements.scoreFillCircle.style.strokeDashoffset = offset;
    
    // Animate Number value
    let startVal = 0;
    const duration = 1000; // ms
    const stepTime = Math.abs(Math.floor(duration / overall));
    
    const timer = setInterval(() => {
        startVal += 1;
        elements.scoreValue.textContent = startVal;
        if (startVal >= overall) {
            clearInterval(timer);
            elements.scoreValue.textContent = overall;
        }
    }, stepTime);

    // Score Verdict text styling
    if (overall >= 80) {
        elements.scoreVerdict.textContent = "Excellent Resume!";
        elements.scoreVerdict.className = "score-verdict text-success";
        elements.scoreFillCircle.style.stroke = "var(--success)";
    } else if (overall >= 60) {
        elements.scoreVerdict.textContent = "Good / Competitive";
        elements.scoreVerdict.className = "score-verdict text-warning";
        elements.scoreFillCircle.style.stroke = "var(--warning)";
    } else {
        elements.scoreVerdict.textContent = "Needs Refinement";
        elements.scoreVerdict.className = "score-verdict text-danger";
        elements.scoreFillCircle.style.stroke = "var(--danger)";
    }

    // Category progress bars
    setTimeout(() => {
        elements.scoreFormattingText.textContent = `${categories.formattingScore}/100`;
        elements.progressFormatting.style.width = `${categories.formattingScore}%`;

        elements.scoreImpactText.textContent = `${categories.impactScore}/100`;
        elements.progressImpact.style.width = `${categories.impactScore}%`;

        elements.scoreSectionsText.textContent = `${categories.sectionsScore}/100`;
        elements.progressSections.style.width = `${categories.sectionsScore}%`;

        elements.scoreReadabilityText.textContent = `${categories.readabilityScore}/100`;
        elements.progressReadability.style.width = `${categories.readabilityScore}%`;
    }, 100);
}
