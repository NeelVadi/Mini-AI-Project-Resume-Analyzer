import os
import re
import io
import json
import requests
from flask import Flask, render_template, request, redirect, url_for, session
from pypdf import PdfReader

app = Flask(__name__)
app.secret_key = "smart_resume_analyzer_secret_key_67890"

# Design Lists
COMMON_KEYWORDS = [
    'javascript', 'python', 'react', 'node', 'express', 'vue', 'angular', 'typescript', 'html', 'css', 
    'sql', 'nosql', 'mongodb', 'postgresql', 'mysql', 'docker', 'kubernetes', 'aws', 'azure', 'gcp', 
    'git', 'github', 'ci/cd', 'agile', 'scrum', 'project management', 'machine learning', 'deep learning', 
    'java', 'c++', 'c#', 'ruby', 'php', 'swift', 'kotlin', 'flutter', 'react native', 'api', 'graphql', 
    'rest api', 'devops', 'linux', 'unix', 'figma', 'ui/ux', 'cybersecurity', 'networks', 'testing', 
    'unit testing', 'qa', 'data analysis', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 
    'tableau', 'power bi', 'excel', 'communication', 'leadership', 'teamwork', 'problem solving'
]

CLICHES = [
    'synergy', 'team player', 'results-driven', 'results driven', 'go-getter', 'hard worker', 
    'detail-oriented', 'detail oriented', 'passionate', 'dynamic', 'self-motivated', 'motivated', 
    'think outside the box', 'strategic thinker', 'proven track record', 'hardworking', 'go-to'
]

ACTION_VERBS = [
    'designed', 'developed', 'implemented', 'engineered', 'managed', 'led', 'built', 'optimized', 
    'spearheaded', 'created', 'analyzed', 'delivered', 'increased', 'improved', 'resolved', 'launched', 
    'facilitated', 'accelerated', 'collaborated', 'coordinated', 'formulated', 'programmed', 'modernized', 
    'automated', 'directed', 'executed', 'established', 'decreased', 'expedited', 'mentored', 'trained'
]

def markdown_to_html(md_text):
    """Simple converter to render markdown response from Gemini API into clean HTML."""
    if not md_text:
        return ""
    lines = md_text.split('\n')
    html_lines = []
    in_list = False
    in_code = False
    
    for line in lines:
        stripped = line.strip()
        
        # Code block
        if stripped.startswith('```'):
            if in_code:
                html_lines.append('</pre>')
                in_code = False
            else:
                html_lines.append('<pre class="code-block">')
                in_code = True
            continue
            
        if in_code:
            html_lines.append(line)
            continue
            
        # Headers
        if stripped.startswith('###'):
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append(f'<h3>{stripped[3:].strip()}</h3>')
            continue
        elif stripped.startswith('##'):
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append(f'<h2>{stripped[2:].strip()}</h2>')
            continue
        elif stripped.startswith('#'):
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append(f'<h1>{stripped[1:].strip()}</h1>')
            continue
            
        # Lists
        if stripped.startswith('- ') or stripped.startswith('* ') or (stripped[:1].isdigit() and stripped[1:3] == '. '):
            if not in_list:
                html_lines.append('<ul>')
                in_list = True
            
            # Extract content from line
            content = stripped[2:].strip() if not stripped[:1].isdigit() else stripped[2:].strip()
            # Inline formatting
            content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
            content = re.sub(r'`(.*?)`', r'<code>\1</code>', content)
            html_lines.append(f'<li>{content}</li>')
            continue
        else:
            if in_list and stripped == "":
                html_lines.append('</ul>')
                in_list = False
                
        # Paragraphs
        if stripped:
            content = stripped
            content = re.sub(r'\*\*(.*?)\*\*', r'<strong>\1</strong>', content)
            content = re.sub(r'`(.*?)`', r'<code>\1</code>', content)
            html_lines.append(f'<p>{content}</p>')
        else:
            if in_list:
                html_lines.append('</ul>')
                in_list = False
            html_lines.append('')
            
    if in_list:
        html_lines.append('</ul>')
    if in_code:
        html_lines.append('</pre>')
        
    return '\n'.join(html_lines)


