// i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  "en-US": {
    translation: {
        'Hi! I am your AI assistant. How can I help you today?':'Hi {{name}}! I am your AI assistant. How can I help you today?',
        'Your browser does not support speech recognition.':'Your browser does not support speech recognition.',
        'Message':'Message',
        'Message input field':'Message input field',
        'Are you sure you want to delete the chat?':'Are you sure you want to delete the chat?',
        'sign In': "Sign In",
        "sign Out": "Sign Out",
    }
  },
  "zh-CN": {
    translation: {
        'Hi! I am your AI assistant. How can I help you today?': '嗨！我是您的AI助手。今天我能帮您什么？',
        'Your browser does not support speech recognition.': '您的浏览器不支持语音识别。',
        'Message': '消息',
        'Message input field': '消息输入框',
        'Are you sure you want to delete the chat?': '您确定要删除聊天记录吗？',
        "sign In": "登入",
        "sign Out": "登出",
    }
  },
  es: {
    translation: {
        'Hi! I am your AI assistant. How can I help you today?': '¡Hola! Soy tu asistente de IA. ¿Cómo puedo ayudarte hoy?',
        'Your browser does not support speech recognition.': 'Tu navegador no admite el reconocimiento de voz.',
        'Message': 'Mensaje',
        'Message input field': 'Campo de entrada de mensajes',
        'Are you sure you want to delete the chat?': '¿Estás seguro de que deseas eliminar el chat?',
        "sign In": "Iniciar sesión",
        "sign Out": "Cerrar sesión",
    }
  },
  fr: {
    translation: {
        'Hi! I am your AI assistant. How can I help you today?': 'Salut! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui?',
        'Your browser does not support speech recognition.': 'Votre navigateur ne prend pas en charge la reconnaissance vocale.',
        'Message': 'Message',
        'Message input field': 'Champ de saisie de message',
        'Are you sure you want to delete the chat?': 'Êtes-vous sûr de vouloir supprimer la discussion?',
        "sign In": "Se connecter",
        "sign Out": "Se déconnecter",
    }
  },
  de: {
    translation: {
        'Hi! I am your AI assistant. How can I help you today?': 'Hallo! Ich bin Ihr KI-Assistent. Wie kann ich Ihnen heute helfen?',
        'Your browser does not support speech recognition.': 'Ihr Browser unterstützt keine Spracherkennung.',
        'Message': 'Nachricht',
        'Message input field': 'Nachrichteneingabefeld',
        'Are you sure you want to delete the chat?': 'Sind Sie sicher, dass Sie den Chat löschen möchten?',
        "sign In": "Anmelden",
        "sign Out": "Abmelden",
    }
  },
  "ja-JP": {
    translation: {
        'Hi! I am your AI assistant. How can I help you today?': 'こんにちは！私はあなたのAIアシスタントです。今日はどうされましたか？',
        'Your browser does not support speech recognition.': 'お使いのブラウザは音声認識に対応していません。',
        'Message': 'メッセージ',
        'Message input field': 'メッセージ入力欄',
        'Are you sure you want to delete the chat?': 'チャットを削除してもよろしいですか？',
        "sign In": "サインイン",
        "sign Out": "サインアウト",
    }
  },
  "ko-KR": {
    translation: {
        'Hi! I am your AI assistant. How can I help you today?': '안녕하세요! 저는 당신의 AI 도우미입니다. 오늘 무엇을 도와드릴까요?',
        'Your browser does not support speech recognition.': '브라우저가 음성 인식을 지원하지 않습니다.',
        'Message': '메시지',
        'Message input field': '메시지 입력 필드',
        'Are you sure you want to delete the chat?': '채팅을 삭제하시겠습니까?',
        "sign In": "로그인",
        "sign Out": "로그아웃"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en", // Set the default language here
    fallbackLng: "en", // Default language if the specified language fails
    keySeparator: false,
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
