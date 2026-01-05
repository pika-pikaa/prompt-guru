# Przykłady Optymalizacji Promptów

Prezentacja przed/po dla różnych modeli i typów zadań.

---

## Przykład 1: Code Review

### Cel użytkownika:
"Chcę żeby AI przejrzało mój kod"

### PRZED (słaby prompt):
```
Przejrzyj ten kod:

function calc(a,b) {
  return a+b
}
```

### PO optymalizacji:

#### Claude 4.5 Opus (Rozbudowany):
```xml
<context>
Projekt: Kalkulator finansowy
Język: JavaScript
Standard: ES6+
</context>

<task>
Przeprowadź code review poniższej funkcji.
</task>

<code>
function calc(a,b) {
  return a+b
}
</code>

<review_criteria>
- Poprawność typów i edge cases
- Nazewnictwo i czytelność
- Potencjalne błędy
- Zgodność z best practices
</review_criteria>

<output_format>
Lista problemów z priorytetami i konkretnymi sugestiami poprawy.
Pokaż kod przed i po dla każdej sugestii.
</output_format>
```

#### GPT-5.2 (Standardowy):
```
Przejrzyj tę funkcję JavaScript pod kątem:
1. Edge cases i walidacji
2. Nazewnictwa
3. Typowania

Kod:
```javascript
function calc(a,b) {
  return a+b
}
```

Format: Lista problemów z priorytetami + przykłady poprawionego kodu.
```

#### Grok 4.1 (Minimalny):
```
Code review tej funkcji JS - główne problemy:

function calc(a,b) { return a+b }
```

---

## Przykład 2: Napisanie funkcji

### Cel użytkownika:
"Potrzebuję funkcji do walidacji emaila"

### PRZED (słaby prompt):
```
Napisz funkcję walidacji email
```

### PO optymalizacji:

#### Claude 4.5 Sonnet (Rozbudowany):
```xml
<task>
Napisz funkcję walidującą adresy email.
</task>

<requirements>
- Język: TypeScript
- Zwraca: { valid: boolean, error?: string }
- Waliduje: format, długość, niedozwolone znaki
- Obsługuje: wielkie litery, subdomeny, + aliasy
</requirements>

<constraints>
Nie używaj zewnętrznych bibliotek.
Regex musi być czytelny (skomentowany).
</constraints>

<examples>
Valid: "user@example.com", "user+tag@sub.domain.com"
Invalid: "user@", "@domain.com", "user space@domain.com"
</examples>
```

#### Gemini 3 Pro (Standardowy):
```
Napisz funkcję TypeScript walidującą email.
Zwraca { valid: boolean, error?: string }.
Obsłuż aliasy (+tag) i subdomeny.
Bez zewnętrznych zależności.
```

#### Grok 4.1 (Minimalny):
```
Funkcja TS walidująca email - zwraca { valid, error? }
```

---

## Przykład 3: System Prompt dla Chatbota

### Cel użytkownika:
"Chatbot do obsługi klienta sklepu internetowego"

### PRZED (słaby prompt):
```
Bądź pomocny dla klientów
```

### PO optymalizacji:

#### Claude 4.5 (Rozbudowany):
```xml
<role>
Jesteś asystentem obsługi klienta sklepu TechShop.pl.
</role>

<personality>
- Przyjazny i profesjonalny
- Cierpliwy nawet przy trudnych pytaniach
- Proaktywny w oferowaniu pomocy
</personality>

<capabilities>
- Informacje o produktach i dostępności
- Status zamówień (pytaj o numer)
- Procedury zwrotów i reklamacji
- Podstawowe pytania techniczne
</capabilities>

<limitations>
- Nie masz dostępu do płatności - kieruj do formularza
- Nie możesz anulować zamówień - kieruj na infolinię
- Przy złożonych reklamacjach - zbierz dane i przekaż do człowieka
</limitations>

<communication_style>
Krótkie odpowiedzi. Używaj list kroków dla procedur.
Potwierdzaj zrozumienie problemu przed odpowiedzią.
</communication_style>

<example_interaction>
User: Gdzie jest moje zamówienie?
Assistant: Chętnie sprawdzę status Twojego zamówienia! Podaj proszę numer zamówienia (znajdziesz go w emailu potwierdzającym, zaczyna się od TS-).
</example_interaction>
```

