# MentorChat

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Demo App
https://zapytaj-6fbcc.web.app/

## Spis Treści Zadań - Chatbot Zapytaj AI

Wdrożenie od zera do produkcji
📋 FAZA I: PRZYGOTOWANIE FUNDAMENTÓW (Tydzień 1-2)
1.1 Konfiguracja Środowiska Deweloperskiego

    1.1.1 Instalacja Node.js 18+, Angular CLI 17+, Firebase CLI

    1.1.2 Konfiguracja IDE (VS Code + rozszerzenia: Angular, Firebase, TypeScript)

    1.1.3 Utworzenie kont: Firebase Console, OpenAI API, GitHub

    1.1.4 Konfiguracja Git repository z .gitignore i podstawową strukturą

1.2 Inicjalizacja Projektu Angular + Firebase

    1.2.1 ng new historical-mentor-chat --routing --style=scss --strict

    1.2.2 ng add @angular/fire - konfiguracja Firebase SDK

    1.2.3 ng add @angular/material - Material Design UI

    1.2.4 firebase init - Firestore, Functions, Hosting, Extensions

    1.2.5 Konfiguracja environment variables (dev/prod)

1.3 Podstawowa Struktura Aplikacji

    1.3.1 Utworzenie modułów: Core, Shared, Features (Auth, Chat, Admin)

    1.3.2 Routing i lazy loading modules

    1.3.3 Podstawowy layout: header, sidebar, main content

    1.3.4 Error handling i loading interceptors

    1.3.5 Konfiguracja ESLint, Prettier, pre-commit hooks

📊 FAZA II: BAZA DANYCH I EMBEDDINGI (Tydzień 2-3)
2.1 Projektowanie Struktury Firestore

    2.1.1 Definicja kolekcji: users, conversations, messages, quotes, embeddings

    2.1.2 Utworzenie interfejsów TypeScript dla wszystkich modeli

    2.1.3 Konfiguracja Firestore Security Rules

    2.1.4 Utworzenie indeksów kompozytowych

2.2 Przygotowanie Bazy Cytatów

    2.2.1 Zebranie cytatów historycznych (min. 500-1000 cytatów)

    2.2.2 Strukturyzacja danych: autor, tekst, kontekst, tagi, epoka

    2.2.3 Walidacja i czyszczenie danych (duplikaty, błędy)

    2.2.4 Import do formatu JSON/CSV

2.3 System Embeddingów

    2.3.1 Cloud Function do generowania embeddingów (OpenAI text-embedding-ada-002)

    2.3.2 Batch processing cytatów - obliczenie wektorów

    2.3.3 Zapisanie embeddingów w Firestore/Cloud Storage

    2.3.4 Funkcja similarity search (cosine similarity)

2.4 Admin Panel do Zarządzania Cytatami

    2.4.1 CRUD interface dla dodawania/edycji cytatów

    2.4.2 Batch upload CSV/JSON

    2.4.3 Preview embeddingów i similarity testing

    2.4.4 Tagi i kategoryzacja cytatów

🔐 FAZA III: AUTENTYKACJA I BEZPIECZEŃSTWO (Tydzień 3-4)
3.1 Firebase Authentication

    3.1.1 Konfiguracja providers: Email/Password, Google, opcjonalnie GitHub

    3.1.2 Angular Auth Service z Observable user state

    3.1.3 Auth Guards dla chronionych route'ów

    3.1.4 Auto-logout po wygaśnięciu tokenu

3.2 User Management System

    3.2.1 User profile creation w Firestore po rejestracji

    3.2.2 User preferences: preferred historical figures, topics

    3.2.3 Usage limits i rate limiting

    3.2.4 User roles: user, premium, admin

3.3 Security Rules i Validation

    3.3.1 Firestore Security Rules dla wszystkich kolekcji

    3.3.2 Cloud Functions security: auth verification

    3.3.3 Input validation i sanitization

    3.3.4 API rate limiting implementation

🤖 FAZA IV: CORE RAG SYSTEM (Tydzień 4-6)
4.1 RAG Pipeline - Cloud Functions

    4.1.1 Główna funkcja processHistoricalQuery

    4.1.2 Query embedding generation

    4.1.3 Vector similarity search w bazie cytatów

    4.1.4 Context preparation z top-K cytatami

    4.1.5 LLM prompt engineering dla postaci historycznych

4.2 Multi-Persona System

    4.2.1 Konfiguracja różnych postaci historycznych (Sokrates, Leonardo, Marcus Aurelius)

    4.2.2 Persona-specific prompt templates

    4.2.3 Context filtering na podstawie epoki/tematyki

    4.2.4 Personality consistency validation

4.3 Intelligent Question System

    4.3.1 Logika do wykrywania niejasnych pytań

    4.3.2 Generation follow-up questions

    4.3.3 Context accumulation przez conversation thread

    4.3.4 Final answer generation z odpowiednim cytatem

