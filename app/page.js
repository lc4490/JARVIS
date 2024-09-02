"use client"
import {Box, Stack, Typography, Button, Modal, TextField, Link, Autocomplete, Divider, FormControl, Select, MenuItem, CircularProgress} from '@mui/material'
import { useEffect, useState, useRef } from 'react'

// theme imports
import { createTheme, ThemeProvider, useTheme, CssBaseline, useMediaQuery, IconButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';

// language
import { useTranslation } from 'react-i18next';
import i18n from './i18n'; // Adjust the path as necessary

// use googlesignin
import { firestore, auth, provider, signInWithPopup, signOut } from '@/firebase'
import { collection, getDocs, query, doc, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';

// icon imports
import PersonIcon from '@mui/icons-material/Person';
import AssistantIcon from '@mui/icons-material/Assistant';
import SendIcon from '@mui/icons-material/Send';
import DeleteIcon from '@mui/icons-material/Delete'; 
import KeyboardVoiceIcon from '@mui/icons-material/KeyboardVoice';
import SettingsVoiceIcon from '@mui/icons-material/SettingsVoice';
import StopIcon from '@mui/icons-material/Stop';

// openai
const openaiApiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
import { OpenAI } from 'openai';

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#00bfff', // Bright blue for primary elements
    },
    secondary: {
      main: '#007bff', // Slightly darker blue for contrast
    },
    background: {
      default: '#f0f5fb', // Light grayish-blue background
      paper: '#ffffff', // White for paper elements
      bubbles: '#e0f7fa', // Very light cyan for chat bubbles
      userBubble: '#00bfff', // Bright blue for user bubbles
      link: '#007bff', // Slightly darker blue for links
    },
    text: {
      primary: '#212121', // Dark gray text for readability
      secondary: '#607d8b', // Medium gray text for secondary elements
    },
    action: {
      active: '#00bfff', // Bright blue for active elements
    },
  },
  typography: {
    fontFamily: 'Roboto Mono, Arial, sans-serif', // Monospaced font for a techy look
    h1: { fontFamily: 'Roboto Mono, Arial, sans-serif', fontWeight: 700, color: '#00bfff' },
    h2: { fontFamily: 'Roboto Mono, Arial, sans-serif', fontWeight: 700, color: '#00bfff' },
    h3: { fontFamily: 'Roboto Mono, Arial, sans-serif', fontWeight: 700, color: '#00bfff' },
    button: { fontFamily: 'Roboto Mono, Arial, sans-serif', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 0px 8px rgba(0, 191, 255, 0.6)', // Glowing effect
          backgroundColor: '#00bfff',
          color: '#f0f5fb',
          '&:hover': {
            backgroundColor: '#00a3cc',
            boxShadow: '0px 0px 12px rgba(0, 191, 255, 0.9)', // More intense glow on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff', // White background for paper
          boxShadow: '0px 0px 10px rgba(0, 191, 255, 0.4)', // Subtle glow effect
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderColor: '#00bfff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00bfff',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00bfff',
              boxShadow: '0px 0px 8px rgba(0, 191, 255, 0.6)', // Glowing effect
            },
          },
        },
      },
    },
  },
});

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00ffff', // Neon cyan blue for primary elements
    },
    secondary: {
      main: '#007bff', // Bright blue for contrasting elements
    },
    background: {
      default: '#0b0f19', // Very dark background, almost black
      paper: '#121212', // Dark gray for paper elements
      bubbles: '#1e1e1e', // Slightly lighter gray for chat bubbles
      userBubble: '#00ffff', // Neon cyan blue for user bubbles
      link: '#00bfff', // Light blue for links
    },
    text: {
      primary: '#ffffff', // Bright white text for contrast
      secondary: '#b0bec5', // Light gray text for secondary elements
    },
    action: {
      active: '#00ffff', // Neon cyan blue for active elements
    },
  },
  typography: {
    fontFamily: 'Roboto Mono, Arial, sans-serif', // Monospaced font for a techy look
    h1: { fontFamily: 'Roboto Mono, Arial, sans-serif', fontWeight: 700, color: '#00ffff' },
    h2: { fontFamily: 'Roboto Mono, Arial, sans-serif', fontWeight: 700, color: '#00ffff' },
    h3: { fontFamily: 'Roboto Mono, Arial, sans-serif', fontWeight: 700, color: '#00ffff' },
    button: { fontFamily: 'Roboto Mono, Arial, sans-serif', fontWeight: 700 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0px 0px 12px rgba(0, 255, 255, 0.6)', // Glowing effect
          backgroundColor: '#00ffff',
          color: '#0b0f19',
          '&:hover': {
            backgroundColor: '#00e5e5',
            boxShadow: '0px 0px 18px rgba(0, 255, 255, 0.9)', // More intense glow on hover
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: '#121212', // Dark gray background for paper
          boxShadow: '0px 0px 10px rgba(0, 255, 255, 0.4)', // Subtle glow effect
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderColor: '#00ffff',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00ffff',
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#00ffff',
              boxShadow: '0px 0px 8px rgba(0, 255, 255, 0.6)', // Glowing effect
            },
          },
        },
      },
    },
  },
});

