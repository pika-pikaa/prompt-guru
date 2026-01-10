# Prompt Guru

[![CI](https://github.com/pika-pikaa/prompt-guru/actions/workflows/ci.yml/badge.svg)](https://github.com/pika-pikaa/prompt-guru/actions/workflows/ci.yml)
[![Docker](https://github.com/pika-pikaa/prompt-guru/actions/workflows/docker.yml/badge.svg)](https://github.com/pika-pikaa/prompt-guru/actions/workflows/docker.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Aplikacja do generowania i optymalizacji promptów AI**

Prompt Guru to nowoczesna aplikacja webowa, która pomaga tworzyć zoptymalizowane prompty dla różnych modeli AI. Dzięki wbudowanej wiedzy o specyfice każdego modelu, aplikacja generuje prompty dostosowane do ich wymagań i najlepszych praktyk.

---

## Spis Treści

- [Funkcjonalności](#funkcjonalności)
- [Obsługiwane Modele AI](#obsługiwane-modele-ai)
- [Szybki Start z Docker](#szybki-start-z-docker)
- [Konfiguracja Deweloperska](#konfiguracja-deweloperska)
- [Zmienne Środowiskowe](#zmienne-środowiskowe)
- [Instrukcja Użytkowania](#instrukcja-użytkowania)
- [Dokumentacja API](#dokumentacja-api)
- [Struktura Projektu](#struktura-projektu)
- [Stack Technologiczny](#stack-technologiczny)
- [Licencja](#licencja)

---

## Funkcjonalności

### Kreator Promptów
Twórz zoptymalizowane prompty dostosowane do konkretnych modeli AI:
- **Trzy wersje wyjściowe**: Rozbudowana, Standardowa i Minimalna
- **Optymalizacja pod model**: Każdy prompt stosuje najlepsze praktyki danego modelu
- **Techniki promptowania**: Chain-of-Thought, Few-Shot, Role-Play, XML tags i więcej
- **Tryb szybki i pełny**: 3 pola dla szybkiego startu lub wszystkie opcje dla zaawansowanych

### Optymalizator Promptów
Analizuj i ulepszaj istniejące prompty:
- Identyfikacja problemów i antywzorców
- Rekomendacje specyficzne dla modelu
- Podgląd zmian z wyjaśnieniami (Diff Viewer)
- Porównanie statystyk przed/po

### Szybkie Przepisy
Gotowe szablony dla typowych zadań:
- **Code Review** - analiza i recenzja kodu
- **System Prompts** - tworzenie chatbotów i asystentów
- **Generowanie Obrazów** - prompty dla modeli obrazowych
- **Generowanie Wideo** - prompty dla modeli wideo
- **Research / Deep Research** - badania i analiza źródeł
- **Tłumaczenie** - wielojęzyczne tłumaczenia
- **Streszczanie** - kondensacja treści
- **Debugging** - diagnostyka kodu
- **Fact-checking** - weryfikacja faktów
- **Copywriting** - teksty marketingowe

### Autoryzacja Użytkowników
Bezpieczna autoryzacja oparta na JWT:
- Access token + Refresh token
- Zarządzanie sesjami
- Ochrona przed atakami brute-force (rate limiting)

### Historia Promptów
Zapisuj, organizuj i zarządzaj promptami:
- System ulubionych
- Wyszukiwanie i filtrowanie
- Kopiowanie jednym kliknięciem

---

## Obsługiwane Modele AI

### Modele Językowe (LLM)
| Model | Dostawca | Specjalizacja |
|-------|----------|---------------|
| **Claude 4.5** (Opus/Sonnet) | Anthropic | Złożone zadania, kod, analiza |
| **GPT-5.2** | OpenAI | Wieloetapowe rozumowanie, pisanie kreatywne |
| **Grok 4.1** | xAI | Informacje w czasie rzeczywistym, zadania iteracyjne |
| **Gemini 3 Pro** | Google | Multimodalność, długi kontekst (1M tokenów) |

### Generowanie Obrazów
| Model | Dostawca | Specjalizacja |
|-------|----------|---------------|
| **Grok Aurora** | xAI | Fotorealizm, tekst na obrazach |
| **Nano Banana 2.5** | Google DeepMind | Spójność postaci (do 5 osób) |

### Generowanie Wideo
| Model | Dostawca | Specjalizacja |
|-------|----------|---------------|
| **Grok Imagine** | xAI | Wideo 6-15s z dźwiękiem |

### Wyszukiwanie AI
| Model | Dostawca | Specjalizacja |
|-------|----------|---------------|
| **Perplexity Pro** | Perplexity AI | Wyszukiwanie w sieci, Deep Research |

---

## Szybki Start z Docker

Najszybszy sposób na uruchomienie Prompt Guru lokalnie.

### Wymagania
- [Docker](https://docs.docker.com/get-docker/) (v20.10+)
- [Docker Compose](https://docs.docker.com/compose/install/) (v2.0+)

### Kroki

1. **Sklonuj repozytorium**
   ```bash
   git clone https://github.com/pika-pikaa/prompt-guru.git
   cd prompt-guru
   ```

2. **Utwórz plik konfiguracyjny**
   ```bash
   cp .env.example .env
   ```

3. **Uruchom wszystkie usługi**
   ```bash
   docker-compose up -d
   ```

4. **Otwórz aplikację**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:4000

### Komendy Docker

```bash
# Uruchom usługi
docker-compose up -d

# Sprawdź logi
docker-compose logs -f              # Wszystkie usługi
docker-compose logs -f backend      # Tylko backend

# Zatrzymaj usługi
docker-compose down

# Zatrzymaj i usuń dane (reset bazy)
docker-compose down -v

# Przebuduj kontenery
docker-compose up -d --build
```

### Wdrożenie Produkcyjne

```bash
# Zbuduj i uruchom kontenery produkcyjne
docker-compose -f docker-compose.prod.yml up -d
```

---

## Konfiguracja Deweloperska

Dla lokalnego rozwoju bez Dockera.

### Wymagania
- [Node.js](https://nodejs.org/) v20.x lub nowszy
- [PostgreSQL](https://www.postgresql.org/) v15.x
- npm v10.x lub nowszy

### Konfiguracja Backendu

```bash
# Przejdź do katalogu backend
cd backend

# Zainstaluj zależności
npm install

# Skopiuj plik konfiguracyjny
cp .env.example .env
# Edytuj .env z danymi do bazy

# Wygeneruj klienta Prisma
npm run db:generate

# Uruchom migracje
npm run db:push

# Uruchom serwer deweloperski
npm run dev
```

Backend API będzie dostępny pod `http://localhost:4000`.

### Konfiguracja Frontendu

```bash
# Przejdź do katalogu frontend
cd frontend

# Zainstaluj zależności
npm install

# Uruchom serwer deweloperski
npm run dev
```

Frontend będzie dostępny pod `http://localhost:3000`.

---

## Zmienne Środowiskowe

### Główny plik `.env`

```env
# Baza danych PostgreSQL
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/promptguru

# Konfiguracja JWT
JWT_SECRET=twoj-super-tajny-klucz-jwt-zmien-w-produkcji
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# Serwer
PORT=4000
NODE_ENV=development
```

---

## Instrukcja Użytkowania

### Rejestracja i Logowanie

1. Przejdź do strony **Zarejestruj się** (`/register`)
2. Wprowadź:
   - **Imię** - Twoje imię lub pseudonim
   - **Email** - adres email (będzie służył jako login)
   - **Hasło** - minimum 6 znaków
3. Kliknij **Utwórz konto**
4. Po rejestracji zostaniesz automatycznie zalogowany i przekierowany do panelu głównego

### Tworzenie Nowego Prompta

#### Tryb Szybki (domyślny)
1. Przejdź do **Utwórz prompt** w menu bocznym
2. **Wybierz model AI** - kliknij na kafelek z wybranym modelem
3. **Opisz cel prompta** - wpisz co chcesz osiągnąć
4. Kliknij **Generuj prompty**
5. Otrzymasz 3 wersje:
   - **Rozbudowana** - najbardziej szczegółowa, z pełnym kontekstem
   - **Standardowa** - zbalansowana wersja
   - **Minimalna** - skondensowana do niezbędnego minimum

#### Tryb Pełny
1. Kliknij przełącznik **Tryb pełny** w prawym górnym rogu formularza
2. Wypełnij dodatkowe pola:
   - **Typ zadania** - wybierz kategorię (kod, tekst, analiza, itp.)
   - **Kontekst** - dodatkowe informacje o zadaniu
   - **Docelowa publiczność** - dla kogo jest wynik
   - **Format wyjściowy** - oczekiwany format odpowiedzi
   - **Ton** - formalny, nieformalny, techniczny, itp.
   - **Ograniczenia** - czego unikać, limity
3. **Wybierz techniki promptowania**:
   - Chain-of-Thought - krok po kroku
   - Few-Shot - przykłady
   - Role-Play - przypisanie roli
   - XML Tags - strukturyzacja (Claude)
   - Markdown - formatowanie (GPT)
4. Kliknij **Generuj prompty**

### Optymalizacja Istniejącego Prompta

1. Przejdź do **Optymalizuj** w menu bocznym
2. **Wklej oryginalny prompt** w pole tekstowe
3. **Wybierz docelowy model** - dla którego optymalizować
4. **Zaznacz obszary do optymalizacji**:
   - Jasność i precyzja
   - Struktura
   - Kontekst
   - Instrukcje
   - Zgodność z modelem
   - Wydajność
5. Kliknij **Optymalizuj**
6. **Porównaj wyniki** w Diff Viewer:
   - Widok obok siebie
   - Widok zunifikowany
   - Statystyki zmian (tokeny, znaki)

### Korzystanie z Szybkich Przepisów

1. Przejdź do **Szybkie przepisy** w menu bocznym
2. **Filtruj przepisy** według kategorii:
   - Kod - Code Review, Debugging
   - Tekst - Copywriting, Tłumaczenie, Streszczanie
   - Obraz - Generowanie obrazów, Portrety
   - Research - Deep Research, Fact-checking
3. **Kliknij na wybrany przepis**
4. **Wypełnij wymagane pola** specyficzne dla przepisu
5. Otrzymasz gotowy, zoptymalizowany prompt

### Zarządzanie Zapisanymi Promptami

1. **Dashboard** pokazuje:
   - Statystyki (łączna liczba, ulubione, ostatnie)
   - Ulubione prompty
   - Ostatnio utworzone prompty
2. **Dodaj do ulubionych** - kliknij ikonę serca na karcie prompta
3. **Kopiuj prompt** - kliknij ikonę kopiowania
4. **Zobacz szczegóły** - kliknij na kartę prompta
5. **Usuń prompt** - w menu kontekstowym (...)

### Przełączanie Trybu Ciemnego/Jasnego

1. Kliknij ikonę słońca/księżyca w prawym górnym rogu
2. Motyw zostanie zapisany i zapamiętany

---

## Dokumentacja API

Backend udostępnia RESTful API pod `http://localhost:4000/api`.

### Endpointy Autoryzacji

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/auth/register` | Rejestracja nowego użytkownika |
| POST | `/api/auth/login` | Logowanie i pobranie tokenów |
| POST | `/api/auth/refresh` | Odświeżenie access tokenu |
| POST | `/api/auth/logout` | Unieważnienie refresh tokenu |
| GET | `/api/auth/me` | Pobranie profilu zalogowanego użytkownika |

### Endpointy Promptów

| Metoda | Endpoint | Auth | Opis |
|--------|----------|------|------|
| POST | `/api/prompts/generate` | Nie | Generowanie promptów (3 wersje) |
| POST | `/api/prompts/optimize` | Nie | Optymalizacja istniejącego prompta |
| GET | `/api/prompts` | Tak | Lista zapisanych promptów użytkownika |
| POST | `/api/prompts` | Tak | Zapisanie nowego prompta |
| GET | `/api/prompts/:id` | Tak | Pobranie prompta po ID |
| PUT | `/api/prompts/:id` | Tak | Aktualizacja prompta |
| DELETE | `/api/prompts/:id` | Tak | Usunięcie prompta |
| PATCH | `/api/prompts/:id/favorite` | Tak | Przełączenie statusu ulubionego |

### Endpointy Modeli

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/models` | Lista wszystkich dostępnych modeli |
| GET | `/api/models/:slug` | Szczegóły modelu i reguły |

### Endpointy Przepisów

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/recipes` | Lista wszystkich szybkich przepisów |
| GET | `/api/recipes/:slug` | Szczegóły przepisu |

### Format Odpowiedzi

Wszystkie odpowiedzi API mają strukturę:

```json
{
  "success": true,
  "data": { ... },
  "error": null
}
```

Odpowiedzi błędów:

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "KOD_BLEDU",
    "message": "Czytelny komunikat błędu"
  }
}
```

---

## Struktura Projektu

```
prompt-guru/
├── backend/                    # Serwer API Express.js
│   ├── prisma/
│   │   └── schema.prisma       # Schemat bazy danych
│   ├── src/
│   │   ├── index.ts            # Punkt wejścia aplikacji
│   │   ├── lib/
│   │   │   └── prisma.ts       # Instancja klienta Prisma
│   │   ├── middleware/
│   │   │   ├── auth.ts         # Autoryzacja JWT
│   │   │   ├── rateLimit.ts    # Rate limiting
│   │   │   └── validate.ts     # Walidacja żądań (Zod)
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── models.routes.ts
│   │   │   ├── prompts.routes.ts
│   │   │   └── recipes.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── model-rules.service.ts
│   │   │   ├── prompt-generator.service.ts
│   │   │   ├── prompt-optimizer.service.ts
│   │   │   └── quick-recipes.service.ts
│   │   └── types/
│   ├── Dockerfile.dev
│   └── package.json
│
├── frontend/                   # Aplikacja React SPA
│   ├── src/
│   │   ├── components/
│   │   │   ├── display/        # Komponenty wyświetlania
│   │   │   ├── forms/          # Formularze
│   │   │   ├── layout/         # Komponenty układu
│   │   │   └── ui/             # Komponenty UI
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── CreatePromptPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── OptimizePage.tsx
│   │   │   └── QuickRecipesPage.tsx
│   │   ├── stores/             # Stan aplikacji (Zustand)
│   │   ├── services/           # Klient API
│   │   ├── lib/                # Narzędzia, animacje
│   │   └── types/              # Typy TypeScript
│   ├── Dockerfile.dev
│   └── package.json
│
├── models/                     # Dokumentacja modeli AI
├── templates/                  # Szablony promptów
├── docker/                     # Konfiguracje Docker
├── .github/workflows/          # CI/CD GitHub Actions
├── docker-compose.yml          # Środowisko deweloperskie
├── docker-compose.prod.yml     # Środowisko produkcyjne
├── SKILL.md                    # Definicja skilla Prompt Guru
└── README.md
```

---

## Stack Technologiczny

### Frontend
- **React 19** - Biblioteka UI
- **TypeScript 5.9** - Bezpieczeństwo typów
- **Vite 7** - Narzędzie budowania
- **Tailwind CSS 4** - Stylowanie
- **Framer Motion** - Animacje
- **Zustand** - Zarządzanie stanem
- **React Router 7** - Routing
- **TanStack Query** - Pobieranie danych
- **Axios** - Klient HTTP

### Backend
- **Express** - Framework webowy
- **TypeScript** - Bezpieczeństwo typów
- **Prisma** - ORM
- **PostgreSQL 15** - Baza danych
- **Zod** - Walidacja
- **JWT** - Autoryzacja
- **Helmet** - Nagłówki bezpieczeństwa
- **bcryptjs** - Hashowanie haseł

### DevOps
- **Docker & Docker Compose** - Konteneryzacja
- **GitHub Actions** - CI/CD
- **Nginx** - Reverse proxy (produkcja)

---

## Design System

### Kolory
- **Primary**: Fioletowy (#8B5CF6)
- **Background**: Biały (jasny) / Ciemny granat (ciemny)
- **Glassmorphism**: Przezroczyste tła z efektem rozmycia

### Animacje
- Page transitions (Framer Motion)
- Skeleton loaders podczas ładowania
- Micro-interactions na przyciskach
- Hover effects na kartach

### Responsywność
- Mobile-first design
- Touch-friendly (min 44px targets)
- Breakpoints: sm (640px), md (768px), lg (1024px)

---

## Licencja

Ten projekt jest licencjonowany na warunkach licencji MIT - zobacz plik [LICENSE](LICENSE) po szczegóły.

---

## Autor

**Mateusz Górski**

---

## Wsparcie

Jeśli masz pytania lub problemy:
1. Sprawdź sekcję [Issues](https://github.com/pika-pikaa/prompt-guru/issues)
2. Utwórz nowy issue z opisem problemu

---

Zbudowane z myślą o społeczności inżynierii promptów AI.
