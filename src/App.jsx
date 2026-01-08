import { useState, useCallback } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Typography,
  Box,
  CircularProgress,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Paper,
  createTheme,
  ThemeProvider,
  CssBaseline,
  Card,
  CardContent,
  Stack,
  AppBar,
  Toolbar
} from '@mui/material';
import './App.css';

const API_BASEAPI_URL_URL = "https://smart-ai-email-assistant-1.onrender.com";

// Create a professional theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#03a9f4', // Light Blue
    },
    secondary: {
      main: '#f50057', // Pink
    },
    background: {
      default: '#f5f7fa', // Very light grey/blue for background
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h2: {
      fontWeight: 700,
      color: '#2c3e50',
    },
    h6: {
      fontWeight: 600,
      color: '#34495e',
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 20px',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          backgroundColor: '#fff',
        },
      },
    },
  },
});

function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [replyHints, setReplyHints] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleSubmit = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(`${API_URL}/api/email/generate`, {
        emailContent,
        tone,
        replyHints
      });
      setGeneratedReply(typeof response.data === 'string' ? response.data : JSON.stringify(response.data));
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to generate email reply. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [emailContent, tone, replyHints]);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReply);
    setOpenSnackbar(true);
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static" color="primary" elevation={0} sx={{ mb: 4 }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ReplyFlow AI
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md">
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h2" gutterBottom>
            Email Reply Generator
          </Typography>
          <Typography variant="body1" color="textSecondary" paragraph>
            Generate professional, context-aware email replies in seconds using AI.
          </Typography>
        </Box>

        <Card elevation={3} sx={{ mb: 4, overflow: 'visible' }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                multiline
                rows={6}
                variant="outlined"
                label="Original Email Content"
                placeholder="Paste the email you received here..."
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
              />

              <TextField
                fullWidth
                variant="outlined"
                label="Your Reply Hints (Optional)"
                placeholder="Ex: Tell them I am interested but busy until next week..."
                value={replyHints}
                onChange={(e) => setReplyHints(e.target.value)}
                helperText="Give the AI a nudge in the right direction."
              />

              <FormControl fullWidth>
                <InputLabel>Tone (Optional)</InputLabel>
                <Select
                  value={tone}
                  label="Tone (Optional)"
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value=""><em>None (Neutral)</em></MenuItem>
                  <MenuItem value="professional">Professional</MenuItem>
                  <MenuItem value="casual">Casual</MenuItem>
                  <MenuItem value="friendly">Friendly</MenuItem>
                  <MenuItem value="assertive">Assertive</MenuItem>
                  <MenuItem value="sympathetic">Sympathetic</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={!emailContent || loading}
                sx={{ alignSelf: 'flex-start', px: 4 }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Generate Reply"}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {generatedReply && (
          <Box sx={{ mb: 8 }}>
            <Paper elevation={2} sx={{ p: 3, bgcolor: '#f8f9fa', borderLeft: '4px solid #3f51b5' }}>
              <Typography variant="h6" gutterBottom color="primary">
                Generated Reply
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={8}
                variant="standard"
                value={generatedReply}
                inputProps={{ readOnly: true }}
                InputProps={{ disableUnderline: true }}
                sx={{ mb: 2 }}
              />
              <Button variant="outlined" onClick={handleCopy}>
                Copy to Clipboard
              </Button>
            </Paper>
          </Box>
        )}
      </Container>

      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          Reply copied to clipboard!
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default App;
