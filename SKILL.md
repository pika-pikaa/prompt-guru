---
name: prompt-guru
description: Generuje zoptymalizowane prompty dla modeli AI (Claude 4.5, GPT-5.2, Grok 4.1, Gemini 3 Pro, Nano Banana). Używaj gdy potrzebujesz stworzyć prompt, zoptymalizować istniejący prompt, lub wygenerować prompt dla konkretnego modelu. Tworzy 3 wersje (rozbudowana, standardowa, minimalna).
---

# Prompt Guru

Specjalistyczny skill do tworzenia i optymalizacji promptów dla różnych modeli AI w oparciu o oficjalne najlepsze praktyki.

## Obsługiwane modele

### Modele językowe (LLM)
| Model | Producent | Specjalizacja | Plik |
|-------|-----------|---------------|------|
| Claude 4.5 Opus | Anthropic | Najwyższa jakość, złożone zadania | [claude-4.md](models/claude-4.md) |
| Claude 4.5 Sonnet | Anthropic | Szybki, zbalansowany | [claude-4.md](models/claude-4.md) |
| ChatGPT 5.2 | OpenAI | Precyzyjny, wieloetapowy | [gpt-5.md](models/gpt-5.md) |
| Grok 4.1 | xAI | Aktualne informacje, iteracyjny | [grok-4.md](models/grok-4.md) |
| Gemini 3 Pro | Google | Multimodal, długi kontekst | [gemini-3.md](models/gemini-3.md) |

### Modele obrazowe
| Model | Producent | Specjalizacja | Plik |
|-------|-----------|---------------|------|
| Nano Banana 2.5 | Google DeepMind | Generowanie i edycja obrazów | [nano-banana.md](models/nano-banana.md) |

### Który model wybrać?

| Zadanie | Najlepszy wybór | Alternatywa |
|---------|-----------------|-------------|
| Code Review | Claude 4.5 Opus | GPT-5.2 |
| Szybkie kodowanie | Claude 4.5 Sonnet | Grok 4.1 |
| Aktualne informacje | Grok 4.1 (DeepSearch) | - |
| Długie dokumenty (>100k) | Gemini 3 Pro (1M tokenów) | Claude |
| Generowanie obrazów | Nano Banana 2.5 | - |
| Pisanie kreatywne | GPT-5.2 (temp 1.0) | Claude |
| Analiza multimodalna | Gemini 3 Pro | Claude |

## Zasoby

- [Szablony System Prompts](templates/system-prompts.md)
- [Szablony Task Prompts](templates/task-prompts.md)
- [Szablony Image Prompts](templates/image-prompts.md)
- [Przykłady optymalizacji](examples/showcase.md)

---

## Tryby pracy

### Tryb 1: Tworzenie nowego promptu
Użyj gdy użytkownik chce stworzyć nowy prompt od podstaw.

### Tryb 2: Optymalizacja istniejącego promptu
Użyj gdy użytkownik podaje swój istniejący prompt do ulepszenia.

---

## Quick Recipes - Szybkie ścieżki

Dla częstych przypadków użyj skróconych ścieżek:

| Gdy użytkownik mówi... | Akcja |
|------------------------|-------|
| "code review", "review kodu" | Model: Claude Sonnet (domyślnie), szablon: Code Review |
| "system prompt", "chatbot", "asystent" | Zapytaj tylko: Jaka rola? Dla jakiej firmy/projektu? |
| "obraz", "zdjęcie", "grafika" | Model: Nano Banana (auto), zapytaj: Co ma przedstawiać? |
| "tłumaczenie", "przetłumacz" | Zapytaj: Z jakiego na jaki język? Jaki styl? |
| "podsumowanie", "streszczenie" | Zapytaj: Jak długie? Dla kogo? |

---

## Procedura: Tworzenie nowego promptu

### KROK 1: Zbieranie kontekstu

#### A) Tryb Szybki
Użyj gdy użytkownik podaje konkretne, jasne zadanie.

Zadaj tylko 2-3 pytania:

1. **Model docelowy**: "Dla którego modelu?"
   - Claude 4.5 Opus (najwyższa jakość)
   - Claude 4.5 Sonnet (szybki, zbalansowany) ← domyślny
   - ChatGPT 5.2 (OpenAI)
   - Grok 4.1 (aktualne informacje)
   - Gemini 3 Pro (multimodal, długi kontekst)
   - Nano Banana 2.5 (obrazy)

2. **Wersja promptu**: "Którą wersję chcesz?"
   - **Rozbudowana** - dla złożonych zadań, API, produkcji
   - **Standardowa** - dla większości przypadków ← domyślna
   - **Minimalna** - szybkie eksperymenty, prototypowanie
   - **Wszystkie 3** - dla porównania

