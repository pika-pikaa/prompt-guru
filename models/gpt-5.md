# ChatGPT 5.2 (GPT-5.2) - Najlepsze Praktyki

Źródło: [OpenAI Cookbook](https://cookbook.openai.com/examples/gpt-5/gpt-5-2_prompting_guide), [OpenAI Platform](https://platform.openai.com/docs/guides/prompt-engineering)

---

## TL;DR - Najważniejsze

### REGUŁY:
1. **Bądź specyficzny i strukturyzowany** - każde słowo uruchamia różne ścieżki
2. **Używaj Markdown** z sekcjami (## Rola, ## Kontekst, ## Zadanie, ## Format)
3. **Definiuj rolę** - "Jesteś [specjalizacja] z doświadczeniem w [dziedzina]"

### UNIKAJ:
- **Mieszanych sygnałów** - "preferuj X, ale Y też ok" → wybierz jedno
- **Niejasnego formatu** → zawsze określ oczekiwany output
- **Zbyt ogólnych promptów** → GPT-5.2 nie zgaduje intencji

### SZYBKI START:
```markdown
## Rola
Jesteś [rola] specjalizującym się w [dziedzina].

## Zadanie
[Konkretne polecenie]

## Wymagania
- [Wymaganie 1]
- [Wymaganie 2]

## Format odpowiedzi
[Oczekiwany format]
```

---

## Kluczowe cechy GPT-5.2

- **System routingowy** - nie jeden model, ale system zarządzający wyspecjalizowanymi modelami
- **Każde słowo ma znaczenie** - formatowanie i słowa uruchamiają różne ścieżki obliczeniowe
- **Ekstremalna precyzja** - znacznie gorszy w zgadywaniu intencji z niejasnych promptów
- **Doskonałe reasoning** - radzi sobie z długimi, wieloetapowymi promptami

---

## Zasady ogólne

### 1. Bądź specyficzny i strukturyzowany

GPT-5.2 jest znacznie lepszy w rozumowaniu przez złożone instrukcje. Konsoliduj kontekst w jednym zapytaniu.

**Źle:**
```
Napisz funkcję
```

**Dobrze:**
```
Napisz funkcję JavaScript która:
1. Przyjmuje tablicę obiektów z polami id, name, price
2. Filtruje produkty z ceną powyżej 100
3. Sortuje malejąco po cenie
4. Zwraca top 5 z formatowanymi cenami (PLN)

Wymagania:
- Użyj funkcji strzałkowych
- Dodaj walidację inputu
- Zwróć pustą tablicę jeśli brak wyników
```

### 2. Unikaj mieszanych sygnałów

Prompty nie powinny zawierać sprzecznych instrukcji.

**Źle:**
```
Preferuj standardową bibliotekę, ale użyj zewnętrznych pakietów
jeśli upraszczają kod.
```

**Dobrze:**
```
Używaj TYLKO standardowej biblioteki Python. Żadnych zewnętrznych zależności.
```

LUB:

```
Możesz używać popularnych pakietów npm (lodash, date-fns).
Dla podstawowych operacji preferuj natywne metody JS.
```

### 3. Opisz idealny output

Powiedz GPT jak ma wyglądać odpowiedź.

```
Format odpowiedzi:
- Najpierw krótkie podsumowanie (2-3 zdania)
- Następnie szczegółowa analiza w punktach
- Na końcu rekomendacje z priorytetami (wysoki/średni/niski)
```

---

## Strukturyzacja promptów

### Preferowana struktura

```
## Rola
Jesteś [rola] specjalizującym się w [dziedzina].

## Kontekst
[Tło i sytuacja]

## Zadanie
[Konkretne polecenie]

## Wymagania
- [Wymaganie 1]
- [Wymaganie 2]

## Format odpowiedzi
[Oczekiwany format]

## Przykład (opcjonalnie)
Input: [przykład]
Output: [oczekiwany output]
```

### System Prompt vs User Prompt

**System Prompt** - stałe instrukcje definiujące zachowanie:
```
Jesteś doświadczonym code reviewerem. Analizujesz kod pod kątem:
bezpieczeństwa, wydajności, czytelności i zgodności z best practices.
Odpowiadasz zwięźle i konstruktywnie.
```

**User Prompt** - konkretne zadanie:
```
Przeanalizuj poniższą funkcję:
[kod]
```

---

## Techniki specyficzne

### Parallel Tool Calls

GPT-5.2 efektywnie wykonuje narzędzia równolegle. Zachęcaj do tego:

```
Gdy skanujesz codebase lub pobierasz dane z wielu źródeł,
wykonuj operacje równolegle gdzie to możliwe.
```

W opisie narzędzia:
```
"description": "Pobiera dane użytkownika. Można wywoływać równolegle
dla wielu użytkowników."
```

### Prompt Optimizer

OpenAI oferuje narzędzie Prompt Optimizer które automatycznie przepisuje prompty:
- Dodaje strukturę
- Eliminuje niejasności
- Dodaje obsługę błędów

Rozważ użycie przed finalnym wdrożeniem.

### Code Editing

Dla edycji kodu w istniejących projektach:

```
Podczas implementacji zmian w istniejącym kodzie:
1. Zachowaj istniejący styl i konwencje
2. Szukaj kontekstu w codebase przed zmianami
3. Nie wprowadzaj zmian stylistycznych poza zakresem zadania
```

---

## Chain of Thought (CoT)

GPT-5.2 naturalnie rozumuje krok po kroku. Możesz to wzmocnić:

```
Rozwiąż ten problem krok po kroku:
1. Najpierw zidentyfikuj kluczowe elementy
2. Następnie przeanalizuj zależności
3. Zaproponuj rozwiązanie z uzasadnieniem
4. Zweryfikuj poprawność
```

Dla prostszych zadań wystarczy:
```
Wyjaśnij swoje rozumowanie przed odpowiedzią.
```

---

## Few-Shot Prompting

Przykłady znacząco poprawiają jakość. Format:

```
Przekształć opis w SQL query.

Przykład 1:
Input: "wszyscy użytkownicy z Warszawy"
Output: SELECT * FROM users WHERE city = 'Warszawa';

Przykład 2:
Input: "produkty droższe niż 100 zł posortowane po cenie"
Output: SELECT * FROM products WHERE price > 100 ORDER BY price DESC;

Teraz:
Input: "[twój opis]"
Output:
```

---

## Parametry API

| Parametr | Rekomendacja |
|----------|--------------|
| Model | `gpt-5.2` |
| Temperature | 0-0.3 dla faktów, 0.7-1.0 dla kreatywności |
| Max tokens | Dostosuj do zadania |
| Top P | 1.0 (domyślna) |

### Temperatura wg zastosowania:
- **0**: Kod, fakty, analiza danych
- **0.3**: Techniczne pisanie, dokumentacja
- **0.7**: Ogólne konwersacje, brainstorming
- **1.0**: Kreatywne pisanie, generowanie pomysłów

---

## Role-based Prompting

Definiowanie roli znacząco wpływa na jakość:

```
Jesteś senior backend developerem z 10-letnim doświadczeniem
w architekturze mikroserwisów i optymalizacji baz danych.

Twoim zadaniem jest...
```

### Skuteczne role:
- "doświadczony [specjalizacja]"
- "ekspert w [dziedzina]"
- "[zawód] pracujący w [kontekst]"

---

## Negative Prompting

Określ czego NIE robić (ale ostrożnie - może powodować mieszane sygnały):

```
Wymagania:
- Odpowiadaj po polsku
- Nie używaj żargonu technicznego
- Nie sugeruj zewnętrznych narzędzi
- Skup się na rozwiązaniach natywnych
```

---

## Checklist przed wysłaniem promptu

- [ ] Prompt jest specyficzny i jednoznaczny
- [ ] Brak mieszanych/sprzecznych sygnałów
- [ ] Zdefiniowana rola (jeśli potrzebna)
- [ ] Jasny format oczekiwanego outputu
- [ ] Przykłady (few-shot) dla złożonych zadań
- [ ] Kontekst skonsolidowany w jednym miejscu
- [ ] Temperatura dostosowana do typu zadania