#### GPT-5.2 (Standardowy):
```
Jesteś asystentem obsługi klienta TechShop.pl.

Możesz: informować o produktach, sprawdzać zamówienia (pytaj o numer), wyjaśniać zwroty/reklamacje.

Nie możesz: przetwarzać płatności, anulować zamówień. Kieruj do odpowiednich kanałów.

Styl: przyjazny, zwięzły, proaktywny. Potwierdzaj zrozumienie przed odpowiedzią.
```

#### Gemini 3 (Minimalny):
```
Asystent obsługi TechShop.pl. Informujesz o produktach i zamówieniach.
Nie przetwarzasz płatności - kieruj na infolinię.
Styl: przyjazny, krótkie odpowiedzi.
```

---

## Przykład 4: Analiza danych

### Cel użytkownika:
"Przeanalizuj te dane sprzedażowe"

### PRZED (słaby prompt):
```
Przeanalizuj dane:
[dane]
```

### PO optymalizacji:

#### Claude 4.5 Opus (Rozbudowany):
```xml
<context>
Dane sprzedażowe Q4 2024 dla działu elektroniki.
Cel: Przygotowanie raportu dla zarządu.
</context>

<data>
[dane CSV/tabela]
</data>

<analysis_tasks>
1. Identyfikacja trendów sprzedaży (wzrost/spadek vs Q3)
2. Top 5 produktów i bottom 5
3. Sezonowość (czy grudzień odbiegał)
4. Anomalie wymagające wyjaśnienia
</analysis_tasks>

<output_format>
## Executive Summary
[3 zdania - kluczowe wnioski]

## Trendy
[wizualizacja słowna + liczby]

## Rekomendacje
[konkretne działania z priorytetami]
</output_format>
```

#### GPT-5.2 (Standardowy):
```
Przeanalizuj dane sprzedażowe Q4 2024:

[dane]

Raport powinien zawierać:
1. Trendy vs poprzedni kwartał
2. Top/bottom produkty
3. Anomalie
4. Rekomendacje

Format: Executive summary + szczegóły + rekomendacje z priorytetami.
```

#### Gemini 3 (Minimalny):
```
[dane]

Kluczowe trendy, anomalie i 3 rekomendacje dla zarządu.
```

---

## Przykład 5: Generowanie obrazu (Nano Banana)

### Cel użytkownika:
"Zdjęcie produktowe słuchawek"

### PRZED (słaby prompt):
```
Słuchawki
```

### PO optymalizacji:

#### Rozbudowany:
```
Nowoczesne słuchawki bezprzewodowe w kolorze czarnym matowym,
unoszące się lekko nad minimalistycznym białym podłożem.
Profesjonalne oświetlenie studyjne z delikatnym blaskiem
podkreślającym eleganckie linie produktu.
Tło gradientowe od jasnoszarego do białego.
Lekki cień pod słuchawkami dodający głębi.
Styl: premium tech product photography.
```

#### Standardowy:
```
Czarne słuchawki bezprzewodowe na białym tle.
Oświetlenie studyjne. Minimalistyczny styl.
Premium product photo.
```

#### Minimalny:
```
Eleganckie czarne słuchawki bezprzewodowe,
białe tło, profesjonalne oświetlenie studyjne.
```

---

## Przykład 6: Tłumaczenie techniczne

### Cel użytkownika:
"Przetłumacz dokumentację API"

### PRZED (słaby prompt):
```
Przetłumacz na polski:
[tekst angielski]
```

### PO optymalizacji:

#### Claude 4.5 (Rozbudowany):
```xml
<task>
Przetłumacz dokumentację API z angielskiego na polski.
</task>

<source_text>
[tekst]
</source_text>

<translation_guidelines>
- Terminy techniczne: zachowaj oryginalne (endpoint, request, response)
- Komendy/kod: nie tłumacz
- Ton: profesjonalny, techniczny
- Czytelnik: developer ze znajomością angielskiego technicznego
</translation_guidelines>

<preserve>
- Formatowanie markdown
- Przykłady kodu
- Linki
</preserve>
```

#### GPT-5.2 (Standardowy):
```
Przetłumacz na polski (dokumentacja techniczna):

[tekst]

Zachowaj: terminy techniczne po angielsku (endpoint, request),
formatowanie markdown, przykłady kodu bez zmian.
Ton: profesjonalny, dla developerów.
```

#### Gemini 3 (Minimalny):
```
Na polski, zachowaj terminy techniczne i formatowanie:

[tekst]
```

---

---

## Przykład 7: Optymalizacja istniejącego promptu (Claude)

