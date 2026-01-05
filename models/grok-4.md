# Grok 4.1 - Najlepsze Praktyki

Źródło: [xAI Docs](https://docs.x.ai/docs/guides/grok-code-prompt-engineering), [xAI GitHub](https://github.com/xai-org/grok-prompts)

---

## TL;DR - Najważniejsze

### REGUŁY:
1. **Iteruj zamiast perfekcjonować** - szybkie próby > idealny prompt
2. **Podawaj konkretny kontekst** - ścieżki plików, struktury projektu
3. **Używaj DeepSearch** dla aktualnych informacji, **Think mode** dla złożonych zadań

### UNIKAJ:
- **Zbyt długich promptów** → iteruj zamiast pisać wszystko na raz
- **Ogólnego kontekstu** → podaj konkretne pliki i struktury
- **Nadmiarowych danych** → dla kodu użyj grok-code-fast-1 (4x szybszy, 1/10 kosztów)

### SZYBKI START:
```markdown
## Cel
[Co chcesz osiągnąć]

## Kontekst
Projekt: [typ]
Pliki: [ścieżki]

## Zadanie
[Konkretne polecenie]
```

---

## Kluczowe cechy Grok 4.1

- **Real-time data access** - dostęp do aktualnych informacji (DeepSearch)
- **Iteracyjne podejście** - szybkie próby > idealne prompty
- **Think mode** - dla złożonego rozumowania
- **Konwersacyjny styl** - może być dowcipny i bezpośredni
- **grok-code-fast-1** - 4x szybszy, 1/10 kosztów dla kodu

---

## Zasady ogólne

### 1. Iteruj zamiast perfekcjonować

Grok jest szybki i tani. Zamiast 20 minut na "idealny" prompt:

```
Szybka próba → Analiza wyniku → Doprecyzowanie → Powtórz
```

**Źle:**
```
[Bardzo długi, skomplikowany prompt z każdym możliwym szczegółem]
```

**Dobrze:**
```
Napisz funkcję sortującą użytkowników po dacie rejestracji.
```

→ Jeśli wynik nie pasuje, doprecyzuj:
```
Dodaj obsługę null values i sortowanie malejące.
```

### 2. Bądź specyficzny z kontekstem

Podawaj konkretne ścieżki plików, struktury projektu, zależności:

```
Projekt: aplikacja React z TypeScript
Struktura:
- src/components/ - komponenty UI
- src/hooks/ - custom hooks
- src/api/ - wywołania API

Zadanie: Stwórz hook useUserData w src/hooks/
```

### 3. Używaj markdown headings lub XML tags

Grok efektywnie wykorzystuje strukturyzowany kontekst:

```markdown
## Kontekst
Aplikacja e-commerce, moduł koszyka

## Zadanie
Zoptymalizuj funkcję calculateTotal()

## Wymagania
- Obsługa rabatów procentowych i kwotowych
- Zaokrąglanie do 2 miejsc po przecinku
```

---

## Tryby specjalne

### DeepSearch - aktualne informacje

Dla informacji wymagających aktualnych danych:

```
Używając DeepSearch, znajdź i podsumuj 3 artykuły z 2025
o wykorzystaniu AI w edukacji.
```

```
DeepSearch: Jakie są najnowsze zmiany w React 19?
```

### Think Mode - złożone rozumowanie

Dla problemów wymagających krok po kroku:

```
Użyj think mode: Jeśli pociąg jedzie 200 km w 4 godziny,
oblicz średnią prędkość krok po kroku.
```

```
Think mode: Przeanalizuj architekturę tego systemu
i zaproponuj optymalizacje.
```

---

## Grok dla kodu (grok-code-fast-1)

Wyspecjalizowany model do zadań kodowych:
- 4x szybszy
- 1/10 kosztów
- Idealny do nawigacji w dużych codebase'ach

### Wskazówki dla grok-code-fast-1:

```
Wybierz konkretny kod jako kontekst - unikaj zbędnych plików.
Podaj relevantne ścieżki i strukturę projektu.
```

**Źle:**
```
Oto cały projekt: [100 plików]
Znajdź bug.
```

**Dobrze:**
```
Plik: src/services/auth.ts
Problem: Login zwraca 401 mimo poprawnych credentials

Relevantne pliki:
- src/api/client.ts (konfiguracja axios)
- src/config/env.ts (zmienne środowiskowe)
```

---

## Strukturyzacja promptów

### Preferowana struktura dla Grok:

```markdown
## Cel
[Co chcesz osiągnąć]

## Kontekst
[Tło, projekt, technologie]

## Szczegóły zadania
[Konkretne wymagania]

## Oczekiwany output
[Format odpowiedzi]
```

### Alternatywnie z XML:

```xml
<goal>Refaktoryzacja funkcji walidacji</goal>

<context>
Framework: Express.js
Plik: src/middleware/validator.ts
Problem: Zbyt skomplikowana logika
</context>

<requirements>
- Rozdziel na mniejsze funkcje
- Dodaj typowanie TypeScript
- Zachowaj istniejące testy
</requirements>
```

---

## Styl odpowiedzi

Grok może być bezpośredni i dowcipny. Jeśli wolisz inny styl:

```
Odpowiadaj profesjonalnie i rzeczowo, bez żartów.
```

```
Bądź zwięzły - maksymalnie 3 zdania na punkt.
```

```
Używaj technicznego języka odpowiedniego dla senior developerów.
```

---

## Obsługa błędów i edge cases

Grok dobrze radzi sobie z debugging. Podaj kontekst błędu:

```
Error: TypeError: Cannot read property 'map' of undefined

Kod:
[fragment kodu]

Stack trace:
[stack trace]

Co próbowałem:
- Sprawdziłem czy data istnieje
- Dodałem console.log (pokazuje undefined)

Pomóż zdiagnozować przyczynę.
```

---

## Parametry API

| Parametr | Rekomendacja |
|----------|--------------|
| Model (general) | `grok-4.1` |
| Model (code) | `grok-code-fast-1` |
| Temperature | Domyślna dla większości zadań |

### Kiedy który model:
- **grok-4.1**: Analiza, pisanie, reasoning, one-shot Q&A
- **grok-code-fast-1**: Kod, debugging, refaktoring, code review

---

## Few-shot dla Grok

Grok dobrze reaguje na przykłady, szczególnie dla formatowania:

```
Generuj commit messages w formacie:

Przykład 1:
Zmiana: Dodano walidację email
Output: feat(auth): add email validation to signup form

Przykład 2:
Zmiana: Naprawiono błąd w kalkulatorze
Output: fix(calc): resolve division by zero error

Teraz:
Zmiana: [twój opis]
```

---

## Grok vs inne modele

| Aspekt | Grok | Inne |
|--------|------|------|
| Aktualne dane | DeepSearch | Ograniczone |
| Prędkość | Bardzo szybki | Różnie |
| Iteracje | Zachęcane | Kosztowne |
| Styl | Bezpośredni, dowcipny | Formalny |

---

## Checklist przed wysłaniem promptu

- [ ] Prompt jest zwięzły (można iterować)
- [ ] Kontekst jest specyficzny (ścieżki, struktury)
- [ ] Użyto markdown/XML dla struktury
- [ ] Określono tryb jeśli potrzebny (DeepSearch/Think)
- [ ] Wybrany odpowiedni model (grok-4.1 vs grok-code-fast-1)
- [ ] Podano format oczekiwanego outputu