const customComponents = {
  a: ({ href, children }) => (
    <Link href={href} color="background.link" underline="hover">
      {children}
    </Link>
  ),
  p: ({ children }) => (
    <Typography variant="body1" paragraph sx={{ marginBottom: 0, lineHeight: 1.6 }}>
      {children}
    </Typography>
  ),
  h1: ({ children }) => (
    <Typography variant="h4" gutterBottom sx={{ marginTop: 0, marginBottom: 0 }}>
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography variant="h5" gutterBottom sx={{ marginTop: 0, marginBottom: 0 }}>
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography variant="h6" gutterBottom sx={{ marginTop: 0, marginBottom: 0 }}>
      {children}
    </Typography>
  ),
  ul: ({ children }) => (
    <Box component="ul" sx={{ paddingLeft: 3, marginBottom: 0 }}>
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box component="ol" sx={{ paddingLeft: 3, marginBottom: 0 }}>
      {children}
    </Box>
  ),
  blockquote: ({ children }) => (
    <Box
      component="blockquote"
      sx={{
        marginLeft: 2,
        paddingLeft: 2,
        borderLeft: '4px solid #ccc',
        fontStyle: 'italic',
        color: '#555',
        marginBottom: 0,
      }}
    >
      {children}
    </Box>
  ),
  code: ({ children }) => (
    <Box
      component="code"
      sx={{
        backgroundColor: 'background.default',
        padding: '8px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        marginBottom: 0,
      }}
    >
      {children}
    </Box>
  ),
  pre: ({ children }) => (
    <Box
      component="pre"
      sx={{
        backgroundColor: 'background.default',
        padding: '8px',
        borderRadius: '4px',
        fontFamily: 'monospace',
        overflowX: 'auto',
        marginBottom: 0,
      }}
    >
      {children}
    </Box>
  ),
};