### Oryginalny prompt użytkownika:
```
Napisz mi artykuł o AI. Powinien być dobry i interesujący.
Think about what readers want to know. Make it engaging.
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Brak konkretnego tematu | "AI" to zbyt szerokie pojęcie |
| Niejasne kryteria | "dobry i interesujący" nie mówi nic konkretnego |
| Słowo "think" | Claude 4.5 może reagować nieoptymalnie bez extended thinking |
| Brak formatu | Nie wiadomo jaka długość, struktura, dla kogo |
| Mieszane języki | Polski + angielski może powodować niespójność |

### Zoptymalizowany prompt:

```xml
<context>
Blog technologiczny dla przedsiębiorców.
Czytelnik: CEO/CTO bez głębokiej wiedzy technicznej.
</context>

<task>
Napisz artykuł o praktycznych zastosowaniach AI w małych i średnich firmach.
</task>

<requirements>
- Długość: 800-1000 słów
- 3-4 konkretne przykłady zastosowań z branż: e-commerce, usługi, produkcja
- Każdy przykład z szacunkowym ROI lub oszczędnością czasu
- Ton: przystępny, bez żargonu technicznego
</requirements>

<structure>
1. Hook - zaskakująca statystyka o adopcji AI w MŚP
2. Problem - dlaczego firmy boją się AI
3. Rozwiązania - 3-4 przykłady z rezultatami
4. CTA - pierwszy krok do wdrożenia
</structure>

<output_format>
Artykuł w markdown z nagłówkami H2 i H3.
Wyróżnij kluczowe liczby pogrubieniem.
</output_format>
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Usunięto "think" | Zamienione na konkretną strukturę |
| Dodano kontekst odbiorcy | Jasne dla kogo piszemy |
| Sprecyzowano temat | "AI w MŚP" zamiast "AI" |
| Dodano mierzalne kryteria | Długość, liczba przykładów, struktura |
| Ujednolicono język | Całość po polsku |
| Dodano format outputu | Markdown z konkretnymi wytycznymi |

---

## Przykład 8: Optymalizacja istniejącego promptu (GPT-5.2)

### Oryginalny prompt użytkownika:
```
Jesteś pomocnym asystentem. Preferuj krótkie odpowiedzi, ale jeśli temat
tego wymaga to możesz pisać dłużej. Staraj się być precyzyjny, ale
czasem możesz użyć prostszego języka jeśli to pomoże.
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Mieszane sygnały | "krótkie, ale możesz dłużej" - sprzeczne instrukcje |
| "Staraj się" | Nieokreślone - co to znaczy "starać się"? |
| Brak konkretnej roli | "Pomocny asystent" to za mało |
| Brak domeny | Nie wiadomo w czym pomaga |
| Warunkowe instrukcje | "jeśli temat wymaga", "czasem możesz" - niejednoznaczne |

### Zoptymalizowany prompt:

```markdown
## Rola
Jesteś asystentem ds. produktywności dla programistów.

## Styl komunikacji
- Odpowiedzi: 2-4 zdania dla prostych pytań
- Dla złożonych tematów: wprowadzenie + lista kroków + podsumowanie
- Język: techniczny, zakładaj znajomość podstaw programowania

## Priorytet odpowiedzi
1. Bezpośrednia odpowiedź na pytanie
2. Przykład kodu/komendy jeśli dotyczy
3. Link do dokumentacji tylko gdy użytkownik prosi

## Nie rób
- Nie tłumacz podstawowych pojęć (jak pętla, zmienna)
- Nie dodawaj zastrzeżeń typu "pamiętaj że to zależy od kontekstu"
- Nie proponuj alternatyw jeśli użytkownik nie prosi
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Usunięto "ale/czasem/możesz" | Jednoznaczne instrukcje zamiast warunkowych |
| Dodano konkretną rolę | "Asystent produktywności dla programistów" |
| Sprecyzowano długość | "2-4 zdania" zamiast "krótkie" |
| Dodano priorytety | Jasna hierarchia co ważniejsze |
| Sekcja "Nie rób" | Konkretne zakazy zamiast "staraj się" |

---

## Przykład 9: Optymalizacja istniejącego promptu (Gemini)