4.4 Context Management

    4.4.1 Conversation history compression

    4.4.2 Relevant context extraction

    4.4.3 Token limit management

    4.4.4 Context cache implementation

💬 FAZA V: CHAT INTERFACE (Tydzień 5-6)
5.1 Chat Window Component

    5.1.1 Real-time message display z Firestore streams

    5.1.2 Message typing indicators

    5.1.3 Quote highlighting w odpowiedziach

    5.1.4 Message metadata: sources, confidence, persona

5.2 Input System

    5.2.1 Multi-line text input z shortcuts

    5.2.2 Send button states (loading, disabled)

    5.2.3 Character/token limit indicators

    5.2.4 Input validation i error handling

5.3 Conversation Management

    5.3.1 Conversation list sidebar

    5.3.2 New conversation creation

    5.3.3 Conversation switching

    5.3.4 Conversation search i filtering

5.4 Persona Selection

    5.4.1 Historical figure selector

    5.4.2 Persona preview z przykładowymi cytatami

    5.4.3 Dynamic persona switching w conversations

    5.4.4 Persona-specific UI themes

🎨 FAZA VI: UI/UX ENHANCEMENT (Tydzień 6-7)
6.1 Responsive Design

    6.1.1 Mobile-first approach implementation

    6.1.2 Tablet layout optimization

    6.1.3 Desktop advanced features

    6.1.4 Cross-browser compatibility testing

6.2 Historical Theming

    6.2.1 Era-specific color schemes (Ancient Greece, Renaissance, etc.)

    6.2.2 Historical typography fonts

    6.2.3 Subtle animations i transitions

    6.2.4 Dark/Light mode toggle

6.3 Advanced UX Features

    6.3.1 Quote favoriting i bookmarking

    6.3.2 Conversation export (PDF, TXT)

    6.3.3 Search w historical quotes

    6.3.4 Keyboard shortcuts i accessibility

📊 FAZA VII: ANALYTICS & MONITORING (Tydzień 7-8)
7.1 Usage Analytics

    7.1.1 Firebase Analytics integration

    7.1.2 Custom events: message sent, persona changed, quote viewed

    7.1.3 User engagement metrics

    7.1.4 Popular quotes i personas tracking

7.2 Performance Monitoring

    7.2.1 Cloud Functions monitoring

    7.2.2 Response time tracking

    7.2.3 Error rate monitoring

    7.2.4 Cost tracking (API calls, Firestore reads)

7.3 Quality Metrics

    7.3.1 User satisfaction rating system

    7.3.2 Quote relevance feedback

    7.3.3 Conversation quality scoring

    7.3.4 A/B testing framework

🧪 FAZA VIII: TESTING & OPTIMIZATION (Tydzień 8-9)
8.1 Unit Testing

    8.1.1 Angular services testing (Jasmine/Karma)

    8.1.2 Cloud Functions testing (Jest)

    8.1.3 RAG pipeline testing z mock data

    8.1.4 Security Rules testing

8.2 Integration Testing

    8.2.1 End-to-end conversation flows

    8.2.2 Multi-persona switching testing

    8.2.3 Real-time sync testing

    8.2.4 Performance testing pod obciążeniem

8.3 User Acceptance Testing

    8.3.1 Beta testing z grupą użytkowników

    8.3.2 Feedback collection i analysis

    8.3.3 Bug fixes i improvements

    8.3.4 Documentation update

🚀 FAZA IX: DEPLOYMENT & LAUNCH (Tydzień 9-10)
9.1 Production Setup

    9.1.1 Production Firebase project configuration

    9.1.2 Environment variables setup

    9.1.3 Domain configuration i SSL

    9.1.4 CDN setup dla static assets

9.2 CI/CD Pipeline

    9.2.1 GitHub Actions workflow

    9.2.2 Automated testing w pipeline

    9.2.3 Staging environment deployment

    9.2.4 Production deployment automation

9.3 Launch Preparation

    9.3.1 Documentation completion (README, API docs)

    9.3.2 User onboarding flow

    9.3.3 Marketing materials preparation

    9.3.4 Support system setup

🔄 FAZA X: POST-LAUNCH & MAINTENANCE (Ongoing)
10.1 Immediate Post-Launch (Tydzień 10-11)

    10.1.1 Live monitoring i incident response

    10.1.2 User feedback collection i triage

    10.1.3 Performance optimization based na real usage

    10.1.4 Bug fixes i hotfixes

10.2 Content Expansion

    10.2.1 Dodatkowe postacie historyczne

    10.2.2 Więcej cytatów i źródeł

    10.2.3 Specialized domains (filozofia, nauka, sztuka)

    10.2.4 Multi-language support

10.3 Feature Enhancement

    10.3.1 Voice input/output

    10.3.2 Image generation (historical scenes)

    10.3.3 Educational quizzes based na conversations

    10.3.4 Social features (sharing quotes)
