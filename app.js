/**
 * AuraMap - Main Application Script
 * Orchestrates UI interactions, progress tracking, sharing link generation, and offline templates.
 */

// --- OFFLINE ROADMAP TEMPLATES ---
const ROADMAP_TEMPLATES = {
    "Want to become ML Engineer": {
        title: "Machine Learning Engineer Career Path",
        description: "A comprehensive roadmap from mathematics fundamentals to training deep learning neural networks and deploying them into production MLOps pipelines.",
        difficulty: "Advanced",
        estimatedWeeks: 24,
        phases: [
            {
                id: "phase1",
                title: "Phase 1: Mathematical Foundations & Programming",
                weeks: "Weeks 1-6",
                description: "Master Python, linear algebra, calculus, and statistics required for understanding ML algorithms.",
                topics: [
                    {
                        id: "p1_t1",
                        title: "Advanced Linear Algebra & Calculus",
                        description: "Understand vectors, eigenvalues, matrix transformations, and multi-variable gradients necessary for gradient descent and backpropagation models.",
                        hours: 20,
                        difficulty: "Intermediate",
                        resources: [
                            { name: "Linear Algebra by Gilbert Strang (MIT)", link: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/", type: "Course", cost: "Free" },
                            { name: "Multivariable Calculus (Khan Academy)", link: "https://www.khanacademy.org/math/multivariable-calculus", type: "Course", cost: "Free" }
                        ],
                        skills: ["Matrix Operations", "Eigenvectors & Eigenvalues", "Partial Derivatives", "Gradient Vector Calc"],
                        tasks: [
                            "Manually compute the gradient vector for a simple 3-variable cost function.",
                            "Perform matrix multiplication and eigenvalue decomposition on paper, then verify in python."
                        ]
                    },
                    {
                        id: "p1_t2",
                        title: "Applied Probability & Statistics",
                        description: "Study probability distributions, Bayes theorem, hypothesis testing, and confidence intervals to evaluate models correctly.",
                        hours: 15,
                        difficulty: "Beginner",
                        resources: [
                            { name: "StatQuest with Josh Starmer", link: "https://www.youtube.com/c/joshstarmer", type: "Video", cost: "Free" },
                            { name: "Intro to Probability (MIT OCW)", link: "https://ocw.mit.edu/courses/6-041-probabilistic-systems-analysis-and-applied-probability-fall-2010/", type: "Course", cost: "Free" }
                        ],
                        skills: ["Bayes Theorem", "Probability Distributions", "Central Limit Theorem", "A/B Testing Basics"],
                        tasks: [
                            "Write a python script to simulate the Central Limit Theorem with random dice rolls.",
                            "Perform a two-sample t-test on sample data to verify statistical significance."
                        ]
                    },
                    {
                        id: "p1_t3",
                        title: "Scientific Python Stack",
                        description: "Learn Python, vectorized programming with NumPy, data cleaning with Pandas, and visualization with Matplotlib & Seaborn.",
                        hours: 15,
                        difficulty: "Beginner",
                        resources: [
                            { name: "Pandas Tutorial (Kaggle Learn)", link: "https://www.kaggle.com/learn/pandas", type: "Course", cost: "Free" },
                            { name: "NumPy Quickstart Guide", link: "https://numpy.org/doc/stable/user/quickstart.html", type: "Article", cost: "Free" }
                        ],
                        skills: ["NumPy Vectorization", "Pandas DataFrames", "Data Wrangling", "Data Visualization"],
                        tasks: [
                            "Load a dirty CSV file, remove duplicates, impute missing values, and normalize features.",
                            "Benchmark a nested loop vs a vectorized NumPy array operation to show speedup."
                        ]
                    }
                ]
            },
            {
                id: "phase2",
                title: "Phase 2: Classical Machine Learning",
                weeks: "Weeks 7-12",
                description: "Implement core supervised and unsupervised algorithms, understand feature engineering, and evaluation metrics.",
                topics: [
                    {
                        id: "p2_t1",
                        title: "Supervised Learning Algorithms",
                        description: "Study Regression, Decision Trees, Support Vector Machines (SVM), and Ensemble Methods like XGBoost/Random Forests.",
                        hours: 25,
                        difficulty: "Intermediate",
                        resources: [
                            { name: "Machine Learning Specialization (Andrew Ng)", link: "https://www.coursera.org/specializations/machine-learning-introduction", type: "Course", cost: "Paid" },
                            { name: "Scikit-Learn Guide (Official Docs)", link: "https://scikit-learn.org/stable/user_guide.html", type: "Article", cost: "Free" }
                        ],
                        skills: ["Regression Models", "Decision Trees & Forests", "SVM Classification", "Ensemble Learning (XGBoost)"],
                        tasks: [
                            "Train a Random Forest classifier in Scikit-Learn on tabular data and plot feature importances.",
                            "Implement Grid Search Cross-Validation to tune hyperparameters."
                        ]
                    },
                    {
                        id: "p2_t2",
                        title: "Unsupervised Learning & PCA",
                        description: "Identify clusters and perform dimensionality reduction on high-dimensional datasets.",
                        hours: 15,
                        difficulty: "Intermediate",
                        resources: [
                            { name: "Clustering Algorithms (Scikit-Learn)", link: "https://scikit-learn.org/stable/modules/clustering.html", type: "Article", cost: "Free" },
                            { name: "PCA Explanation (StatQuest)", link: "https://www.youtube.com/watch?v=FgakZw6K1QQ", type: "Video", cost: "Free" }
                        ],
                        skills: ["K-Means Clustering", "Hierarchical Clustering", "Principal Component Analysis (PCA)", "t-SNE"],
                        tasks: [
                            "Perform K-Means clustering on retail customer transactional data.",
                            "Apply PCA to compress the MNIST image dataset and visualize the variance plot."
                        ]
                    },
                    {
                        id: "p2_t3",
                        title: "Validation & Performance Metrics",
                        description: "Go beyond simple accuracy. Learn how to handle imbalanced datasets and select appropriate metrics.",
                        hours: 15,
                        difficulty: "Intermediate",
                        resources: [
                            { name: "Evaluation Metrics Guide", link: "https://machinelearningmastery.com/metrics-evaluate-machine-learning-algorithms-python/", type: "Article", cost: "Free" }
                        ],
                        skills: ["Precision, Recall & F1-Score", "ROC-AUC Curves", "Confusion Matrices", "Cross-Validation Techniques"],
                        tasks: [
                            "Build a binary classifier on an imbalanced fraud dataset, adjusting decision thresholds.",
                            "Plot the Precision-Recall Curve and calculate AUC."
                        ]
                    }
                ]
            },
            {
                id: "phase3",
                title: "Phase 3: Deep Learning foundations",
                weeks: "Weeks 13-18",
                description: "Deep dive into artificial neural networks, computer vision, and modern transformer architectures.",
                topics: [
                    {
                        id: "p3_t1",
                        title: "Neural Networks & Backpropagation",
                        description: "Understand the math behind multilayer perceptrons, activation functions, and weights optimization.",
                        hours: 25,
                        difficulty: "Advanced",
                        resources: [
                            { name: "Deep Learning Specialization", link: "https://www.coursera.org/specializations/deep-learning", type: "Course", cost: "Paid" },
                            { name: "Neural Networks Course (3Blue1Brown)", link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDNU6R1_67000Dx_ZCJB-3pi", type: "Video", cost: "Free" }
                        ],
                        skills: ["Multilayer Perceptrons", "Backpropagation Calculus", "Optimizers (Adam, SGD)", "Loss Functions"],
                        tasks: [
                            "Write a basic neural network with 1 hidden layer from scratch in NumPy.",
                            "Implement forward and backward passes manually in Python code."
                        ]
                    },
                    {
                        id: "p3_t2",
                        title: "Computer Vision & CNNs",
                        description: "Learn Convolutional Neural Networks (CNNs) for image detection, classification, and segmentation.",
                        hours: 20,
                        difficulty: "Advanced",
                        resources: [
                            { name: "CS231n: Computer Vision (Stanford)", link: "http://cs231n.stanford.edu/", type: "Course", cost: "Free" },
                            { name: "PyTorch Image Tutorials", link: "https://pytorch.org/tutorials/beginner/blitz/cifar10_tutorial.html", type: "Article", cost: "Free" }
                        ],
                        skills: ["Convolution & Pooling", "PyTorch Tensors", "CNN Architectures (ResNet)", "Data Augmentation"],
                        tasks: [
                            "Build a custom CNN in PyTorch to classify images in CIFAR-10.",
                            "Apply transfer learning on ResNet-50 to classify custom objects."
                        ]
                    },
                    {
                        id: "p3_t3",
                        title: "NLP & Transformer Architectures",
                        description: "Understand sequence modeling, self-attention, and fine-tuning Pretrained Large Language Models.",
                        hours: 25,
                        difficulty: "Advanced",
                        resources: [
                            { name: "Hugging Face Course", link: "https://huggingface.co/learn/nlp-course", type: "Course", cost: "Free" },
                            { name: "Illustrated Transformer", link: "http://jalammar.github.io/illustrated-transformer/", type: "Article", cost: "Free" }
                        ],
                        skills: ["Attention Mechanisms", "Transformers (BERT, GPT)", "Word Embeddings", "Hugging Face APIs"],
                        tasks: [
                            "Fine-tune a DistilBERT model for sentiment analysis on IMDB movie reviews.",
                            "Implement basic text generation using pretrained Hugging Face pipelines."
                        ]
                    }
                ]
            },
            {
                id: "phase4",
                title: "Phase 4: MLOps & Production Engineering",
                weeks: "Weeks 19-24",
                description: "Shift models from notebooks to automated production deployments, APIs, and monitor scaling.",
                topics: [
                    {
                        id: "p4_t1",
                        title: "Model Deployment & Docker APIs",
                        description: "Wrap your model inside web servers (FastAPI/Flask) and package dependencies into containerized apps.",
                        hours: 20,
                        difficulty: "Advanced",
                        resources: [
                            { name: "Made With ML (MLOps Guide)", link: "https://madewithml.com/", type: "Course", cost: "Free" },
                            { name: "Docker Containerization Guide", link: "https://docs.docker.com/get-started/", type: "Article", cost: "Free" }
                        ],
                        skills: ["FastAPI Service Routing", "Docker Containers", "Model Serialization (ONNX)", "Postman/Client Tests"],
                        tasks: [
                            "Serialize a Scikit-Learn model to a `.pkl` file and host a prediction API endpoint with FastAPI.",
                            "Dockerize the FastAPI application and deploy it locally."
                        ]
                    },
                    {
                        id: "p4_t2",
                        title: "CI/CD & Monitoring Pipelines",
                        description: "Version datasets, track experiment hyper-parameters with MLflow, and orchestrate automation.",
                        hours: 20,
                        difficulty: "Advanced",
                        resources: [
                            { name: "DVC Tutorial", link: "https://dvc.org/doc/start", type: "Article", cost: "Free" },
                            { name: "MLflow Tracking documentation", link: "https://mlflow.org/docs/latest/index.html", type: "Article", cost: "Free" }
                        ],
                        skills: ["Data Version Control (DVC)", "MLflow Experiment Logs", "GitHub Actions CI/CD", "Drift Monitoring"],
                        tasks: [
                            "Setup MLflow to track parameters, validation metrics, and model versions.",
                            "Write a GitHub Actions script to trigger automated training tests when data changes."
                        ]
                    }
                ]
            }
        ],
        projects: [
            {
                title: "1. California Housing Regression Pipeline",
                level: "Beginner",
                description: "Clean data, perform EDA, and build optimized Scikit-Learn regression trees to predict prices.",
                stack: ["Python", "Pandas", "Scikit-Learn", "Matplotlib"],
                steps: [
                    "Download datasets and plot feature correlation heatmaps.",
                    "Build custom pipeline transformers for data imputation.",
                    "Optimize XGBoost Regressor hyperparameters using RandomizedSearchCV.",
                    "Export model files and record validation RMSE."
                ]
            },
            {
                title: "2. Image Classifier FastAPI Endpoint",
                level: "Intermediate",
                description: "Fine-tune ResNet-50 for a custom dataset, build an image classification API, and containerize.",
                stack: ["PyTorch", "FastAPI", "Docker", "Python"],
                steps: [
                    "Scrape/aggregate dataset for 5 custom classes.",
                    "Fine-tune PyTorch pretrained ResNet-50 weights.",
                    "Create FastAPI POST endpoint taking image payload.",
                    "Dockerize the application and verify responses locally."
                ]
            },
            {
                title: "3. Complete MLOps Pipeline Automation",
                level: "Advanced",
                description: "Integrate DVC data versioning, MLflow experiment registry, and automated CI/CD deployment pipelines.",
                stack: ["DVC", "MLflow", "GitHub Actions", "Docker", "FastAPI"],
                steps: [
                    "Commit dataset changes via DVC and sync with local directory.",
                    "Write automated test scripts testing data metrics.",
                    "Deploy MLflow model artifact dashboard tracking metrics.",
                    "Configure GitHub Actions to rebuild Docker container on merge."
                ]
            }
        ]
    },
    "Frontend Developer with React": {
        title: "Frontend Developer (React Track)",
        description: "From structural HTML semantics and flexbox layouts to complex Single Page Application architectures and state management.",
        difficulty: "Intermediate",
        estimatedWeeks: 16,
        phases: [
            {
                id: "phase1",
                title: "Phase 1: Core Technologies",
                weeks: "Weeks 1-4",
                description: "Master HTML5 semantics, responsive CSS configurations, and vanilla JavaScript mechanics.",
                topics: [
                    {
                        id: "p1_t1",
                        title: "Semantic HTML & Responsive CSS",
                        description: "Learn correct DOM structures, accessibility standards, Flexbox, and CSS Grid systems.",
                        hours: 15,
                        difficulty: "Beginner",
                        resources: [
                            { name: "MDN Web Docs - Learn Web Dev", link: "https://developer.mozilla.org/en-US/docs/Learn", type: "Course", cost: "Free" },
                            { name: "CSS Grid Garden Game", link: "https://cssgridgarden.com/", type: "Article", cost: "Free" }
                        ],
                        skills: ["HTML5 Semantic Tags", "CSS Grid & Flexbox", "Media Queries", "Web Accessibility (A11y)"],
                        tasks: [
                            "Build a fully responsive landing page grid from scratch without frameworks.",
                            "Audit page contrast and semantic structure using screen-reader tools."
                        ]
                    },
                    {
                        id: "p1_t2",
                        title: "Modern JavaScript (ES6+)",
                        description: "Understand variables scope, arrow functions, destructuring, promises, async/await, and DOM APIs.",
                        hours: 20,
                        difficulty: "Beginner",
                        resources: [
                            { name: "JavaScript.info", link: "https://javascript.info/", type: "Book", cost: "Free" },
                            { name: "Eloquent JavaScript", link: "https://eloquentjavascript.net/", type: "Book", cost: "Free" }
                        ],
                        skills: ["Asynchronous JS", "ES6+ Array Methods", "DOM Manipulation", "Fetch API Integration"],
                        tasks: [
                            "Write an interactive app fetching weather details from a public API.",
                            "Filter, sort, and map array datasets using high-order functional commands."
                        ]
                    }
                ]
            },
            {
                id: "phase2",
                title: "Phase 2: React Core Fundamentals",
                weeks: "Weeks 5-8",
                description: "Initialize React setups, master JSX compiler logic, component props, and functional hooks.",
                topics: [
                    {
                        id: "p2_t1",
                        title: "Components, Props & JSX",
                        description: "Deconstruct mock interfaces into reusable UI components, styling approaches, and prop transfers.",
                        hours: 15,
                        difficulty: "Intermediate",
                        resources: [
                            { name: "React Official Docs - Describing the UI", link: "https://react.dev/learn/describing-the-ui", type: "Article", cost: "Free" }
                        ],
                        skills: ["JSX Compilation Syntax", "Component Hierarchy", "Props Drilling Basics", "Conditional Rendering"],
                        tasks: [
                            "Convert static layout mocks into clean nested functional React code components.",
                            "Pass static array parameters downwards into child layout blocks."
                        ]
                    },
                    {
                        id: "p2_t2",
                        title: "State Management & Key Hooks",
                        description: "Understand state persistence, triggers, and built-in hooks (useState, useEffect, useRef).",
                        hours: 20,
                        difficulty: "Intermediate",
                        resources: [
                            { name: "React - Managing State", link: "https://react.dev/learn/managing-state", type: "Article", cost: "Free" }
                        ],
                        skills: ["useState hook state updates", "useEffect lifecycle events", "useRef elements tracking", "Context API sharing"],
                        tasks: [
                            "Develop a multi-step form stepper storing form parts state in parent structures.",
                            "Perform API data fetches triggered by hook input selections."
                        ]
                    }
                ]
            },
            {
                id: "phase3",
                title: "Phase 3: Advanced Ecosystem APIs",
                weeks: "Weeks 9-12",
                description: "Integrate client routing packages, configure global state managers, and write production test suites.",
                topics: [
                    {
                        id: "p3_t1",
                        title: "Routing & Form Actions",
                        description: "Construct client-side browser route systems with React Router and handle inputs validation.",
                        hours: 15,
                        difficulty: "Intermediate",
                        resources: [
                            { name: "React Router documentation", link: "https://reactrouter.com/en/main", type: "Article", cost: "Free" }
                        ],
                        skills: ["Dynamic Route Params", "Protected Routing setup", "Forms Validation schemas"],
                        tasks: [
                            "Build a catalog shop showing detailed item layouts via URL parameters.",
                            "Secure specific admin pages using simulated session route authorization checkers."
                        ]
                    },
                    {
                        id: "p3_t2",
                        title: "Global State & Redux Toolkit",
                        description: "Manage global shared data grids across massive component configurations.",
                        hours: 20,
                        difficulty: "Advanced",
                        resources: [
                            { name: "Redux Toolkit Tutorial", link: "https://redux-toolkit.js.org/tutorials/quick-start", type: "Course", cost: "Free" }
                        ],
                        skills: ["Redux Store Config", "Actions & Reducers", "Slices Setup", "Thunk Asynchronous Actions"],
                        tasks: [
                            "Integrate Redux store inside shopping cart app handling additions and totals adjustments.",
                            "Trigger API updates through Redux Thunks logging loaders status."
                        ]
                    }
                ]
            },
            {
                id: "phase4",
                title: "Phase 4: Tooling & Next.js",
                weeks: "Weeks 13-16",
                description: "Learn Server-Side Rendering (SSR) paradigms and compile components using Next.js framework structures.",
                topics: [
                    {
                        id: "p4_t1",
                        title: "Next.js App Router & SSR",
                        description: "Optimize page rankings (SEO) and render performance using static generation pipelines.",
                        hours: 25,
                        difficulty: "Advanced",
                        resources: [
                            { name: "Next.js Learning Dashboard", link: "https://nextjs.org/learn", type: "Course", cost: "Free" }
                        ],
                        skills: ["Server Components vs Client Components", "Static Site Generation (SSG)", "Server Action endpoints", "Next.js Image Optimizer"],
                        tasks: [
                            "Construct a markdown blog rendering dynamic article pages from local files at compile time.",
                            "Implement API route handler returning user details."
                        ]
                    }
                ]
            }
        ],
        projects: [
            {
                title: "1. Personal Workspace Kanban Tool",
                level: "Beginner",
                description: "Draggable project cards app allowing column movements, storage caching, and lists naming.",
                stack: ["React", "HTML5 Drag-Drop", "CSS Modules", "LocalStorage"],
                steps: [
                    "Structure Task columns interface layout.",
                    "Configure drag handlers shifting task items inside state arrays.",
                    "Mount useEffect hooks syncing updates to browser storage cache.",
                    "Implement search bar filtering tasks tags."
                ]
            },
            {
                title: "2. Full Catalog Store Dashboard",
                level: "Intermediate",
                description: "Advanced catalog marketplace featuring filtering options, Redux cart management, and router pages.",
                stack: ["React", "Redux Toolkit", "React Router", "Vanilla CSS"],
                steps: [
                    "Fetch database cards arrays from public store APIs.",
                    "Route details layouts based on item IDs.",
                    "Integrate RTK actions checking checkout item duplicates.",
                    "Handle checkout validation configurations."
                ]
            },
            {
                title: "3. Next.js SaaS Portfolio Architect",
                level: "Advanced",
                description: "Beautiful static portfolio website integrating Next.js SSR, dynamic dark layouts, and API forms.",
                stack: ["Next.js", "App Router", "TailwindCSS", "Vercel Deployment"],
                steps: [
                    "Configure folder schemas structuring page indexes.",
                    "Setup metadata headers verifying SEO parameters.",
                    "Write serverless contact email parser routes.",
                    "Deploy code repository directly onto Vercel dashboard."
                ]
            }
        ]
    }
};

// Add fallback handler for generic suggestions
const FALLBACK_TOPICS = [
    "Cybersecurity Specialist",
    "Data Scientist from scratch"
];

// --- APP CONTROLLER AND STATE ---
const AuraMapApp = {
    state: {
        activeRoadmap: null,
        completedTopics: {}, // format: { 'roadmapTitle': { 'topicId': true } }
        completedProjectTasks: {}, // format: { 'roadmapTitle': { 'projectIdx_stepIdx': true } }
        apiKey: localStorage.getItem('auramap_api_key') || '',
        model: localStorage.getItem('auramap_model') || 'gemini-3.5-flash',
        activeTheme: localStorage.getItem('auramap_theme') || 'dark',
        selectedTopic: null
    },

    dom: {
        // Layout Elements
        heroSection: document.getElementById('heroSection'),
        loadingSection: document.getElementById('loadingSection'),
        workspaceSection: document.getElementById('workspaceSection'),
        generatorForm: document.getElementById('generatorForm'),
        goalInput: document.getElementById('goalInput'),
        generateBtn: document.getElementById('generateBtn'),
        headerLogo: document.getElementById('headerLogo'),
        
        // Settings Modal
        settingsModal: document.getElementById('settingsModal'),
        openSettingsBtn: document.getElementById('openSettingsBtn'),
        closeSettingsBtnX: document.getElementById('closeSettingsBtnX'),
        saveSettingsBtn: document.getElementById('saveSettingsBtn'),
        clearApiKeyBtn: document.getElementById('clearApiKeyBtn'),
        apiKeyInput: document.getElementById('apiKeyInput'),
        modelSelect: document.getElementById('modelSelect'),
        toggleApiKeyVisibility: document.getElementById('toggleApiKeyVisibility'),
        apiStatusBadge: document.getElementById('apiStatusBadge'),
        
        // Workspace Elements
        currentRoadmapTitle: document.getElementById('currentRoadmapTitle'),
        currentRoadmapDesc: document.getElementById('currentRoadmapDesc'),
        backToHomeBtn: document.getElementById('backToHomeBtn'),
        pdfExportBtn: document.getElementById('pdfExportBtn'),
        shareRoadmapBtn: document.getElementById('shareRoadmapBtn'),
        roadmapTimeline: document.getElementById('roadmapTimeline'),
        projectsContainer: document.getElementById('projectsContainer'),
        
        // Stats
        statWeeks: document.getElementById('statWeeks'),
        statTopics: document.getElementById('statTopics'),
        overallProgressRing: document.getElementById('overallProgressRing'),
        overallProgressPercent: document.getElementById('overallProgressPercent'),
        statProgressText: document.getElementById('statProgressText'),
        
        // Side Drawer
        topicDrawer: document.getElementById('topicDrawer'),
        drawerBackdrop: document.getElementById('drawerBackdrop'),
        closeDrawerBtn: document.getElementById('closeDrawerBtn'),
        drawerTitle: document.getElementById('drawerTitle'),
        drawerDifficulty: document.getElementById('drawerDifficulty'),
        drawerHours: document.getElementById('drawerHours'),
        drawerDesc: document.getElementById('drawerDesc'),
        drawerSkillsList: document.getElementById('drawerSkillsList'),
        drawerTasksChecklist: document.getElementById('drawerTasksChecklist'),
        drawerResourcesList: document.getElementById('drawerResourcesList'),
        markTopicCompleteBtn: document.getElementById('markTopicCompleteBtn'),
        
        // Shell Utilities
        themeToggleBtn: document.getElementById('themeToggleBtn'),
        toastContainer: document.getElementById('toastContainer'),
        loadingStage: document.getElementById('loadingStage'),
        loadingProgress: document.getElementById('loadingProgress')
    },

    init() {
        this.loadSettings();
        this.bindEvents();
        this.applyTheme();
        this.checkURLHash();
    },

    loadSettings() {
        // Automatically migrate legacy/deprecated models
        if (this.state.model.includes('gemini-1.5') || this.state.model.includes('gemini-2.0')) {
            this.state.model = 'gemini-3.5-flash';
            localStorage.setItem('auramap_model', 'gemini-3.5-flash');
        }
        
        this.dom.apiKeyInput.value = this.state.apiKey;
        this.dom.modelSelect.value = this.state.model;
        this.updateApiStatusUI();
    },

    updateApiStatusUI() {
        if (this.state.apiKey) {
            this.dom.apiStatusBadge.className = 'status-badge status-online';
            this.dom.apiStatusBadge.innerHTML = '<i class="fa-solid fa-circle-check"></i> API Live Mode';
        } else {
            this.dom.apiStatusBadge.className = 'status-badge status-offline';
            this.dom.apiStatusBadge.innerHTML = '<i class="fa-solid fa-circle-pause"></i> Demo Offline Mode';
        }
    },

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.state.activeTheme);
        const icon = this.dom.themeToggleBtn.querySelector('i');
        if (this.state.activeTheme === 'light') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    },

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        let iconClass = 'fa-info-circle';
        if (type === 'success') iconClass = 'fa-circle-check';
        if (type === 'error') iconClass = 'fa-triangle-exclamation';
        
        toast.innerHTML = `
            <i class="fa-solid ${iconClass}"></i>
            <span>${message}</span>
        `;
        this.dom.toastContainer.appendChild(toast);
        
        // Fade out & destroy
        setTimeout(() => {
            toast.style.animation = 'toast-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) reverse forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3500);
    },

    bindEvents() {
        // Theme switch
        this.dom.themeToggleBtn.addEventListener('click', () => {
            this.state.activeTheme = this.state.activeTheme === 'dark' ? 'light' : 'dark';
            localStorage.setItem('auramap_theme', this.state.activeTheme);
            this.applyTheme();
        });

        // Settings Modal controls
        this.dom.openSettingsBtn.addEventListener('click', () => {
            this.dom.settingsModal.classList.add('active');
        });
        
        const closeModal = () => {
            this.dom.settingsModal.classList.remove('active');
        };
        this.dom.closeSettingsBtnX.addEventListener('click', closeModal);
        this.dom.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.dom.settingsModal) closeModal();
        });

        // Save settings
        this.dom.saveSettingsBtn.addEventListener('click', () => {
            const newKey = this.dom.apiKeyInput.value.trim();
            const newModel = this.dom.modelSelect.value;
            
            this.state.apiKey = newKey;
            this.state.model = newModel;
            localStorage.setItem('auramap_api_key', newKey);
            localStorage.setItem('auramap_model', newModel);
            
            this.updateApiStatusUI();
            closeModal();
            this.showToast('AI Settings updated successfully.', 'success');
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
        // Clear API Key
        this.dom.clearApiKeyBtn.addEventListener('click', () => {
            this.dom.apiKeyInput.value = '';
            this.state.apiKey = '';
            localStorage.removeItem('auramap_api_key');
            this.updateApiStatusUI();
            this.showToast('API Key cleared. Switched to offline demo mode.', 'info');
        });

        // Toggle Key Visibility
        this.dom.toggleApiKeyVisibility.addEventListener('click', () => {
            const input = this.dom.apiKeyInput;
            const icon = this.dom.toggleApiKeyVisibility.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.className = 'fa-solid fa-eye-slash';
            } else {
                input.type = 'password';
                icon.className = 'fa-solid fa-eye';
            }
        });

        // Suggested Chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const val = chip.getAttribute('data-path');
                this.dom.goalInput.value = val;
                this.handleRoadmapGeneration(val);
            });
        });

        // Form Submit
        this.dom.generatorForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const goalVal = this.dom.goalInput.value.trim();
            if (goalVal) {
                this.handleRoadmapGeneration(goalVal);
            }
        });

        // Logo returns home
        this.dom.headerLogo.addEventListener('click', () => {
            this.resetToHome();
        });
        
        this.dom.backToHomeBtn.addEventListener('click', () => {
            this.resetToHome();
        });

        // Export PDF
        this.dom.pdfExportBtn.addEventListener('click', () => {
            this.showToast('Formatting page layout for PDF generation... Set layout to Landscape and enable Background graphics for optimal styling.', 'info');
            setTimeout(() => {
                window.print();
            }, 800);
        });

        // Share Roadmap
        this.dom.shareRoadmapBtn.addEventListener('click', () => {
            this.shareActiveRoadmap();
        });

        // Side Drawer close
        const closeDrawer = () => {
            this.dom.topicDrawer.classList.remove('active');
            this.dom.drawerBackdrop.classList.remove('active');
            this.state.selectedTopic = null;
        };
        this.dom.closeDrawerBtn.addEventListener('click', closeDrawer);
        this.dom.drawerBackdrop.addEventListener('click', closeDrawer);

        // Mark complete button in Drawer
        this.dom.markTopicCompleteBtn.addEventListener('click', () => {
            if (this.state.selectedTopic) {
                this.toggleTopicCompletion(this.state.selectedTopic.id);
            }
        });
    },

    resetToHome() {
        this.state.activeRoadmap = null;
        this.dom.goalInput.value = '';
        this.dom.workspaceSection.style.display = 'none';
        this.dom.heroSection.style.display = 'flex';
        this.dom.shareRoadmapBtn.style.display = 'none';
        window.location.hash = '';
    },

    async handleRoadmapGeneration(goal) {
        // Show loading
        this.dom.heroSection.style.display = 'none';
        this.dom.workspaceSection.style.display = 'none';
        this.dom.loadingSection.style.display = 'flex';
        this.dom.shareRoadmapBtn.style.display = 'none';
        
        // Progress stage simulation
        const stages = [
            { text: 'Retrieving essential domain prerequisites...', progress: 15 },
            { text: 'Architecting week-by-week visual milestones...', progress: 40 },
            { text: 'Sourcing curated links and textbooks...', progress: 65 },
            { text: 'Assembling capstone building exercises...', progress: 85 },
            { text: 'Finalizing roadmap blueprints...', progress: 100 }
        ];

        let stageIndex = 0;
        const stageInterval = setInterval(() => {
            if (stageIndex < stages.length) {
                this.dom.loadingStage.innerText = stages[stageIndex].text;
                this.dom.loadingProgress.style.width = `${stages[stageIndex].progress}%`;
                stageIndex++;
            }
        }, 600);

        try {
            let roadmapData = null;

            // Check if API Key exists
            if (this.state.apiKey) {
                // Generate dynamically via Gemini API
                roadmapData = await generateAuraRoadmap(goal, this.state.apiKey, this.state.model);
            } else {
                // Look for offline matching template
                const normalizedGoal = goal.toLowerCase();
                let matchedKey = null;

                for (const key of Object.keys(ROADMAP_TEMPLATES)) {
                    if (normalizedGoal.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedGoal)) {
                        matchedKey = key;
                        break;
                    }
                }

                if (matchedKey) {
                    roadmapData = ROADMAP_TEMPLATES[matchedKey];
                } else {
                    // Generate smart mock roadmap offline
                    roadmapData = this.generateSmartMockRoadmap(goal);
                }
            }

            clearInterval(stageInterval);
            this.dom.loadingProgress.style.width = '100%';
            
            setTimeout(() => {
                this.dom.loadingSection.style.display = 'none';
                this.renderRoadmap(roadmapData);
            }, 500);

        } catch (err) {
            clearInterval(stageInterval);
            console.error('API call failed, running local fallback logic:', err);
            
            // Look for offline matching template
            const normalizedGoal = goal.toLowerCase();
            let matchedKey = null;

            for (const key of Object.keys(ROADMAP_TEMPLATES)) {
                if (normalizedGoal.includes(key.toLowerCase()) || key.toLowerCase().includes(normalizedGoal)) {
                    matchedKey = key;
                    break;
                }
            }

            this.dom.loadingSection.style.display = 'none';
            this.showToast(`AI server busy (503). Loaded local path blueprint successfully!`, 'warning');

            let roadmapData = matchedKey ? ROADMAP_TEMPLATES[matchedKey] : this.generateSmartMockRoadmap(goal);
            this.renderRoadmap(roadmapData);
        }
    },

    /**
     * Fallback dynamic smart mock generator when no API key and no templates match the query.
     */
    generateSmartMockRoadmap(goal) {
        return {
            title: `Path to master ${goal}`,
            description: `A custom generated curriculum outlining structured learning nodes, tasks, and projects for ${goal}.`,
            difficulty: 'Intermediate',
            estimatedWeeks: 12,
            phases: [
                {
                    id: 'p1',
                    title: 'Phase 1: Foundations & Environment Setup',
                    weeks: 'Weeks 1-4',
                    description: 'Acquire tools, understand basic terminologies, and write first simple code scripts.',
                    topics: [
                        {
                            id: 'p1_t1',
                            title: 'Terminology & Local Tooling',
                            description: `Setting up developer workstations, configuration controls, and exploring glossary foundations for ${goal}.`,
                            hours: 10,
                            difficulty: 'Beginner',
                            resources: [
                                { name: 'Official Documentation Quickstart', link: 'https://google.com', type: 'Article', cost: 'Free' },
                                { name: 'Tooling Crash Course on YouTube', link: 'https://youtube.com', type: 'Video', cost: 'Free' }
                            ],
                            skills: ['Environment Setup', 'Terminology Basics', 'CLI Controls'],
                            tasks: [
                                'Install required compiler packages and test standard inputs.',
                                'Document core concepts in a markdown cheat-sheet file.'
                            ]
                        },
                        {
                            id: 'p1_t2',
                            title: 'Core Principles & Syntax',
                            description: 'Learn basic components, building blocks, and syntax mechanics.',
                            hours: 15,
                            difficulty: 'Beginner',
                            resources: [
                                { name: 'Introductory Course', link: 'https://freecodecamp.org', type: 'Course', cost: 'Free' }
                            ],
                            skills: ['Syntax Control', 'Variables & Flow', 'Logic Arrays'],
                            tasks: [
                                'Build three mini scripts outputting different calculated variables.',
                                'Review stack traces to understand error logs.'
                            ]
                        }
                    ]
                },
                {
                    id: 'p2',
                    title: 'Phase 2: Intermediate Workflows',
                    weeks: 'Weeks 5-8',
                    description: 'Explore advanced algorithms, file handling, standard API implementations.',
                    topics: [
                        {
                            id: 'p2_t1',
                            title: 'Modular Implementations',
                            description: 'Refactoring script workflows, building packages, and handling asynchronous promises.',
                            hours: 18,
                            difficulty: 'Intermediate',
                            resources: [
                                { name: 'Intermediate Design Patterns', link: 'https://wikipedia.org', type: 'Book', cost: 'Free' }
                            ],
                            skills: ['Refactoring', 'Asynchronous flow', 'Modular structures'],
                            tasks: [
                                'Decompose linear script architectures into reusable module imports.',
                                'Deploy async wait structures to simulate asynchronous operations.'
                            ]
                        },
                        {
                            id: 'p2_t2',
                            title: 'Data Integration & Serialization',
                            description: 'Query database interfaces, handle data serializations, and connect endpoints.',
                            hours: 12,
                            difficulty: 'Intermediate',
                            resources: [
                                { name: 'Working with APIs and Data', link: 'https://google.com', type: 'Article', cost: 'Free' }
                            ],
                            skills: ['API Connections', 'Data Schemas', 'Errors Handling'],
                            tasks: [
                                'Fetch data arrays from a mock cloud service endpoint.',
                                'Verify validation tests handling error responses.'
                            ]
                        }
                    ]
                },
                {
                    id: 'p3',
                    title: 'Phase 3: Advanced Architectures & Optimization',
                    weeks: 'Weeks 9-12',
                    description: 'Scale systems, build tests coverage pipelines, deploy endpoints to production cloud systems.',
                    topics: [
                        {
                            id: 'p3_t1',
                            title: 'Performance & Systems Scaling',
                            description: 'Diagnose processing limits, optimize loops, configure local caching.',
                            hours: 20,
                            difficulty: 'Advanced',
                            resources: [
                                { name: 'Optimizations Best Practices', link: 'https://google.com', type: 'Article', cost: 'Free' }
                            ],
                            skills: ['System Benchmarking', 'Caching Mechanics', 'Resource Allocation'],
                            tasks: [
                                'Perform automated benchmarking profiling scripts performance.',
                                'Implement storage cache nodes saving network resources.'
                            ]
                        }
                    ]
                }
            ],
            projects: [
                {
                    title: `1. Interactive Prototype Core`,
                    level: 'Beginner',
                    description: `A fully functioning local environment app validating foundational concepts.`,
                    stack: ['JavaScript', 'HTML5', 'CSS'],
                    steps: [
                        'Setup git repository and config configurations.',
                        'Implement interface layout and components.',
                        'Validate user interactions data fields.'
                    ]
                },
                {
                    title: `2. Integrated Performance Pipeline`,
                    level: 'Advanced',
                    description: `An optimized scalable automation model connecting external details.`,
                    stack: ['Python', 'Docker', 'API Endpoints'],
                    steps: [
                        'Configure modular API router integrations.',
                        'Build docker container package configuration files.',
                        'Automate testing workflows before deployment.'
                    ]
                }
            ]
        };
    },

    renderRoadmap(roadmap) {
        this.state.activeRoadmap = roadmap;
        
        // Show components
        this.dom.workspaceSection.style.display = 'block';
        this.dom.shareRoadmapBtn.style.display = 'inline-flex';
        
        // Render titles
        this.dom.currentRoadmapTitle.innerText = roadmap.title;
        this.dom.currentRoadmapDesc.innerText = roadmap.description;
        
        // Update stats
        this.dom.statWeeks.innerText = `${roadmap.estimatedWeeks} Weeks`;
        
        let totalTopics = 0;
        roadmap.phases.forEach(phase => {
            totalTopics += phase.topics.length;
        });
        this.dom.statTopics.innerText = `${totalTopics} Topics`;

        // Render timeline paths
        this.renderTimelineElements(roadmap);
        
        // Render projects
        this.renderProjects(roadmap);
        
        // Sync progress indicators
        this.updateProgressState();
    },

    renderTimelineElements(roadmap) {
        this.dom.roadmapTimeline.innerHTML = '';
        const currentRoadmapId = this.getRoadmapId(roadmap.title);

        roadmap.phases.forEach((phase) => {
            const phaseBlock = document.createElement('div');
            phaseBlock.className = 'phase-block';
            
            // Header
            phaseBlock.innerHTML = `
                <div class="phase-dot"></div>
                <div class="phase-header">
                    <span class="phase-title-text">${phase.title}</span>
                    <span class="phase-duration">${phase.weeks}</span>
                </div>
            `;
            
            const topicsContainer = document.createElement('div');
            topicsContainer.className = 'phase-topics';
            
            phase.topics.forEach((topic) => {
                const card = document.createElement('div');
                card.className = 'topic-card';
                card.setAttribute('data-id', topic.id);
                
                const isCompleted = this.isTopicCompleted(currentRoadmapId, topic.id);
                if (isCompleted) {
                    card.classList.add('completed');
                }

                card.innerHTML = `
                    <div class="topic-main">
                        <div class="topic-card-header">
                            <span class="topic-checkbox-wrapper" title="Mark as learned">
                                ${isCompleted ? '<i class="fa-solid fa-check"></i>' : ''}
                            </span>
                            <h4 class="topic-title">${topic.title}</h4>
                        </div>
                        <p class="topic-desc-short">${topic.description}</p>
                        <div class="topic-badge-row">
                            <span class="mini-badge hours"><i class="fa-solid fa-hourglass-half"></i> ${topic.hours} hrs</span>
                            <span class="mini-badge difficulty"><i class="fa-solid fa-signal"></i> ${topic.difficulty}</span>
                        </div>
                    </div>
                    <div class="topic-action">
                        <i class="fa-solid fa-chevron-right"></i>
                    </div>
                `;

                // Handle click card (Opens Drawer)
                card.addEventListener('click', (e) => {
                    // Check if checkbox clicked specifically
                    if (e.target.closest('.topic-checkbox-wrapper')) {
                        e.stopPropagation();
                        this.toggleTopicCompletion(topic.id);
                    } else {
                        this.openTopicDetails(topic);
                    }
                });

                topicsContainer.appendChild(card);
            });
            
            phaseBlock.appendChild(topicsContainer);
            this.dom.roadmapTimeline.appendChild(phaseBlock);
        });
    },

    renderProjects(roadmap) {
        this.dom.projectsContainer.innerHTML = '';
        const currentRoadmapId = this.getRoadmapId(roadmap.title);

        if (!roadmap.projects || roadmap.projects.length === 0) {
            this.dom.projectsContainer.innerHTML = '<p class="section-desc">No projects specified for this roadmap.</p>';
            return;
        }

        roadmap.projects.forEach((proj, projIdx) => {
            const card = document.createElement('div');
            card.className = 'project-card';
            
            const tagsHTML = proj.stack.map(tag => `<span class="stack-tag">${tag}</span>`).join('');
            
            let milestonesHTML = '';
            if (proj.steps && proj.steps.length > 0) {
                milestonesHTML = `
                    <div class="project-milestones">
                        ${proj.steps.map((step, stepIdx) => {
                            const milestoneKey = `${projIdx}_${stepIdx}`;
                            const isDone = this.isProjectTaskCompleted(currentRoadmapId, milestoneKey);
                            
                            return `
                                <div class="milestone-item ${isDone ? 'completed' : ''}" data-key="${milestoneKey}">
                                    <div class="milestone-check">
                                        ${isDone ? '<i class="fa-solid fa-check"></i>' : ''}
                                    </div>
                                    <span>${step}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                `;
            }

            card.innerHTML = `
                <div class="project-header">
                    <h4 class="project-title">${proj.title}</h4>
                    <span class="project-badge">${proj.level}</span>
                </div>
                <p class="project-desc">${proj.description}</p>
                <div class="project-stack">
                    ${tagsHTML}
                </div>
                ${milestonesHTML}
            `;

            // Bind click to milestone checks
            card.querySelectorAll('.milestone-item').forEach(item => {
                item.addEventListener('click', () => {
                    const key = item.getAttribute('data-key');
                    this.toggleProjectTaskCompletion(currentRoadmapId, key, item);
                });
            });

            this.dom.projectsContainer.appendChild(card);
        });
    },

    openTopicDetails(topic) {
        this.state.selectedTopic = topic;
        
        // Populate DOM elements
        this.dom.drawerTitle.innerText = topic.title;
        this.dom.drawerDifficulty.innerText = topic.difficulty;
        this.dom.drawerHours.innerText = topic.hours;
        this.dom.drawerDesc.innerText = topic.description;
        
        // Skills list
        this.dom.drawerSkillsList.innerHTML = topic.skills.map(s => `<li>${s}</li>`).join('');
        
        // Tasks list
        this.dom.drawerTasksChecklist.innerHTML = topic.tasks.map((t, idx) => {
            // Checkboxes are static visual markers for sub-tasks here, or can be interactive.
            // Let's keep them as a static checklist of challenges.
            return `
                <div class="checklist-item">
                    <div class="checklist-check"><i class="fa-solid fa-check"></i></div>
                    <span>${t}</span>
                </div>
            `;
        }).join('');
        
        // Resources List
        this.dom.drawerResourcesList.innerHTML = topic.resources.map(res => {
            let resourceIcon = 'fa-link';
            if (res.type === 'Video') resourceIcon = 'fa-circle-play';
            if (res.type === 'Course') resourceIcon = 'fa-graduation-cap';
            if (res.type === 'Book') resourceIcon = 'fa-book-open';

            const costBadgeClass = res.cost === 'Free' ? 'status-online' : 'status-offline';

            return `
                <a href="${res.link}" target="_blank" class="resource-item" rel="noopener noreferrer">
                    <div class="resource-info-left">
                        <div class="resource-icon-box">
                            <i class="fa-solid ${resourceIcon}"></i>
                        </div>
                        <div class="resource-details">
                            <span class="resource-name" title="${res.name}">${res.name}</span>
                            <span class="resource-meta">${res.type}</span>
                        </div>
                    </div>
                    <span class="status-badge ${costBadgeClass}" style="font-size:0.7rem; padding: 2px 8px;">${res.cost}</span>
                </a>
            `;
        }).join('');

        // Completion status sync in drawer button
        const roadmapId = this.getRoadmapId(this.state.activeRoadmap.title);
        const isDone = this.isTopicCompleted(roadmapId, topic.id);
        
        const btnText = this.dom.markTopicCompleteBtn.querySelector('span');
        const btnIcon = this.dom.markTopicCompleteBtn.querySelector('i');
        
        if (isDone) {
            btnText.innerText = 'Completed (Tap to undo)';
            btnIcon.className = 'fa-solid fa-rotate-left';
            this.dom.markTopicCompleteBtn.className = 'btn btn-secondary btn-full';
        } else {
            btnText.innerText = 'Mark Topic as Complete';
            btnIcon.className = 'fa-solid fa-circle-check';
            this.dom.markTopicCompleteBtn.className = 'btn btn-primary btn-full';
        }

        // Open
        this.dom.topicDrawer.classList.add('active');
        this.dom.drawerBackdrop.classList.add('active');
    },

    getRoadmapId(title) {
        return title.replace(/\s+/g, '_').toLowerCase();
    },

    isTopicCompleted(roadmapId, topicId) {
        if (!this.state.completedTopics[roadmapId]) return false;
        return !!this.state.completedTopics[roadmapId][topicId];
    },

    isProjectTaskCompleted(roadmapId, key) {
        if (!this.state.completedProjectTasks[roadmapId]) return false;
        return !!this.state.completedProjectTasks[roadmapId][key];
    },

    toggleTopicCompletion(topicId) {
        if (!this.state.activeRoadmap) return;
        const roadmapId = this.getRoadmapId(this.state.activeRoadmap.title);
        
        if (!this.state.completedTopics[roadmapId]) {
            this.state.completedTopics[roadmapId] = {};
        }

        const currentState = !!this.state.completedTopics[roadmapId][topicId];
        this.state.completedTopics[roadmapId][topicId] = !currentState;
        
        // Save to cache
        localStorage.setItem('auramap_completed_topics', JSON.stringify(this.state.completedTopics));

        // Re-render target nodes to show checkmarks
        const targetCard = this.dom.roadmapTimeline.querySelector(`.topic-card[data-id="${topicId}"]`);
        if (targetCard) {
            const checkWrapper = targetCard.querySelector('.topic-checkbox-wrapper');
            if (!currentState) {
                targetCard.classList.add('completed');
                checkWrapper.innerHTML = '<i class="fa-solid fa-check"></i>';
            } else {
                targetCard.classList.remove('completed');
                checkWrapper.innerHTML = '';
            }
        }

        // Synchronize side drawer state if open
        if (this.state.selectedTopic && this.state.selectedTopic.id === topicId) {
            const btnText = this.dom.markTopicCompleteBtn.querySelector('span');
            const btnIcon = this.dom.markTopicCompleteBtn.querySelector('i');
            
            if (!currentState) {
                btnText.innerText = 'Completed (Tap to undo)';
                btnIcon.className = 'fa-solid fa-rotate-left';
                this.dom.markTopicCompleteBtn.className = 'btn btn-secondary btn-full';
            } else {
                btnText.innerText = 'Mark Topic as Complete';
                btnIcon.className = 'fa-solid fa-circle-check';
                this.dom.markTopicCompleteBtn.className = 'btn btn-primary btn-full';
            }
        }

        this.updateProgressState();
        this.showToast(!currentState ? 'Topic completed!' : 'Topic marked incomplete.', 'success');
    },

    toggleProjectTaskCompletion(roadmapId, key, itemDOM) {
        if (!this.state.completedProjectTasks[roadmapId]) {
            this.state.completedProjectTasks[roadmapId] = {};
        }

        const currentState = !!this.state.completedProjectTasks[roadmapId][key];
        const newState = !currentState;
        this.state.completedProjectTasks[roadmapId][key] = newState;

        localStorage.setItem('auramap_completed_projects', JSON.stringify(this.state.completedProjectTasks));

        // Adjust UI class and check icon
        const checkIcon = itemDOM.querySelector('.milestone-check');
        if (newState) {
            itemDOM.classList.add('completed');
            checkIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
        } else {
            itemDOM.classList.remove('completed');
            checkIcon.innerHTML = '';
        }
    },

    updateProgressState() {
        if (!this.state.activeRoadmap) return;
        const roadmapId = this.getRoadmapId(this.state.activeRoadmap.title);
        
        // Count total checkpoints
        let totalCount = 0;
        let completeCount = 0;

        this.state.activeRoadmap.phases.forEach(phase => {
            phase.topics.forEach(topic => {
                totalCount++;
                if (this.isTopicCompleted(roadmapId, topic.id)) {
                    completeCount++;
                }
            });
        });

        // Math percentage
        const percent = totalCount > 0 ? Math.round((completeCount / totalCount) * 100) : 0;
        
        // Update texts
        this.dom.statProgressText.innerText = `${completeCount} / ${totalCount} Complete`;
        this.dom.overallProgressPercent.innerText = `${percent}%`;

        // Update Circular SVG offset
        // Radius of ring = 24. Perimeter = 2 * PI * R = 150.796.
        const perimeter = 150.796;
        const offset = perimeter - (percent / 100) * perimeter;
        this.dom.overallProgressRing.style.strokeDashoffset = offset;
    },

    /**
     * Share implementation - string compression using unicode safe Base64 encoding.
     */
    shareActiveRoadmap() {
        if (!this.state.activeRoadmap) return;

        try {
            // Build simple object representation of state
            const currentRoadmapId = this.getRoadmapId(this.state.activeRoadmap.title);
            const exportPackage = {
                data: this.state.activeRoadmap,
                progress: {
                    topics: this.state.completedTopics[currentRoadmapId] || {},
                    projects: this.state.completedProjectTasks[currentRoadmapId] || {}
                }
            };

            // Compress payload
            const rawJSON = JSON.stringify(exportPackage);
            const encodedData = btoa(unescape(encodeURIComponent(rawJSON)));
            
            // Build sharing Link
            const shareURL = `${window.location.origin}${window.location.pathname}#roadmap=${encodedData}`;

            // Write to Clipboard
            navigator.clipboard.writeText(shareURL).then(() => {
                this.showToast('Copied Roadmap sharing link to clipboard!', 'success');
            }).catch(err => {
                console.error('Clipboard copy failed:', err);
                this.showToast('Failed to copy automatically. Copy data from developer prompt.', 'error');
            });

        } catch (e) {
            console.error('Sharing generation error:', e);
            this.showToast('Could not compile share files.', 'error');
        }
    },

    /**
     * Parse hash configuration checks
     */
    checkURLHash() {
        const hash = window.location.hash;
        if (hash && hash.startsWith('#roadmap=')) {
            try {
                const encodedData = hash.substring(9);
                const rawJSON = decodeURIComponent(escape(atob(encodedData)));
                const imported = JSON.parse(rawJSON);

                if (imported && imported.data) {
                    // Inject progress lists if they exist
                    const importedRoadmap = imported.data;
                    const roadmapId = this.getRoadmapId(importedRoadmap.title);
                    
                    if (imported.progress) {
                        this.state.completedTopics[roadmapId] = imported.progress.topics || {};
                        this.state.completedProjectTasks[roadmapId] = imported.progress.projects || {};
                        
                        localStorage.setItem('auramap_completed_topics', JSON.stringify(this.state.completedTopics));
                        localStorage.setItem('auramap_completed_projects', JSON.stringify(this.state.completedProjectTasks));
                    }

                    // Render roadmap UI
                    this.dom.heroSection.style.display = 'none';
                    this.renderRoadmap(importedRoadmap);
                    this.showToast('Imported shared AI roadmap path.', 'success');
                }
            } catch (err) {
                console.error('Error loading shared roadmap from hash:', err);
                this.showToast('Failed to load shared roadmap. Invalid parameter data.', 'error');
                // Remove broken hash
                window.location.hash = '';
            }
        } else {
            // Restore local checklist caches from localStorage
            try {
                const cachedTopics = localStorage.getItem('auramap_completed_topics');
                const cachedProjects = localStorage.getItem('auramap_completed_projects');
                
                if (cachedTopics) this.state.completedTopics = JSON.parse(cachedTopics);
                if (cachedProjects) this.state.completedProjectTasks = JSON.parse(cachedProjects);
            } catch (e) {
                console.error('Failed to load storage variables caches.', e);
            }
        }
    }
};

// Start application
document.addEventListener('DOMContentLoaded', () => {
    AuraMapApp.init();
});