def run_local_heuristics(text):
    """Core heuristics scoring model ported to Python."""
    text_lower = text.lower()
    
    # 1. Check Standard Sections
    sections = {
        'education': bool(re.search(r'education|academic|degree|schooling|university|college', text_lower)),
        'experience': bool(re.search(r'experience|employment|work history|professional history|job history', text_lower)),
        'skills': bool(re.search(r'skills|technologies|technical skills|core competencies|expertise', text_lower)),
        'projects': bool(re.search(r'projects|academic projects|personal projects|key projects', text_lower)),
        'summary': bool(re.search(r'summary|objective|profile|about me|professional summary', text_lower))
    }
    
    sections_found = [k for k, v in sections.items() if v]
    sections_score = int((len(sections_found) / len(sections)) * 100)

    # 2. Check Contact Details & Length
    contact = {
        'email': bool(re.search(r'[\w.-]+@[\w.-]+\.\w+', text_lower)),
        'phone': bool(re.search(r'(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text_lower)),
        'links': bool(re.search(r'linkedin\.com|github\.com|portfolio|[\w-]+\.github\.io', text_lower))
    }
    
    words = text.split()
    word_count = len(words)
    length_rating = 'good'
    length_score = 100
    
    if word_count < 200:
        length_rating = 'too-short'
        length_score = 40
    elif word_count > 1000:
        length_rating = 'too-long'
        length_score = 60
        
    contact_found = [k for k, v in contact.items() if v]
    contact_score = int((len(contact_found) / len(contact)) * 100)
    
    formatting_score = int((contact_score * 0.6) + (length_score * 0.4))

    # 3. Check Action Verbs, Clichés, and Quantification
    action_verbs_count = 0
    action_verbs_found = []
    for verb in ACTION_VERBS:
        matches = len(re.findall(r'\b' + verb + r'\b', text_lower))
        if matches > 0:
            action_verbs_count += matches
            action_verbs_found.append(verb)
            
    clichés_count = 0
    clichés_found = []
    for cliché in CLICHES:
        matches = len(re.findall(r'\b' + cliché + r'\b', text_lower))
        if matches > 0:
            clichés_count += matches
            clichés_found.append(cliché)
            
    numbers_count = len(re.findall(r'\b\d+(?:\.\d+)?%?\b', text_lower))
    money_count = len(re.findall(r'[\$£€]\d+', text_lower))
    metric_count = numbers_count + money_count
    
    quantification_score = min(100, metric_count * 10)
    verb_score = min(100, action_verbs_count * 10)
    cliché_penalty = max(0, 100 - (clichés_count * 15))
    
    impact_score = int((quantification_score * 0.4) + (verb_score * 0.4) + (cliché_penalty * 0.2))

    # 4. Check Readability & Sentence Flow
    sentences = [s for s in re.split(r'[.!?]+', text) if len(s.strip()) > 5]
    avg_sentence_length = word_count / len(sentences) if len(sentences) > 0 else 0
    
    readability_score = 100
    if avg_sentence_length > 25:
        readability_score = max(40, int(100 - (avg_sentence_length - 25) * 4))
    elif avg_sentence_length < 8:
        readability_score = 70
        
    overall_score = int((sections_score + formatting_score + impact_score + readability_score) / 4)

    return {
        'overallScore': overall_score,
        'metrics': {
            'sectionsScore': sections_score,
            'formattingScore': formatting_score,
            'impactScore': impact_score,
            'readabilityScore': readability_score
        },
        'sections': sections,
        'contact': contact,
        'wordCount': word_count,
        'lengthRating': length_rating,
        'actionVerbsCount': action_verbs_count,
        'actionVerbsFound': action_verbs_found,
        'clichésCount': clichés_count,
        'clichésFound': clichés_found,
        'avgSentenceLength': round(avg_sentence_length, 1),
        'quantificationCount': metric_count
    }


def run_local_job_matcher(resume_text, jd_text):
    """Local technical keyword extractor and matcher."""
    clean_resume = resume_text.lower()
    clean_jd = jd_text.lower()
    
    matched = []
    missing = []
    
    for keyword in COMMON_KEYWORDS:
        escaped_kw = re.escape(keyword)
        if re.search(r'\b' + escaped_kw + r'\b', clean_jd):
            if re.search(r'\b' + escaped_kw + r'\b', clean_resume):
                matched.append(keyword)
            else:
                missing.append(keyword)
                
    total_keywords = len(matched) + len(missing)
    match_percent = int((len(matched) / total_keywords) * 100) if total_keywords > 0 else 0
    
    return {
        'score': match_percent,
        'matched': matched,
        'missing': missing,
        'totalCount': total_keywords
    }


def call_gemini_api(api_key, model, system_prompt, user_prompt):
    """Performs HTTP API requests directly to the Gemini REST service endpoint."""
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": f"{system_prompt}\n\nUser Input:\n{user_prompt}"}
                ]
            }
        ],
        "generationConfig": {
            "temperature": 0.3,
            "topP": 0.95
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=25)
        response.raise_for_status()
        data = response.json()
        return data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        print(f"Gemini API error: {e}")
        return f"*(Gemini API Call Failed: {str(e)})*"