3. **Dodatkowe wymagania**: "Coś jeszcze powinienem wiedzieć?" (opcjonalne)

#### B) Tryb Pełny
Użyj gdy zadanie jest złożone, niestandardowe lub niejasne.

Zadaj wszystkie pytania:

1. **Cel**: "Jaki jest główny cel Twojego promptu? Co chcesz osiągnąć?"

2. **Model docelowy**: (jak wyżej)

3. **Typ zadania**:
   - Generowanie kodu
   - Analiza / research
   - Pisanie kreatywne
   - Tłumaczenie / edycja
   - Rozwiązywanie problemów
   - Generowanie obrazów (tylko Nano Banana)
   - Inne

4. **Ton i styl**:
   - Formalny / profesjonalny
   - Swobodny / konwersacyjny
   - Techniczny / szczegółowy
   - Zwięzły / na temat

5. **Wersja promptu**: (jak wyżej)

6. **Dodatkowy kontekst**:
   - Specyficzne wymagania
   - Ograniczenia
   - Przykłady oczekiwanego outputu

### KROK 2: Załadowanie praktyk modelu

Po zebraniu kontekstu, załaduj odpowiedni plik z `models/`:
- Claude: [models/claude-4.md](models/claude-4.md)
- GPT-5.2: [models/gpt-5.md](models/gpt-5.md)
- Grok: [models/grok-4.md](models/grok-4.md)
- Gemini: [models/gemini-3.md](models/gemini-3.md)
- Nano Banana: [models/nano-banana.md](models/nano-banana.md)

**Skup się na sekcji TL;DR** na początku pliku - zawiera najważniejsze zasady.

### KROK 3: Załadowanie szablonu

W zależności od typu zadania:
- System prompt → [templates/system-prompts.md](templates/system-prompts.md)
- Task prompt → [templates/task-prompts.md](templates/task-prompts.md)
- Image prompt → [templates/image-prompts.md](templates/image-prompts.md)

### KROK 4: Generowanie promptu

Wygeneruj TYLKO wybraną wersję (lub wszystkie jeśli użytkownik wybrał "Wszystkie 3"):

#### Wersja ROZBUDOWANA
- Pełna implementacja wszystkich technik dla danego modelu
- Szczegółowe instrukcje i kontekst
- Przykłady (few-shot) jeśli odpowiednie
- XML tagi/struktura jeśli model je preferuje
- Dla zaawansowanych użytkowników i złożonych zadań

#### Wersja STANDARDOWA
- Zbalansowane podejście
- Kluczowe techniki bez nadmiarowości
- Jasna struktura
- Dla większości przypadków użycia

#### Wersja MINIMALNA
- Esencja celu w zwięzłej formie
- Tylko niezbędne elementy
- Dla prostych zadań i szybkich interakcji

### KROK 4.5: Walidacja promptu

Przed prezentacją sprawdź:
- [ ] Zawiera wszystkie wymagania użytkownika
- [ ] Respektuje ograniczenia modelu (np. brak "think" dla Claude bez extended thinking)
- [ ] Ma odpowiednią długość (Gemini = 30-50% krótsze)
- [ ] Nie zawiera wewnętrznych sprzeczności
- [ ] Format outputu jest jasno określony

**Automatyczne poprawki:**
- **Claude**: Zamień "think/thinking" na "consider/evaluate/assess"
- **Gemini**: Sprawdź czy nie za długi, kluczowe instrukcje na końcu
- **GPT**: Sprawdź czy nie ma mieszanych sygnałów ("preferuj X, ale Y też ok")

### KROK 5: Prezentacja wyniku

```markdown
## Prompt dla [Nazwa Modelu] - Wersja [Wybrana]

### Twój Prompt
```
[Wygenerowany prompt gotowy do skopiowania]
```

---

### Zastosowane techniki
- [Technika 1]: [krótkie wyjaśnienie]
- [Technika 2]: [krótkie wyjaśnienie]

### Wskazówki użycia
- **Parametry API**: [temperatura, max_tokens]
- **Czego unikać**: [specyficzne dla modelu]

---

💡 **Chcesz inną wersję?** Powiedz "rozbudowana", "minimalna" lub "wszystkie 3"
```

---

## Procedura: Optymalizacja istniejącego promptu

### Kiedy użyć
Użytkownik podaje swój istniejący prompt i chce go ulepszyć.

### KROK 1: Zbieranie informacji

1. Poproś o oryginalny prompt (jeśli nie podany)
2. Zapytaj o model docelowy
3. Zapytaj: "Co nie działa? Czego oczekujesz?"

