import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { startExtraction, updateProgress, setExtractedData, resetForm } from './store/complaintSlice';
import axios from 'axios';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { data, status, progress } = useSelector((state) => state.complaint);
  const [textInput, setTextInput] = useState('');
  const [sessionTranscript, setSessionTranscript] = useState('');

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    dispatch(startExtraction());
    setTimeout(() => dispatch(updateProgress(40)), 1000);
    setTimeout(() => dispatch(updateProgress(70)), 2500);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:8000/api/extract', formData);
      dispatch(setExtractedData(response.data.data));
    } catch (error) {
      console.error("Extraction error:", error);
      alert("Error processing document. Ensure backend is running.");
      dispatch(resetForm());
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    
    // 1. Stitch the new message onto the running transcript
    const updatedTranscript = sessionTranscript 
      ? sessionTranscript + "\n\nUser Correction: " + textInput 
      : textInput;
      
    // 2. Update the hidden transcript state and clear the visual input box
    setSessionTranscript(updatedTranscript);
    setTextInput('');
    
    dispatch(startExtraction());
    setTimeout(() => dispatch(updateProgress(50)), 1500);

    const formData = new FormData();
    // 3. Send the ENTIRE story back to the AI so it remembers everything
    formData.append('text_content', updatedTranscript);

    try {
      const response = await axios.post('http://localhost:8000/api/extract', formData);
      dispatch(setExtractedData(response.data.data));
    } catch (error) {
      console.error("Extraction error:", error);
      dispatch(resetForm());
    }
  };

  const handleSaveToDatabase = async () => {
    if (!data || Object.keys(data).length === 0 || !data.complaint_type) {
      alert("No data to save! Please extract a complaint first.");
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/save', data);
      if (response.data.success) {
        alert(`Success! Complaint Record #${response.data.id} has been permanently saved to the QMS database.`);
        dispatch(resetForm()); 
        setTextInput('');
        setSessionTranscript(''); 
      }
    } catch (error) {
      console.error("Database Save Error:", error);
      alert("Failed to save to database. Ensure the backend is running.");
    }
  };

  // --- NEW REFRESH FUNCTION ---
  const handleRefresh = () => {
    if (window.confirm("Clear the current complaint and start a new session?")) {
      dispatch(resetForm()); 
      setTextInput('');
      setSessionTranscript(''); 
    }
  };

  return (
    <div className="app-container">
      {/* LEFT PANEL: The QMS Form */}
      <div className="panel form-panel">
        
        <div className="header-row">
          <h2 style={{ margin: 0 }}>Log Customer Complaint</h2>
          <span className="badge badge-warning">Pending Triage</span>
        </div>
        
        <div className="section-title">👤 1. Origin & Customer Details</div>
        <div className="grid-2-col">
          <div className="input-group">
            <label>Complaint Source</label>
            <input readOnly value={data.complaint_source || ''} placeholder="Awaiting AI extraction..." />
          </div>
          <div className="input-group">
            <label>Customer Name</label>
            <input readOnly value={data.customer_name || ''} placeholder="Awaiting AI extraction..." />
          </div>
        </div>

        <div className="section-title">📦 2. Product & Batch Identification</div>
        <div className="grid-2-col">
          <div className="input-group">
            <label>Product Name</label>
            <input readOnly value={data.product_name || ''} placeholder="Awaiting AI extraction..." />
          </div>
          <div className="input-group">
            <label>Product Strength/Grade</label>
            <input readOnly value={data.product_strength_grade || ''} placeholder="Awaiting AI extraction..." />
          </div>
          <div className="input-group">
            <label>Batch/Lot Number</label>
            <input readOnly value={data.batch_lot_number || ''} placeholder="Awaiting AI extraction..." />
          </div>
          <div className="input-group">
            <label>Manufacturing Date</label>
            <input readOnly value={data.manufacturing_date || ''} placeholder="Awaiting AI extraction..." />
          </div>
          <div className="input-group">
            <label>Expiry Date</label>
            <input readOnly value={data.expiry_date || ''} placeholder="Awaiting AI extraction..." />
          </div>
          <div className="input-group">
            <label>Quantity Affected</label>
            <input readOnly value={data.quantity_affected || ''} placeholder="Awaiting AI extraction..." />
          </div>
        </div>

        <div className="section-title">📝 3. Complaint Details</div>
        <div className="grid-2-col">
          <div className="input-group">
            <label>Complaint Type</label>
            <input readOnly value={data.complaint_type || ''} placeholder="Awaiting AI extraction..." />
          </div>
          <div className="input-group">
            <label>Complaint Date</label>
            <input readOnly value={data.complaint_date || ''} placeholder="Awaiting AI extraction..." />
          </div>
        </div>
        
        <div className="input-group" style={{ marginTop: '1.25rem' }}>
          <label>Detailed Complaint Description</label>
          <textarea readOnly rows="3" value={data.detailed_complaint_description || ''} placeholder="Awaiting AI extraction..." />
        </div>

        {/* BONUS FEATURE: AI Risk Assessment Panel (With Graceful Fallbacks) */}
        <div className="risk-assessment-panel">
          <div className="risk-header">
            <svg fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{width: '20px', height: '20px'}}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
            AI copilot risk assessment
          </div>
          
          <div className="grid-2-col">
            <div className="input-group">
              <label>Severity (Suggested)</label>
              <input readOnly value={data.suggested_severity || data.initial_severity || ''} placeholder="Waiting for AI..." />
            </div>
            <div className="input-group">
              <label>Suggested Next Action</label>
              <input readOnly value={data.suggested_next_action || data.capa_recommendation || data.root_cause_recommendation || ''} placeholder="Waiting for AI..." />
            </div>
          </div>
          
          <div className="input-group" style={{ marginTop: '1.25rem' }}>
            <label>Initial Risk Assessment</label>
            <input 
              readOnly 
              value={data.initial_risk_assessment || (data.complaint_type ? `Potential risk associated with ${data.complaint_type.toLowerCase()}; requires QA evaluation.` : '')} 
              placeholder="Waiting for AI..." 
            />
          </div>
        </div>

        <div style={{ marginTop: '2.5rem' }}>
          <button className="btn btn-success" onClick={handleSaveToDatabase}>
            💾 Save Complaint to QMS Database
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Chatbot Interface */}
      <div className="ai-sidebar">
        
        {/* Chat Header WITH REFRESH BUTTON */}
        <div className="chat-header">
          <div>
            <div className="chat-header-title">
              <span style={{color: '#4F46E5', fontSize: '1.2rem'}}>🔬</span> AIVOA Copilot
            </div>
            <div className="chat-header-subtitle">Drop complaint files or paste text below.</div>
          </div>
          <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
            <button 
              onClick={handleRefresh}
              title="Start New Complaint"
              style={{
                background: 'transparent',
                border: '1px solid #E2E8F0',
                borderRadius: '6px',
                padding: '6px 8px',
                cursor: 'pointer',
                color: '#64748B',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#0F172A'; e.currentTarget.style.backgroundColor = '#F1F5F9'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#64748B'; e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <svg fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{width: '16px', height: '16px'}}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
              </svg>
            </button>
            <div className="status-dot"></div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="chat-messages">
          
          {/* Welcome Bubble */}
          <div className="chat-message">
            <div className="bot-avatar">⚡</div>
            <div className="message-bubble">
              Ready to process new complaints. You can paste the raw email from the customer, or upload a PDF of the complaint report. I will extract the data and run the initial risk assessment.
            </div>
          </div>

          {/* Loading Bubble */}
          {status === 'loading' && (
            <div className="chat-message">
              <div className="bot-avatar">⚡</div>
              <div className="message-bubble" style={{width: '100%'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: '700', color: '#475569', marginBottom: '0.5rem'}}>
                  <span>EXTRACTION PROGRESS</span>
                  <span>{progress}%</span>
                </div>
                <div style={{width: '100%', backgroundColor: '#E2E8F0', borderRadius: '999px', height: '6px', overflow: 'hidden'}}>
                  <div style={{width: `${progress}%`, backgroundColor: '#4F46E5', height: '100%', transition: 'width 0.4s ease'}}></div>
                </div>
                <p style={{fontSize: '0.75rem', color: '#64748B', marginTop: '0.75rem', marginBottom: '0'}}>Analyzing document content...</p>
              </div>
            </div>
          )}

          {/* Success Bubble */}
          {status === 'success' && (
            <div className="chat-message">
              <div className="bot-avatar">⚡</div>
              <div className="message-bubble">
                <strong>Extraction complete!</strong> I have successfully populated the QMS form.<br/><br/>
                {data.root_cause_recommendation && (
                  <span style={{color: '#4F46E5'}}><strong>Note:</strong> {data.root_cause_recommendation}</span>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Chat Input Bar */}
        <div className="chat-input-area">
          <div className="input-wrapper">
            <label className="attach-btn" title="Upload Document">
              📎
              <input type="file" style={{display: 'none'}} accept=".pdf,.txt,.docx,.eml" onChange={handleFileUpload} />
            </label>
            <input 
              type="text" 
              className="chat-input"
              placeholder="Type a message or paste a complaint..." 
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTextSubmit();
              }}
            />
            <button 
              className="send-btn" 
              onClick={handleTextSubmit} 
              disabled={status === 'loading' || !textInput.trim()}
            >
              ✓
            </button>
          </div>
          <div className="footer-text">POWERED BY LANGGRAPH</div>
        </div>

      </div>
    </div>
  );
}

export default App;