@app.route('/', methods=['GET'])
def index():
    # Load defaults
    if 'theme' not in session:
        session['theme'] = 'dark'
    if 'api_key' not in session:
        session['api_key'] = ''
    if 'model' not in session:
        session['model'] = 'gemini-2.5-flash'
    if 'chat_history' not in session:
        session['chat_history'] = []
        
    return render_template('index.html')


@app.route('/analyze', methods=['POST'])
def analyze():
    # 1. Get uploaded file
    file = request.files.get('resume_file')
    if not file or file.filename == '':
        return redirect(url_for('index'))
        
    filename = file.filename
    # Read file content
    file_bytes = file.read()
    file_size_bytes = len(file_bytes)
    
    # Format File Size
    size_kb = file_size_bytes / 1024
    if size_kb > 1024:
        filesize_str = f"{round(size_kb/1024, 2)} MB"
    else:
        filesize_str = f"{round(size_kb, 2)} KB"
        
    # Extract text content
    resume_text = ""
    ext = os.path.splitext(filename)[1].lower()
    
    try:
        if ext == '.pdf':
            pdf_file = io.BytesIO(file_bytes)
            reader = PdfReader(pdf_file)
            for page in reader.pages:
                resume_text += page.extract_text() or ""
        else:
            resume_text = file_bytes.decode('utf-8', errors='ignore')
            
        if not resume_text.strip():
            raise Exception("The parsed resume text is empty. PDF might be scanned or image-only.")
    except Exception as e:
        session['error_message'] = f"Failed to parse resume: {str(e)}"
        return redirect(url_for('index'))
        
    # Save base details in session
    session['resume_text'] = resume_text
    session['resume_filename'] = filename
    session['resume_filesize'] = filesize_str
    
    # Save Job Description
    job_desc = request.form.get('job_description', '').strip()
    session['job_description'] = job_desc
    
    # 2. Run Local Heuristics
    heuristics = run_local_heuristics(resume_text)
    session['analysis'] = heuristics
    
    # 3. Run Job Matcher (Local)
    if job_desc:
        session['local_match'] = run_local_job_matcher(resume_text, job_desc)
    else:
        session['local_match'] = None
        
    # 4. Run Gemini API (if key is set)
    api_key = session.get('api_key')
    model = session.get('model', 'gemini-2.5-flash')
    
    if api_key:
        # suggestions call
        sys_sugg_prompt = (
            "You are an elite Resume Reviewer and Technical Recruiter.\n"
            "Evaluate the candidate's resume and generate highly detailed suggestions.\n"
            "Write the output using clean markdown format. Do not use markdown H1. Start with H3 for main sections.\n"
            "Provide structural feedback, formatting suggestions, and most importantly: rewrite 3-4 weak bullet points "
            "into high-impact, metrics-driven bullet points using the STAR method."
        )
        ai_sugg = call_gemini_api(api_key, model, sys_sugg_prompt, f"Resume Text:\n{resume_text}")
        session['ai_suggestions'] = markdown_to_html(ai_sugg)
        
        # job description match call
        if job_desc:
            sys_match_prompt = (
                "You are an ATS (Applicant Tracking System) optimizer.\n"
                "Compare the resume text with the job description.\n"
                "Return a structured markdown assessment containing:\n"
                "- An AI ATS Compatibility Rating (from High Fit, Medium Fit, to Low Fit). Explain why.\n"
                "- Skills Gap Analysis: Bullet lists of Core Technical Skills missing, and Soft Skills or domain expertise missing.\n"
                "- Bullet points rewrite suggestions specifically targeting the job requirements.\n"
                "Write the output in clean markdown, starting with H3 headings. Do not use H1."
            )
            user_prompt = f"Resume:\n{resume_text}\n\nJob Description:\n{job_desc}"
            ai_match = call_gemini_api(api_key, model, sys_match_prompt, user_prompt)
            session['ai_match'] = markdown_to_html(ai_match)
        else:
            session['ai_match'] = None
    else:
        session['ai_suggestions'] = None
        session['ai_match'] = None
        
    # Initialize Coach chat
    session['chat_history'] = [
        {
            'role': 'model',
            'text': "Hi! I've loaded and analyzed your resume details. I'm your AI Resume Coach. Ask me questions, ask me to adapt specific bullet points, or practice simulated interview questions here!"
        }
    ]
    
    # Remove any old error
    session.pop('error_message', None)
    
    return redirect(url_for('index'))