### KROK 2: Analiza promptu

Przeanalizuj oryginalny prompt pod kątem:

**Zgodność z praktykami modelu:**
- Czy używa preferowanej struktury? (XML dla Claude, Markdown dla GPT)
- Czy unika zabronionych wzorców? (np. "think" dla Claude)
- Czy ma odpowiednią długość? (Gemini = krótsze)

**Kompletność:**
- Czy ma jasno określony cel?
- Czy zawiera kontekst/motywację?
- Czy określa format outputu?
- Czy potrzebuje przykładów (few-shot)?

**Jasność instrukcji:**
- Czy instrukcje są explicite?
- Czy nie ma sprzeczności?
- Czy jest jednoznaczny?

### KROK 3: Wygenerowanie zoptymalizowanej wersji

### KROK 4: Prezentacja z wyjaśnieniem zmian

```markdown
## Analiza Oryginalnego Promptu

### Zidentyfikowane problemy:
1. **[Problem]**: [Opis dlaczego to problem]
2. **[Problem]**: [Opis]

### Co działa dobrze:
- [Pozytywny aspekt]

---

## Zoptymalizowany Prompt

```
[Nowy, ulepszony prompt]
```

---

## Wprowadzone Zmiany

| Zmiana | Powód |
|--------|-------|
| [Co zmieniono] | [Dlaczego] |
| [Co zmieniono] | [Dlaczego] |

---

💡 **Chcesz dalej iterować?** Powiedz co jeszcze poprawić.
```

---

## Szybkie referencje

### Kluczowe różnice między modelami

| Aspekt | Claude 4.5 | GPT-5.2 | Grok 4.1 | Gemini 3 |
|--------|------------|---------|----------|----------|
| Dosłowność | Bardzo wysoka | Wysoka | Średnia | Wysoka |
| Preferowana struktura | XML tagi | Markdown | Markdown/XML | Role+Goal+Constraints |
| Słowo "think" | **Unikać!** | OK | OK (think mode) | OK |
| Temperatura | Domyślna | Domyślna | Domyślna | **1.0 (nie zmieniać!)** |
| Długość promptu | Explicite | Skonsolidowany | Iteracyjny | **30-50% krócej** |

### Błędy do unikania

| Model | Krytyczny błąd |
|-------|----------------|
| Claude 4.5 | Używanie "think" bez extended thinking |
| GPT-5.2 | Mieszane sygnały ("preferuj X, ale Y też ok") |
| Grok 4.1 | Zbyt długie prompty zamiast iteracji |
| Gemini 3 | Obniżanie temperatury poniżej 1.0 |
| Nano Banana | Zbyt techniczne opisy zamiast naturalnego języka |

---

## Rozwiązywanie problemów

### "Model nie robi tego co chcę"
- Czy instrukcje są **explicite**? (szczególnie dla Claude 4.5)
- Czy format outputu jest jasno określony?
- Czy brakuje przykładów (few-shot)?
- Czy kontekst jest wystarczający?

### "Odpowiedzi są za długie/za krótkie"
Dodaj konkretne ograniczenie:
```
Odpowiedz w maksymalnie 3 zdaniach.
Odpowiedz w 5-7 punktach.
Limit: 200 słów.
```

### "Model ignoruje część instrukcji"
- Użyj **XML tagów** dla struktury (szczególnie Claude)
- Umieść **kluczowe instrukcje na końcu** promptu (szczególnie Gemini)
- Sprawdź czy nie ma **sprzecznych instrukcji**
- Podziel złożone zadanie na mniejsze kroki

### "Model halucynuje / wymyśla fakty"
Dodaj:
```
Odpowiadaj TYLKO na podstawie podanych danych.
Jeśli nie masz pewnych informacji - powiedz wprost że nie wiesz.
Nie wymyślaj faktów ani źródeł.
```

### "Odpowiedzi są niespójne"
- Dodaj **przykłady (few-shot)** oczekiwanego formatu
- Użyj **niższej temperatury** (nie dotyczy Gemini!)
- Określ format outputu bardziej precyzyjnie

---

## Przykład użycia

**Użytkownik**: Potrzebuję prompt do code review

**Prompt Guru** (Tryb Szybki):
1. "Dla którego modelu? [domyślnie: Claude 4.5 Sonnet]"
2. "Którą wersję? [rozbudowana / standardowa / minimalna]"
3. Ładuje praktyki Claude z sekcji TL;DR
4. Generuje wybraną wersję promptu
5. Prezentuje z zastosowanymi technikami i wskazówkami
