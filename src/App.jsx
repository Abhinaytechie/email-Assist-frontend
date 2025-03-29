import axios from 'axios';
import { useState, useCallback } from 'react';
import './App.css';
import { Container, TextField, Typography, Box, CircularProgress, Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`https://springboot-backend-sb2z.onrender.com/api/email/generate`, { emailContent, tone });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [emailContent, tone]);

  return (
    <Container maxWidth="md" sx={{ py: 4, bgcolor: '#f0f4c3' }}>
      <Typography variant="h2" align="center" gutterBottom>Email Reply Generator</Typography>

      <Box sx={{ mx: 2 }}>
        <TextField
          fullWidth
          multiline
          rows={8}
          variant="outlined"
          label="Email Content"
          value={emailContent}
          onChange={(e) => setEmailContent(e.target.value)}
          sx={{ mb: 2 }}
        />

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Tone (Optional)</InputLabel>
          <Select value={tone} label="Tone (Optional)" onChange={(e) => setTone(e.target.value)}>
            <MenuItem value="">None</MenuItem>
            <MenuItem value="professional">Professional</MenuItem>
            <MenuItem value="friendly">Friendly</MenuItem>
            <MenuItem value="sarcastic">Sarcastic</MenuItem>
            <MenuItem value="casual">Casual</MenuItem>
            <MenuItem value="emotional">Emotional</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSubmit} disabled={!emailContent || loading} fullWidth>
          {loading ? <CircularProgress size={24} /> : "Generate Reply"}
        </Button>
      </Box>

      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      {generatedReply && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>Generated Reply:</Typography>
          <TextField fullWidth multiline rows={6} variant="outlined" value={generatedReply} inputProps={{ readOnly: true }} />
          <Button variant="outlined" sx={{ mt: 2 }} onClick={() => navigator.clipboard.writeText(generatedReply)}>
            Copy to Clipboard
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default App;