@app.route('/chat', methods=['POST'])
def chat():
    query = request.form.get('chat_query', '').strip()
    api_key = session.get('api_key')
    
    if not query or not api_key:
        return redirect(url_for('index'))
        
    # Load history
    history = session.get('chat_history', [])
    # Append user question
    history.append({'role': 'user', 'text': query})
    
    # Call Gemini API
    model = session.get('model', 'gemini-2.5-flash')
    resume_text = session.get('resume_text', '')
    job_desc = session.get('job_description', '')
    
    system_prompt = (
        "You are a helpful, professional, and friendly AI Resume Coach assisting a user.\n"
        "You have context on their uploaded resume and target job description (if provided).\n"
        "Provide specific, actionable, and concrete advice.\n"
        f"Resume Details:\n{resume_text}\n"
    )
    if job_desc:
        system_prompt += f"\nTarget Job Description:\n{job_desc}\n"
    system_prompt += "\nRespond in markdown format. Keep answers concise, direct, and conversational."
    
    # Format history context for API call
    api_contents = []
    # Add system prompt as a user message context block first, or build it into the prompt
    for h in history:
        api_contents.append({
            "role": h['role'],
            "parts": [{"text": h['text']}]
        })
        
    url = f"https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={api_key}"
    headers = {"Content-Type": "application/json"}
    
    # Construct complete chat payload
    payload = {
        "contents": [
            {"role": "user", "parts": [{"text": system_prompt}]},
            *api_contents
        ],
        "generationConfig": {
            "temperature": 0.5,
            "topP": 0.95
        }
    }
    
    try:
        response = requests.post(url, headers=headers, json=payload, timeout=25)
        response.raise_for_status()
        data = response.json()
        model_reply = data['candidates'][0]['content']['parts'][0]['text']
    except Exception as e:
        model_reply = f"*(Coach Chat Connection Failed: {str(e)})*"
        
    # Append model reply
    # Render markdown to HTML for display
    reply_html = markdown_to_html(model_reply)
    history.append({'role': 'model', 'text': model_reply, 'html': reply_html})
    
    session['chat_history'] = history
    return redirect(url_for('index'))


@app.route('/settings', methods=['POST'])
def settings():
    key = request.form.get('api_key', '').strip()
    model = request.form.get('model', 'gemini-2.5-flash')
    
    session['api_key'] = key
    session['model'] = model
    
    return redirect(url_for('index'))


@app.route('/clear', methods=['POST'])
def clear():
    keys_to_clear = [
        'resume_text', 'resume_filename', 'resume_filesize', 'job_description',
        'analysis', 'local_match', 'ai_suggestions', 'ai_match', 'chat_history',
        'error_message'
    ]
    for key in keys_to_clear:
        session.pop(key, None)
    return redirect(url_for('index'))


@app.route('/toggle-theme', methods=['GET'])
def toggle_theme():
    current_theme = session.get('theme', 'dark')
    session['theme'] = 'light' if current_theme == 'dark' else 'dark'
    return redirect(url_for('index'))


if __name__ == '__main__':
    app.run(debug=True, port=5000)