export default function Home() {

  const openai = new OpenAI({
    apiKey: openaiApiKey,
    dangerouslyAllowBrowser: true
  });
  // toggle dark mode
  // Detect user's preferred color scheme
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [darkMode, setDarkMode] = useState(prefersDarkMode);

  // language
  const { t, i18n } = useTranslation();
  const [prefLanguage, setPrefLanguage] = useState('en-US')

  const handleLanguageChange = (event) => {
    const newLanguage = event.target.value;
    i18n.changeLanguage(newLanguage)
    setPrefLanguage(newLanguage);
    setMessages([{ role: 'assistant', content: t('Hi! I am your AI assistant. How can I help you today?', { name: user?.displayName || 'Guest' }) }]);
    // clearChatLog();
  };
  // Update dark mode state when the user's preference changes
  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);
  const theme = darkMode ? darkTheme : lightTheme;


  // google auth
  // sign in function for google auth
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log('User signed in:', user);
    } catch (error) {
      console.error('Error signing in:', error);
      alert('Sign in failed: ' + error.message);
    }
  };
  // sign out function for google auth
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('User signed out');
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error);
      alert('Sign out failed: ' + error.message);
    }
  };

  // declareables for user and guest mode
  const [user, setUser] = useState(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);
  // change welcome message based on custom user
  useEffect(() => {
    setMessages([{ role: 'assistant', content: t('Hi! I am your AI assistant. How can I help you today?', { name: user?.displayName || 'Guest' }) }]);
  }, [user]); // This useEffect will run whenever the user state changes


  // messages
  const [messages, setMessages] = useState([
    {role : 'assistant', content: t('Hi! I am your AI assistant. How can I help you today?')}
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // send messages
  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true)
  
    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])
  
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })
  
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
  
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        assistantMessage += text;
  
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: assistantMessage },
          ];
        });
      }
  
      // Trigger TTS after the full assistant message is loaded
      speakText(assistantMessage, prefLanguage);
      if(user){
      // Save chat log after full assistant message is received
      saveChatLog(user.uid, i18n.language, [...messages, { role: 'user', content: message }, { role: 'assistant', content: assistantMessage }]);
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
    setIsLoading(false)
  }

  // save chat logs function
  const saveChatLog = async (userId, languageCode, messages) => {
    console.log('saved')
    console.log(userId)
    console.log(languageCode)
    console.log(messages)
    try {
      const docRef = doc(firestore, 'chatLogs', userId, 'languages', languageCode);
      await setDoc(docRef, {
        messages: messages,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error("Error saving chat log:", error);
    }
  };  
  // loading chat logs
  const loadChatLog = async (userId, languageCode) => {
    try {
      const docRef = doc(firestore, 'chatLogs', userId, 'languages', languageCode);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMessages(data.messages);
      } else {
        setMessages([{ role: 'assistant', content: t('Hi! I am your AI assistant. How can I help you today?', { name: user?.displayName || 'Guest' }) }]);
      }
    } catch (error) {
      console.error("Error loading chat log:", error);
    }
    
  };  
  // clear chat log
  const clearChatLog = async () => {
    if(user){
      try {
        const docRef = doc(firestore, 'chatLogs', user.uid, 'languages', i18n.language);
        await deleteDoc(docRef);
        
      } catch (error) {
        console.error("Error clearing chat log:", error);
      }
    }
    setMessages([{ role: 'assistant', content: t('Hi! I am your AI assistant. How can I help you today?', { name: user?.displayName || 'Guest' }) }]);
    
  };
  useEffect(() => {
    if (user) {
      loadChatLog(user.uid, i18n.language);
    } 
  }, [user, i18n.language]);

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }
  // scroll to bottom
  const messagesEndRef = useRef(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100); // Delay to allow DOM to update
    return () => clearTimeout(timer);
  }, [messages]);
  

  // text to speech
  const [isListening, setIsListening] = useState(false); // Track whether speech recognition is in progress
  const [isSpeaking, setIsSpeaking] = useState(false); // Track whether speech synthesis is in progress
  const [recognition, setRecognition] = useState(null);

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = true;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = prefLanguage;

      recognitionInstance.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setMessage(finalTranscript + interimTranscript); // Update the message input field with both final and interim results
      };
      

      recognitionInstance.onend = () => {
        setIsListening(false);
        setMessage('')
      };
      

      setRecognition(recognitionInstance);
    } else {
      alert(t('Your browser does not support speech recognition.'));
    }
  }, []);

  const startListening = () => {
    if (recognition) {
      const audio = new Audio('/start-sound.mp3'); // Use a small audio file for the cue
      audio.play();
      recognition.lang = prefLanguage
      recognition.start();
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
      setIsListening(false);
    }
  };

  // speech to text
  const correctPronunciation = (text) => {
    // Replace specific names with phonetic spellings
    return text.replace(/Kacey Lee/gi, 'Casey Lee');
  };
  const speakText = async (text, language = 'en-US') => {
    if (language === 'en-US') {
      // Use OpenAI TTS for English
      if (!window.AudioContext) {
        console.warn('Web Audio API is not supported in this browser.');
        return;
      }
  
      try {
        // Modify the text if necessary
        const modifiedText = correctPronunciation(text);
  
        // Call OpenAI's TTS API
        const mp3 = await openai.audio.speech.create({
          model: "tts-1",  // Replace with actual model name
          voice: "alloy",  // Replace with actual voice name
          input: modifiedText,
        });
  
        // Convert the response to an ArrayBuffer
        const arrayBuffer = await mp3.arrayBuffer();
  
        // Use Web Audio API to play the audio
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
  
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
  
        source.onended = () => setIsSpeaking(false);
  
        setIsSpeaking(true);
        source.start(0);
  
      } catch (error) {
        console.error('Error generating or playing speech:', error);
      }
    } else {
      // Use browser's speechSynthesis for other languages
      if ('speechSynthesis' in window) {
        const modifiedText = correctPronunciation(text);
  
        const newUtterance = new SpeechSynthesisUtterance(modifiedText);
        newUtterance.lang = language;
  
        newUtterance.onstart = () => setIsSpeaking(true);
        newUtterance.onend = () => setIsSpeaking(false);
  
        window.speechSynthesis.speak(newUtterance);
      } else {
        console.warn('Text-to-speech is not supported in this browser.');
      }
    }
  };
  const handleMicrophoneClick = () => {
    if (isSpeaking) {
      // Stop the speech
      window.speechSynthesis.cancel(); // Stop speech synthesis completely
      setIsSpeaking(false);
    } else if (!isListening) {
      // Start listening for speech input
      startListening();
    } else {
      // Stop listening
      stopListening();
      sendMessage();
    }
  };
    
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* // base og box */}
      <Box
      width = "100vw"
      height = "90vh"
      display = "flex"
      flexDirection = "column"
      // justifyContent = "center"
      // alignItems = "center"
      >
        {/* header language */}
        <Box
          height="10%"
          bgcolor="background.default"
          display="flex"
          justifyContent="space-between"
          paddingX={2.5}
          paddingY={2.5}
          alignItems="center"
          position="relative"
        >
          <FormControl
            id="language-button"
            sx={{
              width: '100px',  // Fixed width for language selector
              borderRadius: '12px',
              boxShadow: '0px 0px 12px rgba(0, 255, 255, 0.6)', // Glowing effect
              backgroundColor: 'action.active',
              color: 'background.default',
            }}
          >
            <Select
              value={prefLanguage}
              onChange={handleLanguageChange}
              disableunderline="true"
              displayEmpty
              renderValue={(selected) => {
                if (!selected) {
                  return <span>{('English')}</span>;
                }
                const selectedItem = {
                  "en-US": 'English',
                  "zh-CN": '中文（简体）',
                  // "es-ES": 'Español',
                  // "fr-FR": 'Français',
                  // "de-DE": 'Deutsch',
                  // "ja-JP": '日本語',
                  // "ko-KR": '한국어'
                }[selected];
                return <span>{selectedItem}</span>;
              }}
              sx={{
                fontSize: "0.9rem",
                fontWeight: "700",
                fontFamily: 'Roboto Mono, Arial, sans-serif',
                color: 'background.default',
                borderColor: 'background.default',
                '& .MuiOutlinedInput-notchedOutline': {
                  border: 'none', // Remove the border
                },
                '& .MuiSelect-select': {
                  paddingTop: '10px',
                  paddingBottom: '10px',
                },
                '& .MuiSelect-icon': {
                  color: 'background.default',
                },
              }}
            >
              <MenuItem value="en-US">English</MenuItem>
              <MenuItem value="zh-CN">中文</MenuItem>
              {/* <MenuItem value="es-ES">Español</MenuItem>
              <MenuItem value="fr-FR">Français</MenuItem>
              <MenuItem value="de-DE">Deutsch</MenuItem>
              <MenuItem value="ja-JP">日本語</MenuItem>
              <MenuItem value="ko-KR">한국어</MenuItem> */}
            </Select>
          </FormControl>

          {/* Title */}
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            sx={{
              flexGrow: 1,
              justifyContent: 'center', // Center the title text
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)', // Center based on the container width
            }}
          >
            <Typography variant="h6" color="text.primary" textAlign="center">
              {t('J.A.R.V.I.S.')}
            </Typography>
          </Box>

          {/* Sign In/Sign Out Button */}
          <Box
            sx={{
              width: '150px',  // Fixed width for the sign-in/sign-out button
              display: 'flex',
              justifyContent: 'flex-end',
            }}
          >
            {!user ? (
              <Button
                onClick={handleSignIn}
                sx={{
                  justifyContent: "center",
                  '&:hover': {
                    backgroundColor: 'text.primary',
                    color: 'background.default',
                    borderColor: 'text.primary',
                  },
                }}
              >
                {t('sign In')}
              </Button>
            ) : (
              <Button
                onClick={handleSignOut}
                sx={{
                  justifyContent: "center",
                  '&:hover': {
                    backgroundColor: 'text.primary',
                    color: 'background.default',
                    borderColor: 'text.primary',
                  },
                }}
              >
                {t('sign Out')}
              </Button>
            )}
          </Box>
        </Box>


      {/* outer container */}
      <Stack 
      direction = {"column"} 
      width = "100vw" 
      minHeight = "80vh" 
      // border = "1px solid black" 
      spacing = {3}
      >
        {/* messages */}
        <Stack direction = {"column"} spacing = {2} flexGrow = {1} overflow='auto' padding = {2}>
          {
            messages.map((message, index) => (
              <Box
              key={index}
              display = "flex"
              justifyContent = {message.role == 'assistant' ? 'flex-start' : 'flex-end'}
              >
                {message.role === 'assistant' && (
                <AssistantIcon sx={{ mr: 1, color: 'text.primary', fontSize: '2.5rem'}} />
              )}
                <Box
                bgcolor = {message.role == 'assistant' ? 'background.bubbles' : 'background.userBubble'}
                color = {message.role == 'assistant' ? "text.primary" : 'black'}
                borderRadius = {2.5}
                p = {2}
                >
                  <ReactMarkdown components={customComponents}>{message.content}</ReactMarkdown>
                </Box>
                {message.role === 'user' && (
                <PersonIcon sx={{ ml: 1, color: 'text.primary', fontSize: '2.5rem' }} />
              )}
              </Box> 
            ))}
            <div ref={messagesEndRef} />
        </Stack>
        {/* Input Field, Send Button, Clear Chat */}
        <Stack direction="row" spacing={1} padding={2} sx={{ width: '100%', bottom: 0 }}>
          <TextField
            placeholder={t('Message')}
            autoFocus
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isLoading}
            aria-label={t('Message input field')}
            sx={{
              borderRadius: '9999px', // Circular shape
              '& .MuiInputBase-root': {
                borderRadius: '9999px', // Circular input field
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderRadius: '9999px', // Circular outline
              },
              height: '48px', // Adjust the height to make it more circular
            }}
          />
          <Button
            onClick={handleMicrophoneClick} // Single click handler for all states
            variant="outlined"
            disabled={isLoading} // Disable while loading
            sx={{
              color: 'background.default',
              borderColor: 'text.primary',
              borderRadius: '9999px',
              height: '48px',
              width: '48px',
              minWidth: '48px',
              '&:hover': {
                backgroundColor: 'text.primary',
                color: 'background.default',
                borderColor: 'text.primary',
              },
            }}
          >
            {isSpeaking ? <StopIcon /> : isListening ? <SettingsVoiceIcon /> : <KeyboardVoiceIcon />}
          </Button>
          <Button
            variant="outlined"
            onClick={sendMessage}
            disabled={isLoading}
            sx={{
              color: 'background.default',
              borderColor: 'text.primary',
              borderRadius: '9999px', // Circular shape
              height: '48px', // Match height with TextField
              width: '48px', // Make it circular
              minWidth: '48px', // Ensure button stays circular
              '&:hover': {
                backgroundColor: 'text.primary',
                color: 'background.default',
                borderColor: 'text.primary',
              },
            }}
          >
            {isLoading ? <CircularProgress size={24} /> : <SendIcon />}
          </Button>
          <Button
            onClick={() => {
              if (window.confirm(t('Are you sure you want to delete the chat?'))) {
                clearChatLog(); // Only clear the chat log if the user confirms
              }
            }}
            variant="outlined"
            disabled={isLoading}
            sx={{
              color: 'background.default',
              borderColor: 'text.primary',
              borderRadius: '9999px', // Circular shape
              height: '48px', // Match height with TextField
              width: '48px', // Make it circular
              minWidth: '48px', // Ensure button stays circular
              '&:hover': {
                backgroundColor: 'text.primary',
                color: 'background.default',
                borderColor: 'text.primary',
              },
            }}
          >
            <DeleteIcon />
          </Button>
        </Stack>
        
      </Stack>
      </Box>
    </ThemeProvider>
  );
}