### Oryginalny prompt użytkownika:
```
Jesteś ekspertem od analizy danych. Kiedy dostajesz dane, najpierw
dokładnie je przeanalizuj krok po kroku. Następnie wyciągnij wnioski.
Na końcu zaproponuj rekomendacje. Bądź bardzo szczegółowy i dokładny.
Zwróć uwagę na wszystkie możliwe aspekty danych. Pamiętaj żeby sprawdzić
czy nie ma błędów lub anomalii. Twoja analiza powinna być kompleksowa
i wyczerpująca.
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Za długi | Gemini wymaga 30-50% krótszych promptów |
| Ręczny chain of thought | "krok po kroku" - lepiej użyć thinking_level |
| Nadmiarowe wzmocnienia | "bardzo", "dokładnie", "wyczerpująca" - nie pomagają |
| Instrukcje na początku | Gemini preferuje kluczowe instrukcje na końcu |

### Zoptymalizowany prompt:

```markdown
Rola: Analityk danych

Cel: Przeanalizuj podane dane i przygotuj raport

Format raportu:
1. Kluczowe wnioski (3-5 punktów)
2. Anomalie (jeśli występują)
3. Rekomendacje z priorytetami

[DANE TUTAJ]

Skup się na actionable insights dla decyzji biznesowych.
```

**Ustawienia API:**
```
thinking_level: "high"
temperature: 1.0
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Skrócono o ~60% | Gemini działa lepiej z krótszymi promptami |
| Usunięto "krok po kroku" | Zastąpione thinking_level: "high" |
| Usunięto wzmocnienia | "bardzo/dokładnie" nie wpływają na jakość |
| Kluczowa instrukcja na końcu | "Skup się na actionable insights" |
| Prosta struktura | Role + Goal + Format |

---

## Przykład 10: Optymalizacja promptu obrazowego (Nano Banana)

### Oryginalny prompt użytkownika:
```
professional product photography, wireless earbuds, white background,
8k resolution, octane render, hyperrealistic, studio lighting,
volumetric lighting, depth of field, bokeh, sharp focus, ultra detailed,
unreal engine 5, ray tracing, photorealistic render, 35mm lens
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Techniczne parametry | Nano Banana nie rozumie "octane render", "unreal engine" |
| Brak opisu sceny | Same parametry, zero kontekstu wizualnego |
| Nadmiarowe szczegóły | "8k", "ray tracing" - niepotrzebne |
| Styl Midjourney/SD | Nano Banana wymaga naturalnego języka |

### Zoptymalizowany prompt:

```
Eleganckie białe słuchawki bezprzewodowe w otwartym etui ładującym.
Stoją na minimalistycznym białym podłożu.
Profesjonalne oświetlenie studyjne - główne światło z góry,
delikatne wypełnienie z boku podkreślające kształt produktu.
Miękki cień pod etui dodający głębi.
Tło: czyste, gradientowe od białego do jasnoszarego.
Styl: premium product photography jak w reklamie Apple.
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Usunięto parametry renderowania | Nano Banana nie używa Octane/Unreal |
| Opisano scenę słowami | Co, gdzie, jak oświetlone |
| Naturalny język | Zamiast keywords - pełne zdania |
| Konkretna inspiracja | "Jak w reklamie Apple" - zrozumiałe |
| Opisano oświetlenie słowami | "Z góry, wypełnienie z boku" zamiast "volumetric" |

---

## Podsumowanie wzorców

| Aspekt | Rozbudowany | Standardowy | Minimalny |
|--------|-------------|-------------|-----------|
| Kontekst | Pełny | Kluczowy | Brak/minimalny |
| Struktura | XML/sekcje | Markdown | Jedno zdanie |
| Przykłady | Tak | Opcjonalnie | Nie |
| Format outputu | Szczegółowy | Zarysowany | Domyślny |
| Dla kogo | Złożone zadania | Większość przypadków | Proste zadania |

---

## Podsumowanie optymalizacji

### Najczęstsze błędy do poprawy:

| Błąd | Rozwiązanie |
|------|-------------|
| Mieszane sygnały | Wybierz jedną opcję, usuń "ale", "czasem" |
| Niejasny cel | Sprecyzuj CO i DLA KOGO |
| "Think" dla Claude | Zamień na "consider", "evaluate", "assess" |
| Za długi dla Gemini | Skróć o 30-50%, instrukcje na końcu |
| Parametry techniczne dla Nano Banana | Użyj naturalnego języka |
| Brak formatu outputu | Zawsze określ oczekiwaną strukturę |

### Checklist optymalizacji:
- [ ] Usunięto sprzeczne instrukcje
- [ ] Sprecyzowano cel i odbiorcę
- [ ] Dostosowano do specyfiki modelu
- [ ] Określono format outputu
- [ ] Usunięto nadmiarowe słowa ("bardzo", "dokładnie")
- [ ] Sprawdzono zabronione wzorce (np. "think" dla Claude)
